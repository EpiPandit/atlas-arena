#!/usr/bin/env bash

dataFolder=data
mkdir -p $dataFolder
# Run from data_preparation/ (the docker container mounts $PWD).
# create docker container
DOCKER_ARENA="docker run --rm -v ${PWD}:/mnt -e MAPBOX_ACCESS_TOKEN=$ACCESS_TOKEN -e MAPBOX_USER=$MAPBOX_USER  geocompas/atlasarena:etl"

# Script to standardize tif files and load them into Mapbox
$DOCKER_ARENA python legacy_mapbox/src/pre_process.py \
  --raw_folder_path=$dataFolder/raw \
  --to_upload_folder_path=$dataFolder/to_upload \
  --name_equivalence_path=name_equivalence.json
