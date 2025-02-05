#!/usr/bin/env bash

dataFolder=data/Vector_Force_of_infection_hotspots
mkdir -p $dataFolder
# create docker container
DOCKER_ARENA="docker run --rm -v ${PWD}:/mnt -e MAPBOX_ACCESS_TOKEN=$ACCESS_TOKEN -e MAPBOX_USER=$MAPBOX_USER  geocompas/atlasarena:etl"
 
## filter hotspots file
python3 src/fix_shapefiles_poi.py \
 --current_shapefile=$dataFolder/foi_hotspots_current.shp \
 --ssp2_shapefile=$dataFolder/foi_hotspots_ssp2.shp \
 --ssp5_shapefile=$dataFolder/foi_hotspots_ssp5.shp \
 --filter_value=10 \
 --equivalente_path=name_equivalence.json \
 --output_geojson=$dataFolder/hotspots.geojson

gzip  -kv $dataFolder/hotspots.geojson
