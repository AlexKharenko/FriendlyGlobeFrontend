import statusHandler from "../../handlers/status.handler";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../handlers/request.handler";

export default {
  state: {},
  actions: {
    async getChats() {
      const response = await getRequest(`/chats`);
      const result = await statusHandler(response, async () => {
        const func = await getRequest(`/chats`);
        return func;
      });
      if (result?.success) {
        return result.chats;
      }
      return [];
    },
    async createChat(data, userData) {
      const response = await postRequest(`/chats`, userData);
      const result = await statusHandler(response, async () => {
        const func = await postRequest(`/chats`, userData);
        return func;
      });
      if (result?.success) {
        return result.chat;
      }
    },

    async deleteChat(data, chatId) {
      if (!chatId) return;
      const response = await deleteRequest(`/chats/${chatId}`);
      const result = await statusHandler(response, async () => {
        const func = await deleteRequest(`/chats/${chatId}`);
        return func;
      });
      if (result?.success) {
        return result.success;
      }
      return;
    },
  },
};
