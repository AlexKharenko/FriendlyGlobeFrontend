export default {
  state: {
    isModalBlockUserOpened: false,
    isModalCallingUserOpened: false,
    modalUserId: null,
    callInfo: null,
  },
  getters: {
    isModalBlockUserOpened: (state) => state.isModalBlockUserOpened,
    getUserIdModalData: (state) => state.modalUserId,
    isModalCallingUserOpened: (state) => state.isModalCallingUserOpened,
    getCallInfo: (state) => state.callInfo,
  },
  mutations: {
    setModalUserIdData: (state, modalUserId) =>
      (state.modalUserId = modalUserId),
    setBlockUserModalOpeningStatus: (state, isModalBlockUserOpened) =>
      (state.isModalBlockUserOpened = isModalBlockUserOpened),
    setCallInfo: (state, callInfo) => (state.callInfo = callInfo),
    setModalCallingUserStatus: (state, isModalCallingUserOpened) =>
      (state.isModalCallingUserOpened = isModalCallingUserOpened),
  },
  actions: {
    openBlockUserModal({ commit }, userId) {
      commit(`setBlockUserModalOpeningStatus`, true);
      commit("setModalUserIdData", userId);
    },
    closeBlockUserModal({ commit }) {
      commit(`setBlockUserModalOpeningStatus`, false);
      commit("setModalUserIdData", null);
    },
    openCallingUserModal({ commit }, callInfo) {
      commit(`setModalCallingUserStatus`, true);
      commit("setCallInfo", callInfo);
    },
    closeCallingUserModal({ commit }) {
      commit(`setModalCallingUserStatus`, false);
      commit("setCallInfo", null);
    },
  },
};
