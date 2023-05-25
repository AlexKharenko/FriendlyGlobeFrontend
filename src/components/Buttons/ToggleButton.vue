<template>
  <div class="toggle-btn-container">
    <input
      type="checkbox"
      class="checkbox"
      id="checkbox"
      :checked="checked"
      @change="inputUpdate"
    />
    <label class="switch" for="checkbox">
      <span class="slider"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: "ToggleButton",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    checked() {
      return this.modelValue;
    },
  },
  methods: {
    inputUpdate(event) {
      this.$emit("update:modelValue", event.target.checked);
    },
  },
};
</script>

<style lang="scss">
.toggle-btn-container {
  width: 51px;
  height: 31px;
  position: relative;

  .checkbox {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
  .switch {
    width: 100%;
    height: 100%;
    display: block;
    background-color: #e9e9eb;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease-out;
    .slider {
      width: 27px;
      height: 27px;
      position: absolute;
      left: calc(50% - 27px / 2 - 10px);
      top: calc(50% - 27px / 2);
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15),
        0px 3px 1px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease-out;
      cursor: pointer;
    }
  }
  .checkbox:checked + .switch {
    background-color: #34c759;
  }
  .checkbox:checked + .switch .slider {
    left: calc(50% - 27px / 2 + 10px);
    top: calc(50% - 27px / 2);
  }
}
</style>
