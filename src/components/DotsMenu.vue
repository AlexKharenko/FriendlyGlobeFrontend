<template>
  <div class="toggle-menu">
    <button class="toggle-button" @click="toggleMenu">
      <span class="dot"> </span>
      <span class="dot"></span>
      <span class="dot"></span>
    </button>
    <div v-if="menuOpen" class="menu">
      <ul>
        <li v-if="!isCurrUser">
          <button @click="addToBlacklist">Add to Blacklist</button>
        </li>
        <li>
          <router-link :to="blacklistLink">Blacklist</router-link>
        </li>
        <slot />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["isCurrUser", "user", "blacklistLink"],
  emits: ["addToBlacklist"],
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      const modal = document.querySelector(".toggle-menu");
      if (modal && !modal.contains(event.target)) {
        this.menuOpen = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    addToBlacklist() {
      this.$emit("addToBlacklist", this.user.userId);
    },
  },
};
</script>

<style lang="scss">
.toggle-menu {
  position: relative;
  display: inline-block;
  .toggle-button {
    background-color: transparent;
    height: 27px;
    width: 20px;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .dot {
      display: block;
      height: 5px;
      width: 5px;
      border-radius: 50%;
      background: black;
      transition: background 0.1s linear;
    }
  }

  .toggle-button:hover .dot {
    background: #4e4e4e;
  }
  .menu {
    position: absolute;
    top: calc(100% + 5px);
    right: 0;
    z-index: 5;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 0;
    }

    button,
    a {
      display: block;
      width: 100%;
      padding: 5px;
      text-align: left;
      font-size: 0.85em;
      color: #333;
      text-decoration: none;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    button:hover,
    a:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
