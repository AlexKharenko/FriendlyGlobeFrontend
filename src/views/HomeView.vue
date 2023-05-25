<template>
  <div class="home">
    <h1>Welcome to FriendlyGlobe!</h1>
    <div class="body">
      <div class="main-text">
        <h3>Welcome to our global friendship hub!</h3>
        <p>
          Are you looking to connect with like-minded individuals from all
          corners of the world? Look no further! Our site is designed to help
          you find friends across the globe who are eager to engage in
          meaningful conversations and build long-lasting friendships.
        </p>
        <p>
          We believe in fostering an open and welcoming community, where every
          user is encouraged to reach out and connect with others. Whether
          you're seeking cultural exchanges, language practice, or simply
          someone to share your thoughts and experiences with, our platform is
          the perfect place to start your global friendship journey.
        </p>
        <p>
          With our intuitive chat system, you can easily strike up conversations
          with fellow users and discover shared interests, passions, and
          perspectives. Engage in lively discussions, exchange stories, and
          forge connections that transcend borders and time zones.
        </p>
        <p>
          And that's not all! We also offer a convenient call functionality,
          allowing you to take your conversations to the next level. Connect
          with your newfound friends through voice or video calls, bridging the
          distance and experiencing real-time interactions that make the world
          feel smaller and more connected.
        </p>
        <p>
          So, what are you waiting for? Join our vibrant community and embark on
          an exciting adventure of friendship. Open your heart and mind to the
          possibilities that lie ahead, and let the magic of global connections
          unfold before you. Start exploring, start chatting, and start building
          friendships that know no boundaries.
        </p>
      </div>
      <div class="sign-in-block" v-if="!isAuthenticated">
        <h4>
          Ready to take your friendship adventures to the next level? It's time
          to sign up and unlock a world of global connections waiting for you!
        </h4>
        <custom-button @click="redirectToSignUp">Sign up</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomButton from "../components/Buttons/CustomButton.vue";
export default {
  name: "HomeView",
  components: { CustomButton },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    redirectToSignUp() {
      this.$router.push("/signup");
    },
  },
};
</script>

<style lang="scss">
.home {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  h1 {
    margin-top: 2rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4rem;
    .main-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      text-indent: 2rem;
      gap: 2rem;
    }
    .sign-in-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      button {
        height: 70px;
        width: 200px;
        font-size: 2em;
      }
    }
  }
}
</style>
