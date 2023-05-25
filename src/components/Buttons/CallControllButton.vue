<template>
  <button class="coll-controll-btn"><slot /></button>
</template>

<script>
export default {
  name: "CustomButton",
  props: ["btnType"],
};
</script>

<style lang="scss">
.coll-controll-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--light-white-color);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: all 0.3s;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    height: 0;
    width: 2px;
    background: black;
    filter: invert(0.1);
    transform: rotate(-45deg);
    transition: height 0.3s;
  }
  img {
    height: 50%;
    width: 50%;
    filter: invert(0.95);
  }
  &.call-answer {
    background-color: var(--green-color);
  }
  &.call-reject,
  &.call-end {
    background-color: var(--alert-color);
  }
  &.call-end {
    transform: rotate(135deg);
  }
  &:hover,
  &:focus-visible {
    background-color: var(--light-blue-color);
  }
  &.call-reject:hover,
  &.call-end:hover,
  &.call-reject:focus-visible,
  &.call-end:focus-visible {
    background-color: var(--alert-hover-color);
  }
  &.call-answer:hover,
  &.call-answer:focus-visible {
    background-color: var(--green-hover-color);
  }
  &.disabled {
    background-color: var(--light-grey-color);
  }
  &.disabled:hover,
  &.disabled:focus-visible {
    background-color: var(--grey-color);
  }
  &.disabled::before {
    height: 70%;
  }
}
</style>
