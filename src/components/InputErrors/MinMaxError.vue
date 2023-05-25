<template>
  <p
    v-if="
      (v.$dirty && (v.maxLength.$invalid || v.minLength.$invalid)) || forceShow
    "
    class="invalid-message"
  >
    {{ minMaxText }}
  </p>
</template>

<script>
export default {
  name: "MinMaxError",
  props: ["v", "min", "max", "forceShow"],
  data() {
    return {
      text: "The length of field shoud be",
    };
  },
  computed: {
    minMaxText() {
      if (this.min && this.max)
        return `${this.text} between ${this.min} and ${this.max}`;
      else if (this.min && !this.max) return `${this.text} from ${this.min}`;
      else return `${this.text} max ${this.max}`;
    },
  },
};
</script>

<style></style>
