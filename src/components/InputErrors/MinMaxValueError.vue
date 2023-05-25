<template>
  <p
    v-if="
      (v.$dirty && (v.maxValue.$invalid || v.minValue.$invalid)) || forceShow
    "
    class="invalid-message"
  >
    {{ minMaxText }}
  </p>
</template>

<script>
export default {
  name: "MinMaxValueError",
  props: ["v", "min", "max", "forceShow"],
  computed: {
    minMaxText() {
      return `The value shoud be between ${this.min} and ${this.max}`;
    },
  },
};
</script>

<style></style>
