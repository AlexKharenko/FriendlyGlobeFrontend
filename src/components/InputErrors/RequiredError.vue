<template>
  <p
    v-if="(v.$dirty && v.required.$invalid) || forceShow"
    class="invalid-message"
  >
    {{ text || "Required field" }}
  </p>
</template>

<script>
export default {
  name: "RequiredError",
  props: ["forceShow", "v", "text"],
};
</script>

<style></style>
