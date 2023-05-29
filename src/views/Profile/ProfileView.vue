<template>
  <div class="profile">
    <div class="admin-options" v-if="isAdmin">
      Hidden: {{ user.hidden }} | Blocked: {{ user.blocked }} | Verified:
      {{ user.verified }}
    </div>
    <div class="header">
      <div class="header-left-part">
        <div class="account-photo">
          <img
            v-if="user?.profilePhotoURL"
            :src="getProfilePhotoUrl"
            alt="User photo"
          />
          <div class="no-account-photo" v-else>
            <span>{{ usernameFirstLetter }}</span>
          </div>
        </div>
      </div>
      <div class="header-right-part">
        <h2 class="username">{{ user.username }}</h2>
        <p class="fullname">Full name: {{ fullName }}</p>
        <p class="age">Age: {{ getAge(user.birthdayDate) }}</p>
        <p class="sex">{{ userSex }}</p>
        <p class="country">Country: {{ userCountry }}</p>
        <div class="user-btns">
          <CustomButton @click="redirectToChats" v-if="!isPageOfCurrUser">
            Send message
          </CustomButton>
          <CustomButton
            v-else-if="isPageOfCurrUser"
            @click="redirectManageProfile"
          >
            Manage
          </CustomButton>
          <DotsMenu
            :isCurrUser="isPageOfCurrUser"
            :user="user"
            blacklistLink="/profile/blacklist"
            @addToBlacklist="addToBlacklistEmit"
          />
        </div>
      </div>
    </div>
    <div class="body">
      <section>
        <h2>Bio</h2>
        <p class="bio-text">
          {{ user.userDetails.bio }}
        </p>
      </section>
      <section>
        <h2>Looking for</h2>
        <p class="looking-for-text" v-if="user?.lookingFor">
          {{ user.userDetails.bio }}
        </p>
        <p class="looking-for-text" v-else>
          I'm hoping to use the hobbies and interests section on my user profile
          to connect with others who share my passions and hobbies.
          Specifically, I'm looking for friends who have similar interests in
          and who might want to explore these activities together. I'm also
          interested in meeting people who speak different languages, as I'm
          always eager to learn and practice new languages. If you share any of
          these interests, feel free to reach out and let's chat!
        </p>
      </section>
      <section>
        <h2>Languages</h2>
        <span class="section-description">
          Languages that user know or want to learn.
        </span>
        <p class="language-list">{{ languageList }}</p>
      </section>
      <section>
        <h2>Interests / Hobbies</h2>
        <span class="section-description">
          {{ hobbiesSectionDescription }}
        </span>
        <p class="hobbies-list">{{ hobbyList }}</p>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getAge } from "@/utils/getAge";
import CustomButton from "../../components/Buttons/CustomButton.vue";
import DotsMenu from "../../components/DotsMenu.vue";

export default {
  components: { CustomButton, DotsMenu },
  name: "ProfileView",
  data() {
    return {
      user: {
        userId: "",
        username: "",
        sexId: "",
        country: {},
        userDetails: {},
        languages: [{}],
        hobbies: [{}],
      },
    };
  },
  computed: {
    ...mapGetters(["getPayload", "getSexList", "isAdmin"]),

    getProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.user.profilePhotoURL}`;
    },
    hobbiesSectionDescription() {
      return `In the hobbies and interests section of ${this.user.username}'s profile, you can discover their favorite activities and pastimes. This section is a great way to find common interests and similarities with ${this.user.username}, and to connect with them on a personal level.`;
    },
    hobbyList() {
      return this.user.hobbies.map((item) => item.hobby).join(" / ");
    },
    languageList() {
      return this.user.languages.map((item) => item.language).join(" / ");
    },
    lookingFor() {
      return this.user.userDetails.lookingFor;
    },
    fullName() {
      return `${this.user.firstName} ${this.user.secondName}`;
    },
    userCountry() {
      return `${this.user.country.countryName}/${this.user.country.countryCode}`;
    },
    isPageOfCurrUser() {
      return this.user?.userId === this.getPayload.userId;
    },
    usernameFirstLetter() {
      return this.user.username[0]?.toUpperCase();
    },
    userSex() {
      return this.getSexList.find((item) => item.id == this.user?.sexId)?.title;
    },
  },
  methods: {
    ...mapActions(["getUserProfile", "addToBlacklist"]),
    getAge,
    redirectToChats() {
      this.$router.push(`/chats?userId=${this.user.userId}`);
    },
    redirectManageProfile() {
      this.$router.push("/profile/update");
    },
    async addToBlacklistEmit(userId) {
      await this.addToBlacklist(userId);
      this.$router.push("/search");
    },
  },

  async beforeRouteUpdate(to, from, next) {
    const { user, message } = await this.getUserProfile(to.params.username);
    if (message) return this.$router.push(`/users/${this.getPayload.username}`);
    else this.user = user;
    next();
  },
  async mounted() {
    const { user, message } = await this.getUserProfile(
      this.$route.params.username
    );
    if (message) return this.$router.push(`/users/${this.getPayload.username}`);
    else this.user = user;
  },
};
</script>

<style lang="scss">
.profile {
  --no-account-photo-back: rgb(99, 99, 164);
  .admin-options {
    display: flex;
    justify-content: center;
    font-weight: 600;
    font-size: 1.2em;
  }
  .header {
    display: grid;
    grid-template-columns: auto auto;
    justify-items: center;
    align-items: center;
    margin-top: 3rem;
    padding: 2rem 0;
    border-bottom: solid 2px black;
    .header-left-part {
      .account-photo {
        height: 200px;
        width: 200px;
        overflow: hidden;
        border-radius: 50%;
        img {
          height: inherit;
          width: inherit;
          object-fit: cover;
        }
        .no-account-photo {
          display: flex;
          justify-content: center;
          align-items: center;
          height: inherit;
          width: inherit;
          background: var(--no-account-photo-back);
          span {
            font-size: 4em;
            font-weight: 600;
            color: var(--light-white-color);
          }
        }
      }
    }
    .header-right-part {
      display: grid;
      gap: 0.5rem 1rem;
      justify-self: flex-start;
      h2 {
        font-size: 1.75em;
      }
      p {
        font-size: 1.05em;
        font-weight: 600;
      }
      .user-btns {
        display: flex;
        align-items: center;
        gap: 2rem;
      }
    }
  }
  .body {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 1.05em;
      padding: 0 3rem;
      .bio-text,
      .looking-for-text {
        font-size: 1.15em;
        line-height: 1.3em;
        white-space: pre-wrap;
        text-indent: 1.5rem;
        overflow-wrap: break-word;
      }
      .section-description {
        color: var(--grey-color);
      }
      .language-list,
      .hobbies-list {
        font-weight: 600;
        font-size: 1.1em;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .profile {
    .header {
      grid-template-columns: 1fr;
      gap: 2rem;
      .header-right-part {
        justify-self: center;
        justify-items: center;
      }
    }
  }
}
</style>
