import statusHandler from "../../handlers/status.handler";
import {
  deleteRequest,
  getRequest,
  // patchRequest,
  postRequest,
  // patchRequestForm,
} from "../../handlers/request.handler";
// import router from "@/router";

export default {
  state: {},
  actions: {
    async getChats() {
      const response = await getRequest(`/chats`);
      const result = await statusHandler(response, async () => {
        return await getRequest(`/chats`);
      });
      if (result?.success) {
        return result.chats;
      }
      return [];
    },
    async createChat(data, userData) {
      const response = await postRequest(`/chats`, userData);
      const result = await statusHandler(response, async () => {
        return await postRequest(`/chats`, userData);
      });
      if (result?.success) {
        return result.chat;
      }
    },

    async deleteChat(data, chatId) {
      if (!chatId) return;
      const response = await deleteRequest(`/chats/${chatId}`);
      const result = await statusHandler(response, async () => {
        return await deleteRequest(`/chats/${chatId}`);
      });
      if (result?.success) {
        return result.success;
      }
      return;
    },
  },
};
