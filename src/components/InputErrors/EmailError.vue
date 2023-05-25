<template>
  <p v-if="(v.$dirty && v.email.$invalid) || forceShow" class="invalid-message">
    Not email address
  </p>
</template>

<script>
export default {
  name: "EmailError",
  props: ["v", "forceShow"],
};
</script>

<style></style>
