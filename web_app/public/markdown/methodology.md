---
name: name methodology
kicker:
title: MLSDM
layout: methodology
---
# mlsdm: Machine Learning based Species Distribution Modeling Library for Python > 3.6
[![PyPI version](https://badge.fury.io/py/mlsdm.svg)](https://pypi.org/project/mlsdm/) [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.16990131.svg)](https://doi.org/10.5281/zenodo.16990131)



**mlsdm** is a Python library for species distribution modeling (SDM) using machine learning and geospatial data processing. It provides tools for handling raster data, generating pseudo-absence points, training machine learning models, and visualizing results, making it ideal for ecological niche research and modeling. More information can be found in the [Vignette](Vignette.md) document. An example use case with code and context can be found in the [example](/example/example.ipynb) notebook.

## Capabilities

- Raster Processing: Clip rasters to presence extents, stack rasters, and convert to DataFrames.
- Pseudo-Absence Sampling: Generate pseudo-absence points using PCA+KDE or random sampling methods.
- Machine Learning: Train and evaluate ensemble SDModels (RandomForest, ExtraTrees, XGBoost, LightGBM).
- Hypertuning: Hypertune each individual model
- Visualization: Plot rasters, partial dependence plots, and presence vs. pseudo-absence points.
- Feature Analysis: Analyze feature importance and perform recursive feature elimination (RFE) with Cross-validation (CV).
- 

```
mlsdm/
├── mlsdm/
│   ├── __init__.py
│   └── mlsdm.py
├── tests/
│   ├── __init__.py
│   └── test_mylibrary.py
├── example/
│   ├── example.ipynb
│   └── example_data/
|       |── raw_current_rasters/
|       |── raw_future_rasters/
|       |── presence/
|       |── outputs/     
├── README.md
├── Vignette.md
├── setup.py
├── LICENSE
└── requirements.txt

```
## Installation
```bash
pip install -r requirements.txt
pip install mlsdm
```
### OR

```bash
git clone https://github.com/yourusername/sdmtools.git
cd sdmtools
pip install .
```

## Dependencies
[requirements.txt](requirements.txt)
```bash
pip install -r requirements.txt
sudo apt-get install libgdal-dev #in case of error
```

## Testing
```bash
python -m unittest discover tests
```
## Contact
For questions or issues, please open an issue on the GitHub repository. For other enquires contact [EpiPandit Lab at UC Davis](epipandit@ucdavis.edu)
