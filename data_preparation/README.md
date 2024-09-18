# data process

These scripts are responsible for preparing the data for mapbox, downloading the `data` folder and pasting it into `data/raw`

The folder structure would be:
```shell

├── Dockerfile
├── README.md
├── data
│   ├── raw
│       ├── ...
│       ├── ...
│ 
├── name_equivalence.json
├── requirements.txt
├── run.sh
└── src
    ├── __init__.py
    └── pre_process.py

```
## upload files to mapbox
1. create [docker](https://docs.docker.com/engine/install/) image
```shell
docker compose build
```
2. export credentials from  [mapbox](https://docs.mapbox.com/help/getting-started/access-tokens/)

```shell
export CCESS_TOKEN=
export MAPBOX_USER=
```

3. run script

```shell
bash run.sh
```