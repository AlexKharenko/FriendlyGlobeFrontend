<template>
  <p
    v-if="(v.$dirty && v.maxAge.$invalid) || forceShow"
    class="invalid-message"
  >
    Min age should be lower or equal max age
  </p>
</template>

<script>
export default {
  name: "MinAgeError",
  props: ["v", "forceShow"],
};
</script>

<style></style>
