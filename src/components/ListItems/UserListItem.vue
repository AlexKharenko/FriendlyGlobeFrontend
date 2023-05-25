<template>
  <div class="list-item user-list-item user-card">
    <div class="tools">
      <div class="circle">
        <span class="red box"></span>
      </div>
      <div class="circle">
        <span class="yellow box"></span>
      </div>
      <div class="circle">
        <span class="green box"></span>
      </div>
    </div>
    <div class="card-content">
      <div class="card-header">
        <div class="account-photo">
          <img
            v-if="user.profilePhotoURL"
            :src="getProfilePhotoUrl"
            alt="User photo"
          />
          <div class="no-account-photo" v-else>
            <span>{{ usernameFirstLetter }}</span>
          </div>
        </div>
        <span class="country-code">{{ user.country.countryCode }}</span>
      </div>
      <div class="card-body">
        <div class="username">
          <router-link :to="`/users/${user.username}`">
            {{ user.username }}
          </router-link>
        </div>
        <div class="user-info-block">
          <div class="age text-info">
            {{ getAge(user.birthdayDate) }}, {{ userSex }}
          </div>
          <div class="country text-info">
            Country: {{ user.country.countryName }}
          </div>
        </div>
        <div class="user-bio">
          <span>
            {{ user.userDetails.bio }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAge } from "@/utils/getAge.js";
export default {
  name: "UserListItem",
  props: ["user"],
  methods: {
    getAge,
  },
  computed: {
    ...mapGetters(["getSexList"]),
    usernameFirstLetter() {
      return this.user.username[0].toUpperCase();
    },
    getProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.user.profilePhotoURL}`;
    },
    userSex() {
      return this.getSexList.find((item) => item.id == this.user.sexId).title;
    },
  },
};
</script>

<style lang="scss">
.user-card {
  --no-account-photo-back: rgb(99, 99, 164);

  position: relative;
  width: 190px;
  height: 254px;
  background-color: #f8fbfe;
  border-radius: 8px;
  z-index: 1;
  .tools {
    display: flex;
    align-items: center;
    padding: 9px;

    .circle {
      padding: 0 4px;
      .box {
        display: inline-block;
        align-items: center;
        width: 10px;
        height: 10px;
        padding: 1px;
        border-radius: 50%;
      }
      .red {
        background-color: #ff605c;
      }

      .yellow {
        background-color: #ffbd44;
      }

      .green {
        background-color: #00ca4e;
      }
    }
  }
  .card-content {
    position: relative;
    width: inherit;
    padding: 0 0.5rem;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .account-photo {
        position: relative;
        top: 0;
        left: 0;
        height: 80px;
        width: 80px;
        background: var(--no-account-photo-back);
        color: var(--light-white-color);
        border-radius: 50%;
        overflow: hidden;
        .no-account-photo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          span {
            font-size: 2em;
          }
        }
        img {
          height: inherit;
          width: inherit;
          object-fit: cover;
        }
      }
      .country-code {
        font-weight: 600;
        color: var(--span-grey-color);
      }
    }
    .card-body {
      display: grid;
      gap: 0.3rem;
      margin-top: 0.4rem;
      .username {
        font-size: 1.15rem;
        font-weight: 600;
        a {
          text-decoration: none;
        }
      }
      .user-info-block {
        font-size: 0.875em;
        font-weight: 600;
        color: var(--grey-color);
      }
      .user-bio {
        height: 3em;
        line-height: 1em;
        width: 100%;
        overflow: hidden;
        span {
          content: attr(data-content);
          display: block;
          width: 100%;
          text-overflow: ellipsis;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          height: 100%;
        }
      }
    }
  }
}
</style>
