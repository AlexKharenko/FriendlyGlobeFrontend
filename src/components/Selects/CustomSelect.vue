<template>
  <div class="select-block">
    <div
      class="select-input"
      :class="selectOpened ? 'active' : ''"
      tabindex="0"
      @click="toggleSelect"
      @keypress.enter="toggleSelect"
    >
      <div
        class="select-value"
        :class="modelValue === null ? 'placeholder' : ''"
      >
        {{ selectedField }}
      </div>
      <div class="select-arrow"></div>
    </div>
    <transition name="slide">
      <div class="select-dropdown" v-if="selectOpened">
        <div class="select-list">
          <p
            v-if="!noEmpty"
            class="select-option"
            :class="modelValue === null ? 'active disabled' : ''"
            :tabindex="modelValue === null ? '-1' : '0'"
            @keypress.enter="selectValue(null)"
            @click="selectValue(null)"
          >
            Empty
          </p>
          <p
            class="select-option"
            v-for="item in list"
            :key="item[fieldKey || 'id']"
            :class="
              modelValue && modelValue === item[fieldKey]
                ? 'active disabled'
                : ''
            "
            :tabindex="modelValue && modelValue === item[fieldKey] ? '-1' : '0'"
            @keypress.enter="selectValue(item[fieldKey])"
            @click="selectValue(item[fieldKey])"
          >
            {{ item[chooseBy] }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CustomSelect",
  emits: ["update:modelValue"],
  props: [
    "list",
    "chooseBy",
    "fieldKey",
    "modelValue",
    "placeholder",
    "noEmpty",
  ],
  data() {
    return {
      selectOpened: false,
    };
  },
  computed: {
    selectedField() {
      if (this.modelValue) {
        const element = this.list.find(
          (element) => element[this.fieldKey] == this.modelValue
        );
        return element[this.chooseBy];
      }

      return this.placeholder;
    },
  },
  methods: {
    toggleSelect() {
      this.selectOpened = !this.selectOpened;
    },
    selectValue(item) {
      this.$emit("update:modelValue", item);
      this.toggleSelect();
    },
  },
};
</script>

<style lang="scss" scoped>
.select-block {
  --select-option-dis-background: rgb(54, 53, 53);
  position: relative;
  max-width: 150px;
  .select-input {
    border-bottom: 2px solid black;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-right: 0.5rem;
    padding-bottom: 5px;
    height: 28px;
    background: grey;
    cursor: pointer;
    &.active {
      .select-arrow {
        transform: rotateX(180deg);
      }
    }

    .select-value {
      font-size: 1em;
      &:not(.placeholder) {
        font-family: montserrat-semibold;
      }
      &.placeholder {
        font-size: 15px;
      }
    }
    .select-arrow {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: solid 10px black;
      background: inherit;
      transition: transform 0.3s ease-in;
    }
  }
  .select-dropdown {
    position: absolute;
    background: var(--dropdown-background);
    width: 100%;
    z-index: 1;
    transform-origin: top;
    transition: all 0.3s ease-in-out;
    color: var(--text-second-color);
    max-height: 150px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: auto;
    .select-list {
      display: flex;
      max-height: inherit;
      flex-direction: column;
      .select-option {
        padding: 0.3rem 0.5rem;
        cursor: pointer;

        &:nth-child(even) {
          background: var(--dropdown-even-element-background);
        }
        &.disabled {
          background: var(--select-option-dis-background);
        }
        &:not(.disabled):hover {
          background: var(--dropdown-element-background-hover);
        }
      }
    }
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }
}
</style>
