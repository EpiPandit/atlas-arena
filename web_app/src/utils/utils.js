export const dynamicFilter = (dataList, filterObj) => {
  if (!filterObj || Object.keys(filterObj).length === 0) return [];
  console.log(filterObj, dataList.length);

  return dataList.filter((item) => {
    if (!filterObj.virus || item.virus !== filterObj.virus) {
      return false;
    }

    if (filterObj.species && item.species !== filterObj.species) {
      return false;
    }

    // time
    if (filterObj.time_frame && Array.isArray(filterObj.time_frame)) {
      if (
        filterObj.time_frame.length &&
        !filterObj.time_frame.includes(item.time_frame)
      ) {
        return false;
      }
    }

    // model
    if (filterObj.model && item.model !== filterObj.model) {
      return false;
    }

    return true;
  });
};
