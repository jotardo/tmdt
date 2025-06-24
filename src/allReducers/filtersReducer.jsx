export const reducerFilterFunction = (state, action) => {
  const value = action.inputValue;

  switch (action.type) {
    case "PRICE":
      return { ...state, priceRange: value };
    case "SEARCH":
      return { ...state, search: value };
    case "SORT":
      return { ...state, sort: value };
    case "RATINGS":
      return { ...state, rating: value };
    case "OCCASION":
      return {
        ...state,
        ocassionFilters: toggle(state.ocassionFilters, value),
      };
    case "MATERIAL":
      return {
        ...state,
        materialFilter: toggle(state.materialFilter, value),
      };
    case "CATEGORY":
      return {
        ...state,
        categoryFilters: toggle(state.categoryFilters, value),
      };
    case "BRAND":
      return {
        ...state,
        brandFilters: toggle(state.brandFilters, value),
      };
    case "CLEARFILTER":
      return {
        priceRange: action.maxPrice,
        search: "",
        sort: "",
        rating: "",
        ocassionFilters: [],
        categoryFilters: [],
        materialFilter: [],
        brandFilters: [],
      };
    default:
      return state;
  }
};

function toggle(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}
