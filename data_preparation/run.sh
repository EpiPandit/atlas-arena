#!/usr/bin/env bash

dataFolder=data
mkdir -p $dataFolder

python3 src/pre_process.py \
  --raw_folder_path=$dataFolder/raw \
  --to_upload_folder_path=$dataFolder/to_upload \
  --name_equivalence_path=name_equivalence.json \
