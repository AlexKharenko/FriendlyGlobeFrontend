import statusHandler from "../../handlers/status.handler";
import { getRequest } from "../../handlers/request.handler";

export default {
  state: {
    sexIds: [
      { id: "NK", title: "Not known" },
      { id: "M", title: "Male" },
      { id: "F", title: "Female" },
      { id: "NA", title: "Not applicable" },
    ],
    filterSexList: [
      { title: "Any" },
      { title: "Male", value: "M" },
      { title: "Female", value: "F" },
    ],
    orderByList: [
      { title: "Account created ↓", value: "desc" },
      { title: "Account created ↑", value: "asc" },
    ],
    countries: [],
    hobbies: [],
    languages: [],
  },
  getters: {
    getSexList: (state) => state.sexIds,
    getFilterSexList: (state) => state.filterSexList,
    getOrderByList: (state) => state.orderByList,
    getCountriesList: (state) => state.countries,
    getHobbiesList: (state) => state.hobbies,
    getLanguagesList: (state) => state.languages,
  },
  mutations: {
    setCountries: (state, value) => (state.countries = value),
    setHobbies: (state, value) => (state.hobbies = value),
    setLanguagesList: (state, value) => (state.languages = value),
  },
  actions: {
    async getCHLLists({ state, commit }) {
      if (
        state.countries.length != 0 &&
        state.hobbies.length != 0 &&
        state.languages.length != 0
      )
        return;
      const response = await getRequest("/lists/chl");
      const result = await statusHandler(response);
      if (result?.success) {
        commit("setCountries", result.countries);
        commit("setHobbies", result.hobbies);
        commit("setLanguagesList", result.languages);
      }
      return result;
    },
  },
};
