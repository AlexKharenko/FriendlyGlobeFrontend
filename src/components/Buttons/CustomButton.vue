<template>
  <button :type="btnType"><slot /></button>
</template>

<script>
export default {
  name: "CustomButton",
  props: ["btnType"],
};
</script>

<style scoped>
button {
  font-family: monospace;
  background-color: var(--light-white-color);
  color: var(--light-blue-color);
  border: none;
  border-radius: 8px;
  width: 100px;
  height: 45px;
  transition: 0.3s;
  cursor: pointer;
}

button:hover {
  background-color: var(--light-blue-color);
  box-shadow: 0 0 0 5px var(--light-blue-shadow);
  color: #fff;
}
</style>
