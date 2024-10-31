#!/usr/bin/env bash

dataFolder=data
mkdir -p $dataFolder
#DOCKER_ARENA="docker run --rm -v ${PWD}:/mnt -e MAPBOX_ACCESS_TOKEN=$ACCESS_TOKEN -e MAPBOX_USER=$MAPBOX_USER  geocompas/atlasarena:etl"

#python src/pre_process.py \
#  --raw_folder_path=$dataFolder/raw \
#  --to_upload_folder_path=$dataFolder/to_upload \
#  --name_equivalence_path=name_equivalence.json \

#
python src/fix_shapefiles_poi.py \
  --current_shapefile=$dataFolder/Vector_Force_of_infection_hotspots/foi_hotspots_current.shp \
  --ssp2_shapefile=$dataFolder/Vector_Force_of_infection_hotspots/foi_hotspots_ssp2.shp \
  --ssp5_shapefile=$dataFolder/Vector_Force_of_infection_hotspots/foi_hotspots_ssp5.shp \
  --filter_value=10 \
  --equivalente_path=name_equivalence.json \
  --output_geojson=$dataFolder/Vector_Force_of_infection_hotspots/hotspots.geojson

gzip  -kv $dataFolder/Vector_Force_of_infection_hotspots/hotspots.geojson
