<template>
  <div class="chat-item" :class="{ active: active }">
    <div class="account-photo">
      <img
        v-if="receiver?.profilePhotoURL"
        :src="getReceiverProfilePhotoUrl"
        alt="User photo"
      />
      <div class="no-account-photo" v-else>
        <span>{{ receiverUsernameFirstLetter }}</span>
      </div>
      <div class="is-chat-online">
        <span class="online-dot" v-if="chat?.online"></span>
      </div>
    </div>
    <div class="right-part">
      <div class="header">
        <div class="username">{{ receiver.username }}</div>
        <span class="last-message-time">{{ lastMessageTime }}</span>
      </div>
      <div class="chat-item-content">
        <div class="last-message">{{ lastMessage.content }}</div>
        <div class="unread-message-count" v-if="chat.unreadCount !== 0">
          {{ chat.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ChatItem",
  props: ["chat", "active"],
  computed: {
    ...mapGetters(["getPayload"]),
    lastMessage() {
      if (this.chat.messages.length == 0) return "";
      return this.chat.messages.at(-1);
    },
    lastMessageTime() {
      if (!this.lastMessage) return "";
      const currentDate = new Date();
      const messageCreated = new Date(this.lastMessage.timeCreated);
      const milisecondsInDay = 24 * 60 * 60 * 1000;
      const milDateDifference =
        currentDate.getTime() - messageCreated.getTime();
      let formattedTime = "";
      if (milDateDifference <= milisecondsInDay) {
        formattedTime = messageCreated.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (milDateDifference <= milisecondsInDay * 7) {
        formattedTime = messageCreated.toLocaleDateString([], {
          weekday: "short",
        });
      } else {
        formattedTime = messageCreated.toLocaleDateString();
      }
      return formattedTime;
    },
    receiver() {
      return this.chat.user1.userId == this.getPayload.userId
        ? this.chat.user2
        : this.chat.user1;
    },
    receiverUsernameFirstLetter() {
      return this.receiver.username[0]?.toUpperCase();
    },
    getReceiverProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.receiver.profilePhotoURL}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-item {
  width: 100%;
  --no-account-photo-back: rgb(99, 99, 164);
  display: grid;
  grid-template-columns: 50px 1fr;
  overflow: hidden;
  padding: 0.3rem 0 0.4rem 0.3rem;
  cursor: pointer;
  &:hover {
    background-color: var(--light-grey-color);
  }
  &.active {
    background-color: var(--ocean-color);
  }

  .account-photo {
    position: relative;
    height: 50px;
    width: 50px;
    .is-chat-online {
      position: absolute;
      bottom: 0.1rem;
      right: 0.1rem;
      .online-dot {
        transition: all 0.1s linear;
        display: block;
        height: 0.7rem;
        width: 0.7rem;
        border-radius: 50%;
        background-color: #22c622;
      }
    }
    img {
      height: inherit;
      width: inherit;
      object-fit: cover;
      border-radius: 50%;
    }
    .no-account-photo {
      display: flex;
      justify-content: center;
      align-items: center;
      height: inherit;
      width: inherit;
      background: var(--no-account-photo-back);

      border-radius: 50%;
      span {
        font-size: 1em;
        font-weight: 600;
        color: var(--light-white-color);
      }
    }
  }
  .right-part {
    display: grid;
    gap: 0.5rem;
    padding: 3px 3px 3px 7px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .username {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .last-message-time {
        font-size: 0.9em;
        color: var(--grey-color);
      }
    }
    .chat-item-content {
      display: flex;
      gap: 0.5rem;
      flex-wrap: nowrap; /* Prevent child elements from wrapping */
      align-items: center; /* Vertically center the content */
      overflow: hidden; /* Hide overflowing content */
      flex-grow: 1;
      .last-message {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.8em;
        color: var(--grey-color);
        flex-grow: 1;
      }
      .unread-message-count {
        flex-shrink: 0;
        height: 1rem;
        padding: 0 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background-color: var(--ocean-color);
        color: white;
        font-size: 0.8em;
        font-weight: 100;
      }
    }
  }
}
</style>
