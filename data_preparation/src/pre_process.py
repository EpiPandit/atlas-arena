from glob import glob
import click
import json
from tqdm import tqdm
import os
import csv
import subprocess

MAPBOX_USER = os.getenv("MAPBOX_USER")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")


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
            return "_____"

    # iterate and change name
    data_csv = []
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
                "tileset_id": "",
                "new_raster_name": fake_name,
            }

            # rescale
            rescale_ = f"{to_upload_folder_path}/{fake_name}"
            cmd_translate = [
                "gdal_translate",
                "-ot",
                "Byte",
                "-scale",
                "0",
                "1",
                "0",
                "255",
                "-co",
                "TILED=YES",
                "-co",
                "BLOCKXSIZE=256",
                "-co",
                "BLOCKYSIZE=256",
                "-co",
                "COMPRESS=LZW",
                "-co",
                "PREDICTOR=2",
                "-a_nodata",
                " 0",
                item,
                rescale_,
            ]
            result_translate = subprocess.run(
                cmd_translate,
                stdout=subprocess.DEVNULL,
            )
            # upload mapbox
            tileset_id = f"{MAPBOX_USER}.{fake_name}".replace(".tif", "")
            cmd_mapbox = ["mapbox", "upload", tileset_id, rescale_]

            try:
                result = subprocess.run(
                    cmd_mapbox,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True,
                )
                row_data["tileset_id"] = tileset_id
                data_csv.append(row_data)
            except subprocess.CalledProcessError as e:
                print(f"Error: {e}")

        except Exception as ex:
            print(ex)
    if not data_csv:
        print("No csv data")
        return
    with open(f"{to_upload_folder_path}/data_output.csv", "w", newline="") as f:
        w = csv.DictWriter(f, data_csv[0].keys())
        w.writeheader()
        w.writerows(data_csv)


if __name__ == "__main__":
    main()
