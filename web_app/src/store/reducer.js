import { actionTypes, processRawData } from '@/store/actions';

export const initialState = {
  raw_data: [],
  data: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_RAW_DATA:
      const raw_data = [...action.payload];
      const data = processRawData(raw_data);

      return { ...state, raw_data, data };
    case actionTypes.CLEAN_RAW_DATA:
      return { ...state, raw_data: [], data: [] };
    default:
      return state;
  }
};
