import geopandas as gpd
import click
import pandas as pd
import json


@click.command(short_help="Prepare shapefile for mapbox")
@click.option("--current_shapefile", help="Input shapefile path ", required=True, type=str, )
@click.option("--ssp2_shapefile", help="Input shapefile path ", required=True, type=str, )
@click.option("--ssp5_shapefile", help="Input shapefile path ", required=True, type=str, )
@click.option("--filter_value", help="filter value ", required=True, type=int, )
@click.option("--equivalente_path", help="Input rename folder path  ", required=True, type=str, )
@click.option("--output_geojson", help="Output file path ", required=True, type=str, )
def main(current_shapefile, ssp2_shapefile, ssp5_shapefile, filter_value, equivalente_path, output_geojson):
    """Prepare and filter shapefiles for Mapbox visualization.

    Args:
        current_shapefile (str): Input shapefile path for the current time frame.
        ssp2_shapefile (str): Input shapefile path for SSP2 scenario.
        ssp5_shapefile (str): Input shapefile path for SSP5 scenario.
        filter_value (int): Value to filter the 'foi_0.02' field.
        equivalente_path (str): Path to the JSON file for renaming fields.
        output_geojson (str): Output file path for the resulting GeoJSON.
 
    """
    current_df = gpd.read_file(current_shapefile)
    current_df['time_frame'] = "current"

    ssp2_df = gpd.read_file(ssp2_shapefile)
    ssp2_df['time_frame'] = "ssp 2"

    ssp5_df = gpd.read_file(ssp5_shapefile)
    ssp5_df['time_frame'] = "ssp 5"
    data_equivalente = json.load(open(equivalente_path))
    # merge
    merged_df = pd.concat([current_df, ssp2_df, ssp5_df], axis=0, ignore_index=True)
    filter_df = merged_df[merged_df["foi_0.02"] >= filter_value].copy()

    def get_correct_value(val, field):
        val = str(val).lower().split(".")[-1]
        for key, value in data_equivalente.items():
            if val in str(key).lower():
                return value.get(field)
        return f"--- {val} --"

    # fix names
    filter_df["color"] = filter_df["virus"].apply(lambda x: get_correct_value(x, "color"))
    filter_df["virus"] = filter_df["virus"].apply(lambda x: get_correct_value(x, "spreadsheet"))
    filter_df["species"] = filter_df["spp"].apply(lambda x: get_correct_value(x, "spreadsheet"))
    filter_df.drop(columns=["spp"], inplace=True)
    # save file
    filter_df.to_file(output_geojson, driver="GeoJSON")


if __name__ == "__main__":
    main()
