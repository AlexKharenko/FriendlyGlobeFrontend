<template>
  <div
    class="wrapper"
    :class="{
      'message-block-shown': showMessageBlock,
    }"
  >
    <nav class="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/chats" v-if="isAuthenticated">Chats</router-link>
      <router-link v-if="isAuthenticated" :to="`/users/${getPayload.username}`">
        Profile
      </router-link>
      <router-link to="/search">Search</router-link>
      <router-link v-if="isAdmin" to="/admin">Admin</router-link>
      <router-link v-if="!isAuthenticated" to="/signin">SignIn</router-link>
      <router-link v-if="!isAuthenticated" to="/signup">SignUp</router-link>
      <button v-if="isAuthenticated" @click="signOut">SignOut</button>
    </nav>
    <div class="messages-block" v-if="showMessageBlock">
      <div class="sticky-message" v-if="getPayload.hidden">
        You are in hidden mode
      </div>
      <div class="sticky-message alert" v-if="!getPayload.verified">
        Your account is not verified! Some functions is not availiable!
      </div>
      <div class="sticky-message" v-if="!getPayload.profilePhotoURL">
        <router-link to="/profile/update">Upload photo</router-link>
      </div>
    </div>
    <div class="background-fixed"></div>
    <router-view
      class="main"
      :class="{
        'margin-top': !showMessageBlock,
      }"
    />
    <CallingUserModal />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CallingUserModal from "./components/Modals/CallingUserModal.vue";
export default {
  components: { CallingUserModal },
  computed: {
    ...mapGetters(["isAuthenticated", "isAdmin", "getPayload", "getWS"]),
    showMessageBlock() {
      return (
        (this.getPayload.hidden ||
          !this.getPayload.verified ||
          !this.getPayload.profilePhotoURL) &&
        this.isAuthenticated
      );
    },
  },
  methods: { ...mapActions(["signOut"]) },
  async created() {
    await this.$store.dispatch("refreshTokens");
  },
};
</script>
r
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --navbar-height: 70px;
  --footer-height: 80px;
  --messages-block-height: 0px;
  --messages-block-paddings: 0px;

  // backgrounds

  // colors
  --span-grey-color: #aaa8a8;
  --grey-color: #797777;
  --light-grey-color: #d8d0d0de;
  --ocean-color: #55cbf9;
  --ocean-color-half-transperent: #55caf9ba;
  --light-white-color: #f3f7fe;
  --light-blue-color: #3b82f6;
  --light-blue-shadow: #3b83f65f;
  --alert-color: rgb(244, 93, 93);
  --alert-hover-color: rgb(245, 123, 123);
  --yellow-color: #f7f710d7;
  --green-color: #43b043;
  --green-hover-color: #56e156;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  // background: rgb(215, 208, 208);
}

#modals {
  position: fixed;
  top: 0;
  left: 0;
}

.error-msg,
.invalid-message {
  color: var(--alert-color);
}

.invalid-message {
  font-size: 0.8em;
}

.messages-block {
  position: sticky;
  top: var(--navbar-height);
  height: var(--messages-block-height);
  overflow: hidden;
  display: grid;
  gap: 0.2rem;
  justify-content: center;
  align-items: center;
  background: var(--yellow-color);
  z-index: 5;
  padding: var(--messages-block-paddings);
  .sticky-message {
    font-weight: 600;
    &.alert {
      color: var(--alert-color);
    }
  }
}

.message-block-shown {
  --messages-block-height: 4rem;
  --messages-block-paddings: 5px;
}

.wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  .background-fixed {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("@/assets/backgrounds/Background.jpg");
    z-index: -1;
  }
  &:has(.signin) .background-fixed,
  &:has(.signup) .background-fixed {
    background-image: url("@/assets/backgrounds/BackgroundAuth.jpg");
  }
  .main {
    position: relative;
    min-height: calc(
      100vh - var(--navbar-height) - var(--messages-block-height)
    );
    max-width: 100%;
    &:not(.signin, .signup, .chats-view, .call-view) {
      padding: 0.5rem 1rem;
      margin: 1rem 10% 0 10%;
      background: var(--light-grey-color);
      box-shadow: -10px 0px 10px rgba(0, 0, 0, 0.5),
        10px 0px 10px rgba(0, 0, 0, 0.5);
      &.margin-top {
        margin-top: 4rem;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .wrapper {
    .main {
      &:not(.signin, .signup) {
        margin: 0;
      }
    }
  }
}

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
