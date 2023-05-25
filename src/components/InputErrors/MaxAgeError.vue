<template>
  <p
    v-if="(v.$dirty && v.minAge.$invalid) || forceShow"
    class="invalid-message"
  >
    Max age should be greater or equal min age
  </p>
</template>

<script>
export default {
  name: "MaxAgeError",
  props: ["v", "forceShow"],
};
</script>

<style></style>
