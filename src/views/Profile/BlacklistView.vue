<template>
  <div class="users-blacklist">
    <h2>Blacklist</h2>
    <div class="users-container">
      <h4 v-if="blacklist.length == 0">No users in blacklist</h4>
      <ol class="users-list" v-else>
        <li v-for="user in blacklist" :key="user.userId">
          <div class="user-blacklist-item">
            <span class="user-order"></span>
            <div class="username">{{ user.username }}</div>
            <span class="user-country">{{ user.country.countryName }}</span>
            <RemoveButton @click="removeFromBlacklist(user.userId)" />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RemoveButton from "../../components/Buttons/RemoveButton.vue";
export default {
  name: "BlacklistView",
  components: {
    RemoveButton,
  },
  data() {
    return {
      blacklist: [],
    };
  },
  computed: {},
  methods: {
    ...mapActions(["getBlacklist", "removeUserFromBlacklist"]),
    async removeFromBlacklist(userId) {
      const { success } = await this.removeUserFromBlacklist(userId);
      if (success)
        this.blacklist = this.blacklist.filter((user) => user.userId != userId);
    },
  },

  async mounted() {
    const users = await this.getBlacklist();
    this.blacklist = users;
  },
};
</script>

<style lang="scss">
.users-blacklist {
  h2 {
    margin: 1rem 0;
  }
  .users-container {
    padding: 0 2rem;
    margin: 2rem 0;
    background: var(--light-white-color);
    counter-reset: user-counter;
    .users-list {
      list-style: none;
      li {
        border-bottom: 2px solid #403e3e;
        &:last-child {
          border-bottom: none;
        }
        .user-blacklist-item {
          display: flex;
          align-items: center;
          padding: 10px;
          counter-increment: user-counter;
          .user-order::before {
            content: counter(user-counter) ".";
            margin-right: 10px;
            font-weight: bold;
          }
          .username {
            flex: 1;
            font-weight: bold;
          }
          .user-country {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 300px) {
  .users-blacklist {
    padding: 0.5rem 0 !important;
    h2 {
      margin: 1rem 0;
    }
    .users-container {
      padding: 0;
    }
  }
}
</style>
