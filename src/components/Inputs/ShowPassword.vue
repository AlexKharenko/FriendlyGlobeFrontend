<template>
  <div class="show-password">
    <input
      id="is-password"
      type="checkbox"
      :value="modelValue"
      @change="$emit('update:modelValue', !modelValue)"
    />
    <label for="is-password">Show Password</label>
  </div>
</template>

<script>
export default {
  name: "ShowPassword",
  props: { modelValue: { type: Boolean } },
  emits: ["update:modelValue"],
};
</script>

<style lang="scss">
.show-password {
  display: flex;
  gap: 0.4rem;
}
</style>
