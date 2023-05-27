import statusHandler from "../../handlers/status.handler";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  patchRequestForm,
} from "../../handlers/request.handler";
import router from "@/router";

export default {
  state: {},
  actions: {
    async updateUser({ commit }, userData) {
      const response = await patchRequest(`/users/profile`, userData);
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/users/profile/`, userData);
        return func;
      });
      if (result?.success && result.signOut) {
        commit("setIsAuthenticated", false);
        commit("setPayload", {});
        commit("setIsAdmin", false);
        router.push("/signin");
      }
      return result;
    },

    async deleteUser({ commit }) {
      const response = await deleteRequest(`/users/profile`);
      const result = await statusHandler(response, async () => {
        const func = await deleteRequest(`/users/profile/`);
        return func;
      });
      if (result?.success && result.signOut) {
        commit("setIsAuthenticated", false);
        commit("setPayload", {});
        commit("setIsAdmin", false);
        return router.push("/signin");
      }
      return result;
    },

    async addToBlacklist(data, userId) {
      const response = await postRequest(`/users/blacklist`, {
        blockedUserId: userId,
      });
      const result = await statusHandler(response, async () => {
        const func = await postRequest(`/users/blacklist`, {
          blockedUserId: userId,
        });
        return func;
      });
      return result;
    },

    async removeUserFromBlacklist(data, userId) {
      const response = await deleteRequest(`/users/blacklist/${userId}`);
      const result = await statusHandler(response, async () => {
        const func = await deleteRequest(`/users/blacklist/${userId}`);
        return func;
      });

      return result;
    },

    async updateProfilePhoto({ commit }, form) {
      const response = await patchRequestForm(`/users/profile/photo`, form);
      const result = await statusHandler(response, async () => {
        const func = await patchRequestForm(`/users/profile/photo`, form);
        return func;
      });
      if (result?.success) commit("setProfilePhoto", result.profilePhotoURL);
      return result;
    },

    async deleteProfilePhoto({ commit }) {
      const response = await deleteRequest(`/users/profile/photo`);
      const result = await statusHandler(response, async () => {
        const func = await deleteRequest(`/users/profile/photo`);
        return func;
      });
      if (result?.success) commit("setProfilePhoto", null);
      return result;
    },

    async updateUserHidden({ commit }, userData) {
      const response = await patchRequest(`/users/profile/hidden`, userData);
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/users/profile/hidden`, userData);
        return func;
      });
      if (result?.success) commit("setHidden", userData.hidden);
      return result;
    },

    async updateUserPassword(data, userData) {
      const response = await patchRequest(`/users/profile/password`, userData);
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/users/profile/password`, userData);
        return func;
      });
      return result;
    },

    async getProfile() {
      const response = await getRequest(`/users/profile`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/users/profile`);
        return func;
      });
      if (result?.success) {
        return result;
      }
      return { ...result, user: {} };
    },

    async getUserProfile(data, username) {
      const response = await getRequest(`/users/${username}`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/users/${username}`);
        return func;
      });
      if (result?.success) {
        return result;
      }
      return { ...result, user: {} };
    },

    async verifyUser(data, userId) {
      const response = await patchRequest(`/admin/verify/${userId}`);
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/admin/verify/${userId}`);
        return func;
      });
      return result;
    },

    async unblockUser(data, userId) {
      const response = await patchRequest(`/admin/unblock/${userId}`);
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/admin/unblock/${userId}`);
        return func;
      });
      return result;
    },

    async blockUser(data, { userId, blockMessage }) {
      const response = await patchRequest(`/admin/block/${userId}`, {
        blockMessage,
      });
      const result = await statusHandler(response, async () => {
        const func = await patchRequest(`/admin/block/${userId}`, {
          blockMessage,
        });
        return func;
      });
      return result;
    },

    async getAdminUsers(data, filters = {}) {
      const query = Object.entries(filters)
        .map(([key, value]) => {
          if (value !== undefined) return `${key}=${value}`;
        })
        .join("&");
      const response = await getRequest(`/admin/allusers?${query}`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/admin/allusers?${query}`);
        return func;
      });
      if (result?.success) {
        return result;
      }
      return [];
    },

    async getUsers(data, filters = {}) {
      const query = Object.entries(filters)
        .map(([key, value]) => {
          if (value !== undefined && value !== "") {
            if (Array.isArray(value)) {
              if (value.length > 0) return `${key}=[${value}]`;
            } else return `${key}=${value}`;
          }
        })
        .join("&");
      const response = await getRequest(`/users?${query}`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/users?${query}`);
        return func;
      });
      if (result?.success) {
        return result;
      }
      return [];
    },

    async getBlacklist() {
      const response = await getRequest(`/users/blacklist`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/users/blacklist`);
        return func;
      });
      if (result?.success) {
        return result.users;
      }
      return [];
    },
  },
};
