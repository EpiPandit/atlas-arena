import { actionTypes, processRawData } from '@/store/actions';

const initialData = {
  raw_data: [],
  tree: {},
  allVirus: [],
  allSpecies: [],
  allTimeFrame: [],
  allModels: [],
};
export const initialState = {
  ...initialData,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_RAW_DATA:
      const raw_data = [...action.payload];
      const data_ = processRawData(raw_data);
      return { ...state, raw_data, ...data_ };
    case actionTypes.CLEAN_RAW_DATA:
      return { ...state, ...initialData };
    default:
      return state;
  }
};
