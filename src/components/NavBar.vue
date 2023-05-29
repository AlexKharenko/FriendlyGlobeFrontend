<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>
    <div class="route-block" v-if="isAuthenticated">
      <router-link v-if="isAuthenticated" to="/chats">Chats</router-link>
      <span class="unread-messages-count" v-if="getUnreadMessagesCount > 0">{{
        getUnreadMessagesCount
      }}</span>
    </div>
    <router-link v-if="isAuthenticated" :to="`/users/${getPayload.username}`">
      Profile
    </router-link>
    <router-link v-if="isAuthenticated" to="/search">Search</router-link>
    <router-link v-if="isAdmin" to="/admin">Admin</router-link>
    <router-link v-if="!isAuthenticated" to="/signin">SignIn</router-link>
    <router-link v-if="!isAuthenticated" to="/signup">SignUp</router-link>
    <button v-if="isAuthenticated" @click="signOut">SignOut</button>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "NavBar",
  computed: {
    ...mapGetters([
      "isAdmin",
      "isAuthenticated",
      "getPayload",
      "getUnreadMessagesCount",
    ]),
  },
  methods: { ...mapActions(["signOut"]) },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  height: var(--navbar-height);
  background: var(--ocean-color-half-transperent);
  .route-block {
    position: relative;
    .unread-messages-count {
      position: absolute;
      top: -12px;
      right: -7px;
      padding: 1px 2px;
      max-width: 24px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.8em;
      background-color: var(--alert-color);
      border-radius: 20px;
      color: var(--light-white-color);
    }
  }
  button {
    border: none;
    background: none;
    font: inherit;
    cursor: pointer;
  }
  button,
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #277d58;
      text-decoration: underline;
    }
    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
