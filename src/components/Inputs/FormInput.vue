<template>
  <div class="input-block">
    <div class="form-input">
      <label class="input-label">{{ title }}</label>
      <input
        :name="inputName || ''"
        class="input"
        :value="modelValue"
        @input="inputUpdate"
        :type="!isPassword ? 'text' : 'password'"
        :placeholder="placeholder || title"
      />
    </div>
    <div class="error-block">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: ["title", "inputName", "placeholder", "isPassword", "modelValue"],
  emits: ["update:modelValue"],
  methods: {
    inputUpdate(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style lang="scss">
.input-block {
  .form-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .input-label {
      font-size: 0.75rem;
      font-weight: bold;
      // color: var(--light-grey-color);
      margin-bottom: 4px;
      margin-left: 1px;
    }
    .input,
    textarea {
      position: relative;
      font-size: 1em;
      width: 100%;
      border: none;
      box-shadow: 0px 1.5px 0px 0px #858585;
      margin: 0.1rem;
      padding: 0.5rem;
      transition: all 200ms ease-in-out;
      opacity: 0.8;
      &::placeholder {
        color: rgb(145, 145, 145);
        font-size: 0.75rem;
      }
      &::after {
        content: attr(placeholder);
        position: absolute;
        color: #161616;
        top: 0;
        left: 0;
      }
      &:focus {
        border: none;
        box-shadow: 0px 2.5px 0px 0px #52dc69;
        outline: none;
      }
      &:focus::placeholder {
        visibility: hidden;
      }
    }

    .input,
    textarea,
    .multiselect,
    .multiselect .multiselect__select,
    .multiselect .multiselect__tags,
    .multiselect .multiselect__single,
    .multiselect .multiselect__input {
      background-color: var(--light-white-color);
    }
    .input {
      height: 36.8px;
    }
    textarea {
      height: 110px;
      overflow-y: auto;
      resize: none;
      white-space: pre-wrap;
    }
  }
}
</style>
