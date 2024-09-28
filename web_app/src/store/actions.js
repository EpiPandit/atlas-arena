export const actionTypes = {
  SET_RAW_DATA: 'SET_RAW_DATA',
  CLEAN_RAW_DATA: 'CLEAN_RAW_DATA',
  //
  SET_RAW_DATA: 'SET_RAW_DATA',
  DEL_RAW_DATA: 'DEL_RAW_DATA',
};
import { DATA_EQUIVALENCE } from '@/config/constants';

export const setRawData = (payload = []) => {
  return { type: actionTypes.SET_RAW_DATA, payload: payload };
};

export const delRawData = () => {
  return { type: actionTypes.DEL_RAW_DATA };
};

// process json

export const buildRawDataGoodleSheet = (raw_data_) => {
  if (!raw_data_) return [];
  const { values } = raw_data_;
  if (!values || values.length === 0) return [];
  const headers = values[0];
  const data = values.slice(1);

  const dataDicts = data.map((row, rowIndex) => {
    const rowDict = {};

    headers.forEach((key, colIndex) => {
      const tmpVal = row[colIndex];
      if (!tmpVal || tmpVal === 'N/A') {
        rowDict[key] = null;
      } else {
        rowDict[key] = row[colIndex];
      }
    });

    return rowDict;
  });

  return dataDicts;
};

const filterInvalidData = (data_format_group) => {
  const filterObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const item = obj[key];

        if (item.name === '' || item.name === 'N/A') {
          delete obj[key];
        } else {
          if (item.species) {
            filterObject(item.species);
          }
          if (item.time_frame) {
            for (const timeKey in item.time_frame) {
              if (item.time_frame.hasOwnProperty(timeKey)) {
                filterObject(item.time_frame[timeKey]);
              }
            }
          }
          if (item.models) {
            for (const modelKey in item.models) {
              if (item.models.hasOwnProperty(modelKey)) {
                filterObject(item.models[modelKey]);
              }
            }
          }
          if (item.other_params) {
            for (const paramKey in item.other_params) {
              if (item.other_params.hasOwnProperty(paramKey)) {
                filterObject(item.other_params[paramKey]);
              }
            }
          }
          if (item.mask_layers) {
            for (const layerKey in item.mask_layers) {
              if (item.mask_layers.hasOwnProperty(layerKey)) {
                filterObject(item.mask_layers[layerKey]);
              }
            }
          }
        }
      }
    }
  };

  filterObject(data_format_group);
  return data_format_group;
};

const buildTree = (raw_data) => {
  try {
    // clear empty lines
    const data = raw_data.filter((i) => i.virus && i.virus !== 'N/A');
    // convert obj
    const data_format_group = {};
    const getOrInit = (parent, key, defaultValue) => {
      if (!parent[key]) {
        parent[key] = defaultValue;
      }
      return parent[key];
    };

    data.forEach((entry) => {
      const {
        virus,
        species,
        time_frame,
        model,
        filename,
        tileset_id,
        new_raster_name,
        about,
      } = entry;

      const virusData = getOrInit(data_format_group, virus, {
        name: virus,
        folder_name: virus,
        about: about,
        species: {},
      });

      const speciesData = getOrInit(virusData.species, species, {
        name: species,
        folder_name: species,
        about: about,
        time_frame: {},
      });

      const timeFrameData = getOrInit(speciesData.time_frame, time_frame, {
        name: time_frame,
        folder_name: time_frame,
        about: about,
        models: {},
      });

      const modelData = getOrInit(timeFrameData.models, model, {
        name: model,
        folder_name: model,
        about: about,
        other_params: {},
        mask_layers: {},
      });

      // validate 'N/A'
      // if (other_param && other_param !== 'N/A') {
      //   const otherParamsData = getOrInit(modelData.other_params, other_param, {
      //     name: other_param,
      //     folder_name: other_param,
      //     about: about,
      //     tile_id,
      //   });
      //   otherParamsData.tile_id = tile_id; //updat
      // }

      // 'N/A'
      if (
        filename &&
        filename !== 'N/A' &&
        tileset_id !== 'N/A' &&
        tileset_id
      ) {
        const maskLayersData = getOrInit(modelData.mask_layers, filename, {
          name: filename,
          folder_name: filename,
          filename,
          tileset_id,
          new_raster_name,
        });
        maskLayersData.tileset_id = tileset_id;
        maskLayersData.new_raster_name = new_raster_name;
      }
    });
    // clear values
    // const clean_values = filterInvalidData(data_format_group);
    return { ...data_format_group };
  } catch (error) {
    console.error(error);
    return {};
  }
};

const removeDuplicates = (arr) => {
  return arr
    .reduce((acc, current) => {
      const x = acc.find((item) => item.key === current.key);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .sort((first, second) => {
      return first.key.localeCompare(second.key);
    });
};

const buildAllVirus = (raw_data) => {
  const combinations = raw_data.map((i) => {
    let folder = '';
    try {
      folder = DATA_EQUIVALENCE[i.virus]['folder_name'];
    } catch {}
    return { key: i.virus, name: i.virus, folder: folder };
  });

  return removeDuplicates(combinations);
};

const buildAllSpecies = (raw_data) => {
  const combinations = raw_data
    .map((i) => {
      let folder = '';
      try {
        folder = DATA_EQUIVALENCE[i.species]['folder_name'];
      } catch {}
      return {
        key: `${i.species}`,
        name: i.species,
        folder: folder,
      };
    })
    .map((i) => ({
      ...i,
      virus: [
        ...new Set(
          raw_data.filter((j) => i.name == j.species).map((j) => j.virus)
        ),
      ],
    }));

  return removeDuplicates(combinations);
};
const buildAllTimeFrame = (raw_data) => {
  const combinations = raw_data
    .map((i) => {
      let folder = '';
      try {
        folder = DATA_EQUIVALENCE[i.time_frame]['folder_name'];
      } catch {}
      return {
        key: `${i.time_frame}`,
        name: i.time_frame,
        folder: folder,
      };
    })
    .map((i) => ({
      ...i,
      virus: [
        ...new Set(
          raw_data.filter((j) => i.name == j.time_frame).map((j) => j.virus)
        ),
      ],
      species: [
        ...new Set(
          raw_data.filter((j) => i.name == j.time_frame).map((j) => j.species)
        ),
      ],
    }));

  return removeDuplicates(combinations);
};

const buildAllModels = (raw_data) => {
  const combinations = raw_data
    .map((i) => {
      let folder = '';
      try {
        folder = DATA_EQUIVALENCE[i.model]['folder_name'];
      } catch {}
      return {
        key: `${i.model}`,
        name: i.model,
        folder: folder,
      };
    })
    .map((i) => ({
      ...i,
      virus: [
        ...new Set(
          raw_data.filter((j) => i.name == j.model).map((j) => j.virus)
        ),
      ],
      species: [
        ...new Set(
          raw_data.filter((j) => i.name == j.model).map((j) => j.species)
        ),
      ],
      time_frame: [
        ...new Set(
          raw_data.filter((j) => i.name == j.model).map((j) => j.time_frame)
        ),
      ],
    }));

  return removeDuplicates(combinations);
};

export const processRawData = (raw_data) => {
  return {
    // tree: buildTree(raw_data),
    allVirus: buildAllVirus(raw_data),
    allSpecies: buildAllSpecies(raw_data),
    allTimeFrame: buildAllTimeFrame(raw_data),
    allModels: buildAllModels(raw_data),
  };
};
