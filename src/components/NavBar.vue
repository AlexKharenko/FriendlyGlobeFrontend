<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>
    <router-link v-if="isAuthenticated" to="/chats">Chats</router-link>
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
    ...mapGetters(["isAdmin", "isAuthenticated", "getPayload"]),
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
