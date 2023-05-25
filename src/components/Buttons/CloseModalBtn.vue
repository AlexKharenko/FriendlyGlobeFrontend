<template>
  <button class="btn btn-modal-close">
    <img src="../../assets/icons/close.png" alt="Close image" />
  </button>
</template>
<style lang="scss" scoped>
.btn-modal-close {
  height: 24px;
  width: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  img {
    object-fit: fill;
    height: inherit;
    width: inherit;
    transition: all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
}

.btn-modal-close:hover img {
  transform: rotate(90deg);
}
</style>
