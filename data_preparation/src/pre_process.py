from glob import glob
import click
import json
from tqdm import tqdm
import os
import csv
import subprocess
import time
import rasterio as rio
import numpy as np

MAPBOX_USER = os.getenv("MAPBOX_USER")


def save_csv(csv_file, csv_data):
    if not csv_data:
        print("No csv data")
        return
    with open(csv_file, "w", newline="") as f:
        w = csv.DictWriter(f, csv_data[0].keys())
        w.writeheader()
        w.writerows(csv_data)


def custom_rescale(input_tif, output_tif, scale_min, scale_max):
    with rio.open(input_tif) as src:
        data = src.read(1)
        nodata_value = src.nodata
        nodata_mask = (
            (data == nodata_value)
            if nodata_value is not None
            else np.zeros(data.shape, dtype=bool)
        )
        CONSTANT = 10
        new_data_ = np.where(nodata_mask, data, data + CONSTANT)
        data_rescaled = np.interp(
            new_data_, (scale_min + CONSTANT, scale_max + CONSTANT), (1, 255)
        )
        data_rescaled = data_rescaled.astype(np.uint8)
        data_rescaled[nodata_mask] = 0
        profile = src.profile
        profile.update(
            dtype=rio.uint8,
            count=1,
            compress="LZW",
            predictor=2,
            tiled=True,
            blockxsize=256,
            blockysize=256,
            nodata=0,
        )
        with rio.open(output_tif, "w", **profile) as dst:
            dst.write(data_rescaled, 1)


@click.command(short_help="Review and clean data")
@click.option(
    "--raw_folder_path",
    help="Input raw folder path ",
    required=True,
    type=str,
)
@click.option(
    "--to_upload_folder_path",
    help="Input rename folder path ",
    required=True,
    type=str,
)
@click.option(
    "--name_equivalence_path",
    help="Input rename folder path ",
    required=True,
    type=str,
)
def main(raw_folder_path, to_upload_folder_path, name_equivalence_path):
    dict_equivalence = json.load(
        open(
            name_equivalence_path,
        )
    )
    all_tif_raw = glob(f"{raw_folder_path}/**/*.tif", recursive=True)
    os.makedirs(f"{to_upload_folder_path}", exist_ok=True)

    def ged_(value, type_):
        try:
            return dict_equivalence[value][type_]
        except:
            return "N/A"

    # ===========
    # manage tif
    # ===========
    csv_data_tiff = []
    for idx, item in tqdm(enumerate(all_tif_raw), desc="Processing tif files"):
        try:
            virus, species, time_frame, model, filename = item.replace(
                "data/raw/", ""
            ).split("/")

            fake_name = f"{ged_(virus, 'short')}_{ged_(species, 'short')}_{ged_(time_frame, 'short')}_{ged_(model, 'short')}_{ged_(filename, 'short')}.tif"
            row_data = {
                "virus": ged_(virus, "spreadsheet"),
                "species": ged_(species, "spreadsheet"),
                "time_frame": ged_(time_frame, "spreadsheet"),
                "model": ged_(model, "spreadsheet"),
                "filename": ged_(filename, "spreadsheet"),
                "tileset_id": "N/A",
                "new_raster_name": fake_name,
                "color": ged_(species, "color"),
                "color_virus": ged_(virus, "color"),
            }
            scale_min = 0
            scale_max = 1
            # default probability_presence
            if filename == "force_of_infection.tif":
                scale_min = 0
                scale_max = 0.05
            if filename == "diff_in_probabilities":
                scale_min = -1
                scale_max = 1

            # rescale
            rescale_name = f"{to_upload_folder_path}/{fake_name}"

            custom_rescale(item, rescale_name, scale_min, scale_max)

            # upload mapbox
            tileset_id = f"{MAPBOX_USER}.{fake_name}".replace(".tif", "")
            cmd_mapbox = ["mapbox", "upload", tileset_id, rescale_name]

            try:
                result = subprocess.run(
                    cmd_mapbox,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True,
                )
                row_data["tileset_id"] = tileset_id
                csv_data_tiff.append(row_data)
                # reduce errors
                time.sleep(1)
            except subprocess.CalledProcessError as e:
                row_data["tileset_id"] = "N/A"
                print(f"Error: {e}")

        except Exception as ex:
            print("Error: ",ex, item)

    save_csv(f"{to_upload_folder_path}/data_output_tiff.csv", csv_data_tiff)

    # ===========
    # manage txt
    # ===========


if __name__ == "__main__":
    main()
