<template>
  <p
    v-if="(v.$dirty && v.sameAs.$invalid) || forceShow"
    class="invalid-message"
  >
    {{ text }}
  </p>
</template>

<script>
export default {
  name: "SameAsError",
  props: ["v", "text", "forceShow"],
};
</script>

<style></style>
