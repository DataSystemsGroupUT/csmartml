import sklearn.cluster as cluster
import sklearn.metrics as metric
import pandas as pd
import csmartml as cm
import os
import csv
import time

output_ls = list()
directory = "./benchmark-datasets/"

generations = [1800]
headers = ["dataset", "generations", "nmi", "cvi", "algorithm"]
# include = ["square3", "sizes1", "sizes3"]
include = ["cure-t1-500n-4D-4S"] #,, threenorm, 4d-5c-no2,
# 2d-25c-no1, elly0_d3_c15, cure-t1-500n-4D-4S


# with open("exp__new_timed.csv") as f:
# 	writer = csv.writer(f)
# 	writer.writerow(headers)

for filename in os.listdir("./processed/"):
	dataset = filename.split(".csv")[0]
	if dataset in include:
		file = "./processed/" + filename

		data = pd.read_csv(file, header=None, na_values='?')
		y = data.iloc[:, -1]
		data = data.iloc[:, :-1]

		print(filename)

		start_time = time.time()

		for generation in generations:
			print(f'Time: {generation}s')
			autocluster = cm.CSmartML(file, population=10, time=generation)
			print("Search start...")
			pops, cvi, algorithm = autocluster.search()

			max_nmi = 0.0

			for pop in pops:
				try:
					cluster = pop[0].fit(data)
					nmi_score = metric.normalized_mutual_info_score(y, cluster.labels_)
					output_ls.append([dataset, nmi_score])
					if nmi_score > max_nmi:
						max_nmi = nmi_score
				except Exception as e:
					print(e)
					print(pop)
					continue

			# writer.writerow([dataset, generation, max_nmi, cvi, algorithm])
			print("NMI Score: ", max_nmi)

