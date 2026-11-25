"""Convert the raw model rasters into Cloud Optimized GeoTIFFs for the web app.

Reads data/raw/<virus>/<species>/<time frame>/<model>/<file>.tif, and writes
<out>/<v>_<s>_<t>_<m>_<f>.tif using the short names in name_equivalence.json,
which are the `path` values in web_app/src/config/catalog.json.

Values stay float32 in their original units (no rescaling). Nodata is
normalised to NaN: the sources mix -3.4e38, -32768 and NaN. The sources also
carry stale STATISTICS_* tags (mean -9999), which are dropped.

Needs numpy and the GDAL Python bindings (osgeo).
"""

import argparse
import json
from pathlib import Path

import numpy as np
from osgeo import gdal

gdal.UseExceptions()

COG_OPTIONS = [
    "COMPRESS=DEFLATE",
    "PREDICTOR=YES",
    "BLOCKSIZE=256",
    "OVERVIEW_RESAMPLING=AVERAGE",
]


def cog_name(tif, raw_folder, names):
    parts = tif.relative_to(raw_folder).parts
    if len(parts) != 5:
        raise ValueError(f"expected virus/species/time_frame/model/file.tif: {tif}")
    return "_".join(names[p]["short"] for p in parts) + ".tif"


def read_masked(tif):
    """Read band 1 as float32 with every nodata cell set to NaN."""
    src = gdal.Open(str(tif))
    band = src.GetRasterBand(1)
    data = band.ReadAsArray().astype(np.float32)
    nodata = band.GetNoDataValue()
    if nodata is not None and not np.isnan(nodata):
        data[data == np.float32(nodata)] = np.nan
    return src, data


def write_cog(src, data, out):
    mem = gdal.GetDriverByName("MEM").Create("", src.RasterXSize, src.RasterYSize, 1, gdal.GDT_Float32)
    mem.SetGeoTransform(src.GetGeoTransform())
    mem.SetProjection(src.GetProjection())
    band = mem.GetRasterBand(1)
    band.SetNoDataValue(float("nan"))
    band.WriteArray(data)
    gdal.Translate(str(out), mem, format="COG", creationOptions=COG_OPTIONS)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--raw_folder_path", type=Path, required=True)
    parser.add_argument("--out_folder_path", type=Path, required=True)
    parser.add_argument("--name_equivalence_path", type=Path, required=True)
    args = parser.parse_args()

    names = json.loads(args.name_equivalence_path.read_text())
    args.out_folder_path.mkdir(parents=True, exist_ok=True)

    tifs = sorted(args.raw_folder_path.glob("*/*/*/*/*.tif"))
    for tif in tifs:
        out = args.out_folder_path / cog_name(tif, args.raw_folder_path, names)
        src, data = read_masked(tif)
        write_cog(src, data, out)
        print(f"{out.name}  min={np.nanmin(data):.4g} max={np.nanmax(data):.4g}")
    print(f"{len(tifs)} COGs written to {args.out_folder_path}")


if __name__ == "__main__":
    main()
