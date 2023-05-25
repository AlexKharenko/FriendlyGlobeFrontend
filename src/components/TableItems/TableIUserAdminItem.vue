<template>
  <tr>
    <td>{{ user.userId }}</td>
    <td>
      <router-link :to="`/users/${user.username}`">{{
        user.username
      }}</router-link>
    </td>
    <td>{{ user.email }}</td>
    <td>{{ user.role }}</td>
    <td>{{ userDateCreatedAt }}</td>
    <td class="blocked-message">{{ userBlockedMessage }}</td>
    <td class="buttons-block">
      <button class="control-btn" @click="handleBlockClick()">
        {{ userBlockBtnTxt }}
      </button>
      <button
        class="control-btn"
        v-if="!user.verified"
        @click="handleVerifyUser()"
      >
        Verify
      </button>
    </td>
  </tr>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "TableIUserAdminItem",
  props: ["user"],
  emits: ["onUnblock", "onVerify"],
  computed: {
    userBlockedMessage() {
      const blockMessage = this.user.blockedUserMessage?.blockMessage;
      if (blockMessage) return blockMessage;
      return "";
    },
    userBlockBtnTxt() {
      return this.user.blocked ? "Unblock" : "Block";
    },
    userDateCreatedAt() {
      const options = { day: "numeric", month: "numeric", year: "numeric" };
      return new Date(this.user.createdAt).toLocaleDateString("en-US", options);
    },
  },
  methods: {
    ...mapActions(["openBlockUserModal", "unblockUser", "verifyUser"]),
    openModal() {
      return this.openBlockUserModal(this.user.userId);
    },
    async handleVerifyUser() {
      const result = await this.verifyUser(this.user.userId);
      if (result.success)
        this.$emit("onVerify", {
          userId: this.user.userId,
          verified: true,
        });
    },
    async handleUnblockUser() {
      const result = await this.unblockUser(this.user.userId);
      if (result.success)
        this.$emit("onUnblock", {
          userId: this.user.userId,
          blocked: false,
          blockedUserMessage: { blockMessage: null },
        });
    },
    handleBlockClick() {
      if (!this.user.blocked) this.openModal();
      else {
        this.handleUnblockUser();
      }
    },
  },
};
</script>

<style lang="scss">
.blocked-message {
  white-space: pre-wrap;
}
</style>
