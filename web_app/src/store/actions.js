export const actionTypes = {
  SET_RAW_DATA: 'SET_RAW_DATA',
  CLEAN_RAW_DATA: 'CLEAN_RAW_DATA',
  //
  SET_RAW_DATA: 'SET_RAW_DATA',
  DEL_RAW_DATA: 'DEL_RAW_DATA',
};

export const setRawData = (payload) => {
  return { type: actionTypes.SET_RAW_DATA, payload: payload };
};

export const delRawData = () => {
  return { type: actionTypes.SET_RAW_DATA };
};

// process json
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

export const processRawData = (raw_data) => {
  try {
    // clear empty lines
    const data = raw_data.filter((i) => i.Virus && i.Virus !== 'N/A');
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
        Virus: virus,
        'Rodent species': species,
        'Year/ Time frame': time,
        'Modeling algorithm': model,
        'Other parameters': other_param,
        'Mask layer/ Map': raster,
        Tileset: tile_id,
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

      const timeFrameData = getOrInit(speciesData.time_frame, time, {
        name: time,
        folder_name: time,
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
      if (other_param && other_param !== 'N/A') {
        const otherParamsData = getOrInit(modelData.other_params, other_param, {
          name: other_param,
          folder_name: other_param,
          about: about,
          tile_id,
        });
        otherParamsData.tile_id = tile_id; //updat
      }

      // 'N/A'
      if (raster && raster !== 'N/A') {
        const maskLayersData = getOrInit(modelData.mask_layers, raster, {
          name: raster,
          folder_name: raster,
          about: about,
          tile_id,
        });
        maskLayersData.tile_id = tile_id;
      }
    });
    // clear values
    const clean_values = filterInvalidData(data_format_group);

    return [...Object.values(clean_values)];
  } catch (error) {
    console.error(error);
    return [];
  }
};
