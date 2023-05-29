<template>
  <teleport to="#modals">
    <transition name="modal" appear>
      <div class="modal-wrapper" @click="handleClickOutside" v-if="ifStatement">
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "ModalWrapper",
  props: ["closeFunc", "ifStatement"],
  methods: {
    handleClickOutside(event) {
      const modalWrapper = event.currentTarget;
      const modal = modalWrapper.querySelector(".modal");
      if (
        modal &&
        !modal.contains(event.target) &&
        event.target === modalWrapper
      ) {
        this.closeFunc();
      }
    },
  },
};
</script>

<style lang="scss">
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background: #2c3e50a2;
  padding: 1rem;
  backdrop-filter: blur(3px);
  .modal {
    padding: 1rem;
    margin: auto;
    background-color: var(--ocean-color-half-transperent);
    border-radius: 1rem;
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
