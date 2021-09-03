import pandas as pd
import numpy as np
import time
import sys
import multiprocessing

from .MetaCVI import Meta_CVI
from .MetaAlgorithm import Algorithm
from .cvi import Validation
from multiprocessing import Process

from sklearn import metrics
from deap import base, creator, tools, algorithms

from .HyperPartitions import *
from .GeneticMethods import *


class CSmartML:
	def __init__(self, filename, population, time_budget, publish, meta_cvi=False, algorithm=None, cvi=None, dataset=None, result="multi"):

		self.time = time_budget
		self.filename = filename
		self.resultPreference = result

		# Load benchmark dataset or use uploaded dataset
		if dataset is None:
			self.data = pd.read_csv("./csmartml/datasets/{}.csv".format(filename)).iloc[:, :-1]
		else:
			self.data = dataset

		# Set algorithms and cvi by prescribed or meta-learning
		if meta_cvi:
			self.algorithm = Algorithm(filename, "distance", dataset).search()
			publish({
				"label": "Getting recommended metrics...",
				"algorithm": self.resolve_abbr()}, "message")
			self.cvi = Meta_CVI(filename, "distance", dataset).search(self.algorithm)
			publish({
				"label": "Generating hyper-partitions...",
				"metric": self.resolve_metrics()}, "message")
		else:
			self.algorithm = algorithm
			self.cvi = cvi

		# Creator: Assign Fitness Function (eg. multi-objective)
		fitness_weights = (np.float(self.cvi[0][1]), np.float(self.cvi[1][1]), np.float(self.cvi[2][1]))
		creator.create("FitnessMulti", base.Fitness, weights=fitness_weights)
		creator.create("Individual", list, fitness=creator.FitnessMulti)

		# Generate Hyper-Partitions
		hp_model = HyperPartitions(self.algorithm, self.data)
		hp_set = hp_model.hyper_param_combination()
		publish({"label": "{} hyper-partitions generated...".format(len(hp_set))}, "message")

		# Generate models for hyper-partition and assign mx/cx
		# Assign individual toolbox

		partition_id = 0
		self.toolbox = dict()
		self.partitions = dict()
		self.models = dict()

		publish({"label": "Setting search methods for partitions..."}, "message")
		for partition in hp_set:
			p_id = "P{}".format(partition_id)
			mx = self.Mode(partition, self.data, self.algorithm)
			toolbox = base.Toolbox()
			toolbox.register("individual", tools.initRepeat, creator.Individual, mx.gen_population, n=1)
			toolbox.register("population", tools.initRepeat, list, toolbox.individual)
			toolbox.register("evaluate", self.fitness_function)
			toolbox.register("select", tools.selNSGA2)
			if len(partition) > 1:
				toolbox.register("mate", mx.crossover)
				toolbox.register("mutate", mx.mutate)

			self.toolbox[p_id] = toolbox
			self.partitions[p_id] = partition
			partition_id += 1

		# EA parameter initialization
		self.pop_size = population

		# Main toolbox for final selection
		self.main_toolbox = base.Toolbox()
		self.main_toolbox.register("evaluate", self.fitness_function)
		self.main_toolbox.register("select", tools.selNSGA2)

	# Return recommended cluster validation metrics
	def get_selected_metrics(self):
		return self.cvi

	# Return recommended cluster validation metrics
	def get_selected_algorithm(self):
		return self.algorithm

	# Get full algorithm name
	def resolve_abbr(self):
		ABRR_ALGORITHMS = {
			"db": "DBSCAN",
			"ag": "Agglomerated Clustering",
			"optics": "OPTICS",
			"ap": "Affinity Propagation",
			"kmeans": "K-Means Clustering",
			"birch": "Birch Clustering",
			"spectral": "Spectral Clustering",
			"meanshift": "MeanShift Clustering"
		}

		return ABRR_ALGORITHMS[self.algorithm]

	# Get full algorithm name
	def resolve_metrics(self):
		cvi = []
		for metric in self.cvi:
			cvi.append(metric[0].upper().replace("_", "-"))

		return " & ".join(cvi)

	# Main Hyper-parameter search function
	# Assign EA or Random Search for hyper-partitions
	def search(self, publish):
		publish({"label": "Initializing search, creating processes..."}, "message")
		func_dict = dict()
		# Run parallel if more than 1 hyper-partition
		if len(self.partitions) > 1:
			for key, value in self.partitions.items():
				population = self.toolbox[key].population(n=self.pop_size)
				if len(value) > 1:
					func_dict['ea_custom-' + key] = [key, self.time, population, self.toolbox[key], 0.7, 0.3, publish]
				else:
					func_dict['random_search-' + key] = [key, self.time, self.pop_size, population, self.toolbox[key], publish]

		results = self.parallel_search(func_dict)

		publish({"label": "Getting final solutions..."}, "message")

		pop = list()
		for key, values in results.items():
			index = 0
			for value in values:
				if index < 10:
					pop.append(value)
					index += 1

		if self.resultPreference == "multi":
			results = self.main_toolbox.select(pop, 10)
		else:
			results = self.main_toolbox.select(pop, 1)
		# results = pop

		publish({"label": "Preparing charts..."}, "message")

		# Include NSGA2 Select for results on Fitness Function
		return results, self.algorithm

	# Create separate process for hyper-partition search
	# Store all results in res
	def parallel_search(self, partitions):

		manager = multiprocessing.Manager()
		res = manager.dict()
		process = []

		for partition in partitions:
			func_name = partition.split("-")[0]
			# func = getattr(sys.modules[__name__], func_name)
			func = globals()[func_name]
			partitions[partition].append(res)
			p = Process(target=func, args=tuple(partitions[partition], ))
			p.start()
			process.append(p)

		for proc in process:
			proc.join()

		return res

	# Evaluate individual fitness
	def fitness_function(self, individual):

		try:
			clustering = individual[0].fit(self.data)
			labels = clustering.labels_
			validate = Validation(np.asmatrix(self.data).astype(np.float), np.asarray(self.data), labels)
			metric_values = validate.run_list([self.cvi[0][0], self.cvi[1][0], self.cvi[2][0]])
			return metric_values[self.cvi[0][0]], metric_values[self.cvi[1][0]], metric_values[self.cvi[2][0]]
		except Exception as e:
			return 0, 0, 0

	# Evaluate individual fitness: pareto front & rank
	# def fitness_function_mastered(self, population):


	class Mode:
		""" Inner Class for genetic methods of inidividual hyper-partitions"""
		def __init__(self, partition, data, algorithm):
			self.model = GeneticMethods(partition, data, algorithm)

		def gen_population(self):
			return self.model.generate_pop()

		def crossover(self, ind1, ind2):
			return self.model.crossover(ind1, ind2)

		def mutate(self, individual):
			return self.model.mutate(individual)


# Random search for single hyper-parameter tuning
def random_search(pid, t, s, population, toolbox, publish, res):

	start_time = time.time()

	# Evaluate the individuals with an invalid fitness
	invalid_ind = [ind for ind in population if not ind.fitness.valid]
	fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)
	for ind, fit in zip(invalid_ind, fitnesses):
		ind.fitness.values = fit

	ngen = 0
	while time.time() - start_time <= t:
		if ngen > 0:
			publish({"label": "Random Search [Process-{}]: NGEN ({})".format(pid, ngen)}, "message")
			print("RANDOM: [NGEN - {}]".format(ngen))

		offspring = toolbox.select(population, len(population))

		# Generate random new individuals
		offspring = toolbox.population(n=s) + offspring

		# Evaluate the individuals with an invalid fitness
		invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
		fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)

		for ind, fit in zip(invalid_ind, fitnesses):
			ind.fitness.values = fit

		# Replace the current population by the offspring
		population[:] = offspring

		ngen +=1

	res.update({pid: population})


# Custom Evolutionary Algorithm: With Time Budget
def ea_custom(pid, t, population, toolbox, cxpb, mutpb, publish, res):

	# Evaluate the individuals with an invalid fitness
	invalid_ind = [ind for ind in population if not ind.fitness.valid]
	fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)
	for ind, fit in zip(invalid_ind, fitnesses):
		ind.fitness.values = fit

	# Begin the [TIMED] generational process
	start_time = time.time()
	ngen = 0

	# Select the next generation individuals
	while time.time() - start_time <= t:
		if ngen > 0:
			publish({"label": "Evolutionary Algorithm [Process-{}]: NGEN ({})".format(pid, ngen)}, "message")
			print("EA: [NGEN - {}]".format(ngen))
		ngen += 1
		# offspring = toolbox.select(population, len(population))

		# Vary the pool of individuals
		offspring = algorithms.varOr(population, toolbox, 10, cxpb, mutpb)  # 20 for mu or lambda
		# offspring = algorithms.varAnd(offspring, toolbox, cxpb, mutpb)

		# Evaluate the individuals with an invalid fitness
		invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
		fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)

		for ind, fit in zip(invalid_ind, fitnesses):
			ind.fitness.values = fit

		# Replace the current population by the offspring
		# population[:] = offspring
		population[:] = toolbox.select(population + offspring, 10)  # Mu plus lambda : ea

	res.update({pid: population})