<template>
  <div class="chats-view">
    <div class="side-bar-left" :class="{ hidden: sideBarHidden }">
      <h3>Chats</h3>
      <ChatItem
        v-for="chat in chats"
        :key="chat.chatId"
        :chat="chat"
        :active="currentChat?.chatId == chat.chatId"
        @click="chooseChat(chat)"
      />
    </div>
    <button class="toggle-chats" @click="toggleSideBar">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </button>
    <div class="chat-container">
      <div class="header">
        <div class="username">
          <router-link v-if="currentChat" :to="`users/${receiver.username}`">{{
            receiver.username
          }}</router-link>
          <span v-else>{{ receiver.username }}</span>
        </div>
        <div class="is-online">
          <span class="online-dot" v-if="currentChat?.online"></span>
        </div>
        <button
          class="call-user-btn"
          @click="callUser"
          v-if="currentChat"
          :disabled="!currentChat.online"
        >
          <img src="../assets/icons/phone-call.png" alt="phone-call" />
        </button>
        <DotsMenu
          :isCurrUser="isCurrUserNull"
          :user="receiver"
          blacklistLink="/profile/blacklist"
          @addToBlacklist="addToBlacklistEmit"
        >
          <li v-if="!isCurrUserNull">
            <button @click="deleteChatClick">Delete</button>
          </li>
        </DotsMenu>
      </div>
      <div class="body" @scroll="debouncedCheckScrollTop" ref="body">
        <div class="message-container" ref="messageContainer">
          <MessageItem
            v-for="(message, index) in messages"
            :key="index"
            :message="message"
            :currentUserId="getPayload.userId"
            @onEditClick="openEditModal"
            @onDeleteClick="onDeleteMessage"
          />
        </div>
      </div>

      <MessageInput
        :disable="!currentChat"
        :chatId="currentChat?.chatId"
        @onSend="sendNewMessage"
      />
    </div>
    <EditMessageModal
      @editMessage="onEditMessage"
      :message="messageToEdit"
      v-model="editMessageModalOpened"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DotsMenu from "../components/DotsMenu.vue";
import MessageInput from "../components/Inputs/MessageInput.vue";
import ChatItem from "../components/ListItems/ChatItem.vue";
import MessageItem from "../components/ListItems/MessageItem.vue";
import EditMessageModal from "../components/Modals/EditMessageModal.vue";
export default {
  components: {
    MessageInput,
    MessageItem,
    ChatItem,
    DotsMenu,
    EditMessageModal,
  },
  name: "ChatsView",
  data() {
    return {
      currentChat: null,
      messageToEdit: null,
      editMessageModalOpened: false,
      chats: [],
      lastTopPosition: 0,
      sideBarHidden: true,
    };
  },
  computed: {
    ...mapGetters([
      "getWS",
      "getPayload",
      "getWsMessage",
      "getUnreadMessagesCount",
    ]),
    debouncedCheckScrollTop() {
      return this.debounce(this.checkScroll, 200);
    },
    receiver() {
      if (this.currentChat == null)
        return { userId: null, username: "Choose chat", online: false };
      return this.currentChat.user1.userId == this.getPayload.userId
        ? this.currentChat.user2
        : this.currentChat.user1;
    },
    messages() {
      if (!this.currentChat) return [];
      return this.currentChat.messages;
    },
    isCurrUserNull() {
      if (!this.currentChat) return true;
      return false;
    },
    lastUnreadMessageIndex() {
      let lastUnreadMessageIndex = -1;
      for (let i = 0; i < this.messages.length; i++) {
        if (
          !this.messages[i].read &&
          this.messages[i].receiverId == this.getPayload.userId
        ) {
          lastUnreadMessageIndex = i;
          break;
        }
      }
      return lastUnreadMessageIndex;
    },
    eventHandlers() {
      return {
        error: () => {
          this.$router.push("/505");
        },
        messageCreated: async () => {
          await this.appendNewMessage(this.getWsMessage.data.newMessage);
        },
        newMessage: async () => {
          await this.appendNewMessage(this.getWsMessage.data.newMessage);
        },
        newChat: () => {
          this.changeUnreadMessagesCount("+");
          this.appendNewChat(this.getWsMessage.data.chat);
        },
        moreMessages: () => {
          this.appendNewMessages(this.getWsMessage.data.messages);
        },
        firstMessages: async () => {
          await this.setFirstMessages(this.getWsMessage.data.messages);
        },
        messagesRead: () => {
          this.readMessagesInChatByUserId(
            this.getWsMessage.data.chatId,
            this.getWsMessage.data.receiverId
          );
        },
        onlineUsers: () => {
          this.makeChatsOnline(this.getWsMessage.data.onlineUsers);
        },
        userWentOnline: () => {
          this.makeChatOnlineOrOffline(this.getWsMessage.data.userId, true);
        },
        userWentOffline: () => {
          this.makeChatOnlineOrOffline(this.getWsMessage.data.userId, false);
        },
        alertMessage: () => {
          alert(this.getWsMessage.data.message);
        },
        messageEdited: () => {
          this.editLocalMessage(this.getWsMessage.data.updatedMessage);
        },
        messageDeleted: () => {
          this.removeLocalMessage(this.getWsMessage.data.deletedMessage);
        },

        noChatWithSuchReceiver: () => {
          this.currentChat = null;
          this.removeChat(
            this.getWsMessage.data.receiverId,
            this.getWsMessage.data.chatId
          );
          alert("No chat found with such user!");
        },
        removeChat: () => {
          this.currentChat = null;
          this.removeChat(this.getWsMessage.data.userId);
        },
      };
    },
  },
  methods: {
    ...mapActions([
      "getChats",
      "createChat",
      "deleteChat",
      "addToBlacklist",
      "sendWsMessage",
    ]),
    toggleSideBar() {
      this.sideBarHidden = !this.sideBarHidden;
    },
    debounce(func, wait) {
      let timeoutId;
      return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    checkScroll() {
      const messageContainer = this.$refs.messageContainer;
      const body = this.$refs.body;
      this.lastTopPosition = messageContainer.offsetTop + 1 - body.offsetTop;
      if (body.scrollTop <= messageContainer.offsetTop + 1 - body.offsetTop) {
        this.getMoreMessagesOfCurrChat();
      }
    },
    scrollToLastUnreadMessage() {
      this.$nextTick(() => {
        if (this.lastUnreadMessageIndex != -1) {
          const container = this.$refs.messageContainer;
          const lastUnreadMessage =
            container.children[this.lastUnreadMessageIndex];

          if (lastUnreadMessage) {
            const scrollOffset =
              lastUnreadMessage.offsetTop - lastUnreadMessage.offsetHeight;
            this.$refs.body.scrollTop = scrollOffset;
          }
        }
      });
    },
    chooseChat(chat) {
      this.currentChat = chat;
      this.sideBarHidden = true;
    },
    async sendNewMessage(message) {
      if (this.currentChat) {
        const payload = {
          event: "sendMessage",
          data: {
            receiverId: this.receiver.userId,
            content: message,
          },
        };
        await this.sendWsMessage(payload);
      }
    },
    makeChatsOnline(userIds) {
      this.chats.forEach((chat) => {
        if (
          userIds?.includes(chat.user1.userId) ||
          userIds?.includes(chat.user2.userId)
        ) {
          chat.online = true;
        }
      });
    },
    makeChatOnlineOrOffline(userId, onlineStatus) {
      const chatIndex = this.chats.findIndex(
        (chat) => chat?.user1.userId == userId || chat?.user2.userId == userId
      );
      if (chatIndex != -1) this.chats[chatIndex].online = onlineStatus;
    },
    async appendNewMessage(message) {
      const chatIndex = this.chats.findIndex(
        (chat) => chat.chatId == message.chatId
      );
      if (chatIndex != -1) {
        this.chats[chatIndex].messages.push(message);
        if (message.receiverId == this.getPayload.userId) {
          this.chats[chatIndex].unreadCount =
            this.chats[chatIndex].unreadCount + 1;
          if (this.currentChat?.chatId == this.chats[chatIndex]?.chatId) {
            await this.readAllUserUnreadMessagesInChat();
          }
        }
        let removedElement = this.chats.splice(chatIndex, 1)[0];
        this.chats.unshift(removedElement);
      }
    },
    appendNewMessages(messages) {
      if (this.currentChat) {
        this.currentChat.messages = [
          ...messages.reverse(),
          ...this.currentChat.messages,
        ];
        this.$nextTick(() => {
          this.$refs.body.scrollTop = this.lastTopPosition;
        });
      }
    },
    async setFirstMessages(messages) {
      if (this.currentChat) {
        this.currentChat.messages = messages.reverse();
        this.scrollToLastUnreadMessage();
        await this.readAllUserUnreadMessagesInChat();
      }
    },
    appendNewChat(chat) {
      if (chat) {
        const findChat = this.chats.find((item) => item.chatId == chat.chatId);
        if (!findChat) {
          chat["online"] = true;
          chat["unreadCount"] = 1;
          this.chats.unshift(chat);
        }
      }
    },
    removeChat(userId, chatId = null) {
      if (!userId && !chatId) return;
      if (userId) {
        const foundChat = this.chats.find(
          (chat) => chat.user1.userId == userId || chat.user2.userId == userId
        );
        this.changeUnreadMessagesCount("-", foundChat?.unreadCount);
        this.chats = this.chats.filter(
          (chat) => chat.user1.userId !== userId && chat.user2.userId !== userId
        );
      } else if (chatId) {
        this.chats = this.chats.filter((chat) => chat.chatId != chatId);
      }
    },
    async getMoreMessagesOfCurrChat() {
      if (this.currentChat) {
        await this.sendWsMessage({
          event: "getMessages",
          data: {
            chatId: this.currentChat.chatId,
            lastMessageTimeCreated:
              this.currentChat?.messages?.at(0)?.timeCreated,
            first: false,
          },
        });
      }
    },
    async getFirstMessagesOfCurrChat() {
      if (this.currentChat)
        await this.sendWsMessage({
          event: "getMessages",
          data: {
            chatId: this.currentChat.chatId,
            first: true,
          },
        });
    },
    async addToBlacklistEmit(userId) {
      this.currentChat = null;
      this.removeChat(userId);
      await this.addToBlacklist(userId);
      await this.sendWsMessage({
        event: "removeChatForUser",
        data: { userId },
      });
    },
    changeUnreadMessagesCount(operator, number = 1) {
      if (operator == "+") {
        this.$store.commit(
          "setUnreadMessagesCount",
          this.getUnreadMessagesCount + number
        );
      } else {
        this.$store.commit(
          "setUnreadMessagesCount",
          this.getUnreadMessagesCount - number
        );
      }
    },
    readMessagesInChatByUserId(chatId, userId) {
      const foundChat = this.chats.find((chat) => chat.chatId == chatId);
      if (foundChat) {
        foundChat.messages.forEach((message) => {
          if (message.receiverId == userId && !message.read) {
            message.read = true;
            this.changeUnreadMessagesCount("-");
          }
        });
      }
    },
    async readAllUserUnreadMessagesInChat() {
      if (this.currentChat) {
        await this.sendWsMessage({
          event: "readMessagesInChat",
          data: { chatId: this.currentChat.chatId },
        });
        this.currentChat.unreadCount = 0;
      }
    },
    leaveLastMessageOnLeaveChat(chat) {
      if (chat) {
        chat.messages = chat.messages.slice(-1);
      }
    },
    async deleteChatClick() {
      if (this.currentChat) {
        await this.sendWsMessage({
          event: "removeChatForUser",
          data: { userId: this.receiver.userId },
        });
        const chatId = this.currentChat.chatId;
        this.removeChat(null, chatId);
        await this.deleteChat(chatId);
        this.currentChat = null;
      }
    },
    async onEditMessage(data) {
      if (this.messageToEdit == null) return;
      await this.sendWsMessage({ event: "editMessage", data });
      this.messageToEdit = null;
    },
    async onDeleteMessage(data) {
      if (!data) return;
      const result = confirm("Do you want to delete this message?");
      if (result) await this.sendWsMessage({ event: "deleteMessage", data });
    },
    openEditModal(message) {
      this.messageToEdit = message;
      this.editMessageModalOpened = true;
    },
    editLocalMessage(message) {
      if (!message) return;
      const foundChat = this.chats.find(
        (chat) => chat.chatId == message?.chatId
      );
      if (!foundChat) return;
      const messageIndex = foundChat.messages.findIndex(
        (item) => item.messageId == message.messageId
      );
      if (messageIndex != -1) foundChat.messages[messageIndex] = message;
    },
    removeLocalMessage(message) {
      if (!message) return;
      const foundChat = this.chats.find(
        (chat) => chat.chatId == message?.chatId
      );
      if (!foundChat) return;
      const messageIndex = foundChat.messages.findIndex(
        (item) => item.messageId == message.messageId
      );
      if (messageIndex != -1) foundChat.messages.splice(messageIndex, 1);
    },
    async handleWsEvent(event) {
      const eventName = event;
      if (Object.prototype.hasOwnProperty.call(this.eventHandlers, eventName)) {
        await this.eventHandlers[eventName]();
      }
    },
    callUser() {
      if (this.currentChat)
        this.$router.push(`/calls?chatId=${this.currentChat.chatId}`);
    },
  },

  watch: {
    async getWsMessage() {
      await this.handleWsEvent(this.getWsMessage.event);
    },
    async currentChat(newValue, oldValue) {
      this.leaveLastMessageOnLeaveChat(oldValue);
      this.lastTopPosition = 0;
      await this.getFirstMessagesOfCurrChat();
    },
  },

  async mounted() {
    let chat = null;
    if (this.$route.query.userId) {
      const queryUserId = this.$route.query.userId;
      this.$router.replace({ query: null });
      if (queryUserId != this.getPayload?.userId) {
        chat = await this.createChat({
          newFriendUserId: queryUserId,
        });
        await this.sendWsMessage({ event: "userCreatedChat", data: { chat } });
      }
    }
    this.chats = await this.getChats();
    if (chat) {
      this.currentChat = this.chats.find((item) => item.chatId == chat.chatId);
    } else {
      this.sideBarHidden = false;
    }
    await this.sendWsMessage({ event: "getOnlineUsers" });
  },
};
</script>

<style lang="scss">
.chats-view {
  display: grid;
  grid-template-columns: minmax(200px, 250px) minmax(400px, auto);
  max-height: calc(100vh - var(--navbar-height) - var(--messages-block-height));
  overflow: hidden;
  .side-bar-left {
    background: var(--light-white-color);
    border-right: solid 1px var(--light-grey-color);
    overflow-y: auto;
    max-height: inherit;
    h3 {
      padding: 0.7rem 0.5rem 0.7rem 0.5rem;
      border-bottom: solid 1px var(--light-grey-color);
    }
  }
  .toggle-chats {
    display: none;
  }
  .chat-container {
    max-height: inherit;
    background: #43414178;
    backdrop-filter: blur(10px);
    display: grid;
    grid-template-rows: auto 1fr auto;
    .header {
      background: var(--light-white-color);
      display: grid;
      grid-template-columns: auto auto 1fr auto;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1em;
      padding: 0.5rem 1rem;
      border-bottom: solid 1px var(--light-grey-color);
      .username {
        a {
          text-decoration: none;
          color: inherit;
        }
      }
      .is-online {
        .online-dot {
          display: block;
          height: 0.7rem;
          width: 0.7rem;
          border-radius: 50%;
          background-color: #1ce61c;
        }
      }
      .call-user-btn {
        justify-self: flex-end;
        border: none;
        outline: none;
        background: inherit;
        padding: 0;
        height: 24px;
        width: 24px;
        cursor: pointer;
        img {
          height: inherit;
          width: inherit;
          &:hover,
          &:focus {
            filter: invert(51%) sepia(87%) saturate(3291%) hue-rotate(200deg)
              brightness(96%) contrast(100%);
          }
        }
        &:disabled img {
          filter: invert(0.5);
        }
      }
      .toggle-menu {
        justify-self: flex-end;
      }
    }
    .body {
      overflow-y: auto;
      display: flex;
      flex-direction: column-reverse;
      max-height: inherit;
      .message-container {
        display: grid;
        justify-items: start;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .chats-view {
    display: block;
    .side-bar-left {
      position: absolute;
      height: calc(100vh - var(--navbar-height) - var(--messages-block-height));
      overflow-y: auto;
      z-index: 10;
      left: 0;
      width: 250px;
      transition: left 0.3s ease-in-out;
      &.hidden {
        left: -250px;
      }
      &.hidden + .toggle-chats {
        left: 10px;
      }
    }
    .toggle-chats {
      display: block;
      position: absolute;
      top: 0.6rem;
      left: 210px;
      background: white;
      border-radius: 3px;
      padding: 1px;
      height: 24px;
      width: 24px;
      outline: none;
      border: none;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      z-index: 11;
      transition: left 0.3s ease-in-out;
      cursor: pointer;
      .line {
        display: block;
        background: black;
        width: 100%;
        height: 3px;
      }
    }
    .chat-container {
      height: calc(100vh - var(--navbar-height) - var(--messages-block-height));
      width: 100%;
      .header .username {
        padding-left: 2rem;
      }
    }
  }
}

@media screen and (max-width: 400px) {
  .chats-view {
    display: block;
    .side-bar-left {
      position: absolute;
      height: calc(100vh - var(--navbar-height) - var(--messages-block-height));
      overflow-y: auto;
      z-index: 10;
      left: 0;
      width: 100%;
      transition: left 0.3s ease-in-out;
      &.hidden {
        left: -100%;
      }
      &.hidden + .toggle-chats {
        left: 10px;
      }
    }
    .toggle-chats {
      left: 90%;
    }
  }
}
</style>
