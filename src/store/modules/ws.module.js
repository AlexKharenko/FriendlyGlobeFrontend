import router from "@/router";

export default {
  state: { WebSocket: null, message: "" },
  getters: {
    getWS: (state) => state.WebSocket,
    getWsMessage: (state) => state.message,
  },
  mutations: {
    setWS: (state, value) => (state.WebSocket = value),
    setWsMessage: (state, value) => (state.message = value),
  },
  actions: {
    async getWebSocketInctance({ state, dispatch }) {
      if (!state.WebSocket) await dispatch("connectToWS");
      return state.WebSocket;
    },
    connectToWS({ commit, dispatch }) {
      const webSocket = new WebSocket(process.env.VUE_APP_WS_URL);
      webSocket.addEventListener("close", async (event) => {
        if (event.reason == "NewSignIn") {
          await dispatch("refreshTokens");
          return router.push("/signin");
        }
        if (event.reason == "Unauthorized") {
          await dispatch("refreshTokens");
          return;
        }
        if (event.reason == "Forbidden") {
          return commit("setWS", null);
        }
      });
      webSocket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        commit("setWsMessage", data);
        dispatch("callInitiated", { event: data.event, data: data.data });
      });
      commit("setWS", webSocket);
    },
    callInitiated({ dispatch }, { event, data }) {
      if (event == "callInitiated") {
        dispatch("openCallingUserModal", data);
      }
    },
    disconnectWs({ state, commit }) {
      if (state.WebSocket) state.WebSocket.close();
      commit("setWS", null);
    },
    async sendWsMessage({ dispatch }, payload) {
      const ws = await dispatch("getWebSocketInctance");
      if (!ws) {
        return;
      }
      if (ws.readyState != WebSocket.OPEN) setTimeout(() => {}, 100);
      if (ws.readyState == WebSocket.OPEN) ws.send(JSON.stringify(payload));
    },
  },
};
