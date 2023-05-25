import statusHandler from "../../handlers/status.handler";
import { postRequest } from "../../handlers/request.handler";
import notAuthorized from "../../handlers/notAuth.handler";
import router from "@/router";

export default {
  state: { isAuthenticated: false, payload: {}, isAdmin: false },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getPayload: (state) => state.payload,
    isAdmin: (state) => state.isAdmin,
  },
  mutations: {
    setIsAuthenticated: (state, value) => (state.isAuthenticated = value),
    setPayload: (state, value) => (state.payload = value),
    setHidden: (state, value) => (state.payload.hidden = value),
    setProfilePhoto: (state, value) => (state.payload.profilePhotoURL = value),
    setIsAdmin: (state, value) => (state.isAdmin = value),
  },
  actions: {
    async signUp(context, data) {
      const response = await postRequest("/signup", data);
      const result = await statusHandler(response);
      return result;
    },
    async signIn({ commit, dispatch }, data) {
      const response = await postRequest("/signin", data);
      const result = await statusHandler(response);
      if (result.success) {
        commit("setIsAuthenticated", true);
        commit("setPayload", result.user);
        commit("setIsAdmin", result.user.role == "ADMIN" ? true : false);
        dispatch("connectToWS");
      } else {
        commit("setIsAuthenticated", false);
        commit("setPayload", {});
        commit("setIsAdmin", false);
        dispatch("disconnectWs");
      }
      return result;
    },
    async refreshTokens({ commit, dispatch }) {
      await notAuthorized(
        () => {
          commit("setIsAuthenticated", false);
          commit("setPayload", {});
          commit("setIsAdmin", false);
          dispatch("disconnectWs");
        },
        (response) => {
          commit("setIsAuthenticated", true);
          commit("setPayload", response.user);
          commit("setIsAdmin", response.user.role == "ADMIN" ? true : false);
          dispatch("getWebSocketInctance");
        }
      );
    },
    async signOut({ commit, dispatch }) {
      const response = await postRequest("/signout", {});
      const result = await statusHandler(response);
      commit("setIsAuthenticated", false);
      commit("setPayload", {});
      commit("setIsAdmin", false);
      dispatch("disconnectWs");
      router.push("/signin");
      return result;
    },
  },
};
