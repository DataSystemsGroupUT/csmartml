# Automated Clustering
This tool is an automated hyper-parameter search algorithm that uses meta-learning and evolutionary algorithms to find the best configurations for clustering a given dataset. Currently limited to numerical datasets, it works for all eight clustering algorithms available on [SKlearn](https://scikit-learn.org/stable/modules/clustering.html) and uses methods and parallelization from [DEAP](https://deap.readthedocs.io/en/master/index.html) to return the list of top configurations found, given parameters defined in the next section.

![Demo](https://github.com/DataSystemsGroupUT/CSmartML/blob/master/img/cSmartML.png?raw=true)

# Setup
Built to run in a Vagrant Box, you will need Vagrant set up for this. Installation [here](https://www.vagrantup.com/downloads.html)
The interactive component runs on NodeJS, so a simple npm i, should install the packages required. Vagrant installs Python dependencies automatically on start.

To start the two servers:

## (1) Flask Server:
```
(Navigate to /server/)
python sse.py
```

## (2) NodeJS Server:

```
(Navigate to /interface/)
npm i
yarn start
```

# Datasets

There are built-in datasets to test the platform with, else all datasets uploaded must be numerical and in CSV format. No pre-processing of datasets are possible at this time yet.
