<template>
  <div
    class="message-item"
    :class="
      currentUserId == message.senderId ? 'own-message' : 'received-message'
    "
    @click="toggleCustomContextMenu"
  >
    <div class="message-text">{{ message.content }}</div>
    <div class="message-details">{{ isEdited }} {{ toTime }} {{ isRead }}</div>
    <div class="message-context-menu" v-if="contextMenuOpened" ref="conMenu">
      <ul>
        <li v-if="isOwnMessage">
          <button @click="editMessage">Edit</button>
        </li>
        <li v-if="isOwnMessage">
          <button @click="deleteMessage">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageItem",
  props: ["message", "currentUserId"],
  emits: ["onEditClick", "onDeleteClick"],
  data() {
    return {
      contextMenuOpened: false,
    };
  },
  computed: {
    isOwnMessage() {
      if (this.message.senderId == this.currentUserId) return true;
      return false;
    },
    isEdited() {
      return this.message.edited ? "edited" : "";
    },
    isRead() {
      return this.message.read && this.currentUserId == this.message.senderId
        ? "read"
        : "";
    },
    toTime() {
      const currentDate = new Date();
      const messageCreated = new Date(this.message.timeCreated);
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
          weekday: "long",
        });
      } else {
        formattedTime = messageCreated.toLocaleDateString();
      }
      return formattedTime;
    },
  },
  methods: {
    toggleCustomContextMenu(event) {
      event.preventDefault();
      if (this.isOwnMessage) {
        const clickedY = event.clientY;
        this.contextMenuOpened = !this.contextMenuOpened;
        if (this.contextMenuOpened) {
          this.$nextTick(() => {
            if (clickedY <= window.innerHeight / 2)
              this.$refs.conMenu.classList.add("top");
            else this.$refs.conMenu.classList.add("bottom");
          });
          document.addEventListener("click", this.handleClickOutside);
        } else {
          document.removeEventListener("click", this.handleClickOutside);
        }
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.contextMenuOpened = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    editMessage() {
      this.$emit("onEditClick", this.message);
    },
    deleteMessage() {
      this.$emit("onDeleteClick", this.message);
    },
  },
};
</script>

<style lang="scss">
.message-item {
  --received-message-color: black;

  position: relative;
  max-width: 300px;
  overflow-wrap: break-word;
  background: var(--light-white-color);
  margin: 0 1rem 1rem 1rem;
  padding: 0.5rem 0.7rem;
  border-radius: 7px;
  cursor: default;

  &.own-message {
    justify-self: end;
  }

  &.received-message {
    background-color: var(--received-message-color);
    color: var(--light-grey-color);
  }

  .message-text {
    display: inline;
    white-space: pre-wrap;
  }
  .message-details {
    float: right;
    margin: 0.3rem 0 0 0.7rem;
    font-size: 0.8em;
    color: (var(--grey-color));
  }
  &:first-child {
    margin-top: 1rem;
  }

  .message-context-menu {
    position: absolute;
    right: 0;
    z-index: 5;
    background-color: #54cfc1;
    border: 1px solid #63ebdb;
    border-radius: 5px;
    padding: 5px;
    &.top {
      top: 90%;
    }
    &.bottom {
      bottom: 90%;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 0;
    }

    button {
      display: block;
      width: 100%;
      padding: 5px;
      text-align: left;
      border-radius: 5px;
      font-size: 0.85em;
      color: #333;
      text-decoration: none;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    button:hover,
    a:hover {
      background-color: #44a398;
    }
  }
}
</style>
