# cSmartML
cSmartML is an automated clustering tool that uses meta-learning and evolutionary algorithms to find the best configurations for clustering a given dataset. Currently limited to numerical datasets, it works for all eight clustering algorithms available on [SKlearn](https://scikit-learn.org/stable/modules/clustering.html) and uses parallelization and tools from [DEAP](https://deap.readthedocs.io/en/master/index.html) to return the list of top configurations found. Evaluation metrics are multi-objective and the best configurations selected with the NSGA-II pareto scheme.

![Demo](https://github.com/DataSystemsGroupUT/CSmartML/blob/master/img/cSmartML.png?raw=true)

# Setup

## Download cSmartML
```
git clone https://github.com/DataSystemsGroupUT/CSmartML.git
```


## Run Application
Built to run in Docker container, make sure you have Docker installed, else head [here](https://docs.docker.com/get-docker/)
In the home directory, run the bash file ```go.sh```
```
bash go.sh
```
After successful initialization up of App Container visit ```localhost:80``` to access the interface

# Datasets

There are built-in datasets to test the platform with, else all datasets uploaded must be numerical and in CSV format. No pre-processing of datasets are possible at this time yet.
