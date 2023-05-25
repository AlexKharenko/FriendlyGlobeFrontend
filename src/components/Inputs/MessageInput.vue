<template>
  <div class="message-input-block">
    <textarea
      class="message-input scroll"
      rows="1"
      @input="adjustTextareaHeight"
      placeholder="Type your message here"
      ref="textarea"
      v-model.trim="message"
      :disabled="disable"
    />
    <button
      class="send-btn"
      @click="sendMessage"
      :disabled="disable || !message"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "MessageInput",
  props: ["disable"],
  emits: ["onSend"],
  data() {
    return {
      message: "",
      maxHeight: 200,
    };
  },
  methods: {
    sendMessage() {
      this.$emit("onSend", this.message);
      this.message = "";
      this.$nextTick(this.adjustTextareaHeight);
    },
    adjustTextareaHeight() {
      this.$nextTick(() => {
        const textarea = this.$refs.textarea;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(
          textarea.scrollHeight,
          this.maxHeight
        )}px`;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.message-input-block {
  display: flex;
  border-top: solid 1px var(--light-grey-color);
  padding: 1rem 2rem;
  background-color: var(--light-white-color);
  align-items: flex-end;
  .message-input {
    width: 100%;
    max-height: 200px;
    padding: 0;
    border: none;
    background-color: transparent;
    resize: none;
    font-size: 1rem;
    line-height: 1.5rem;
    overflow-y: auto;
    outline: none;
    &.scroll::-webkit-scrollbar {
      display: none;
    }
    &.scroll {
      overflow: -moz-scrollbars-none;
      -ms-overflow-style: none;
    }
  }
  .send-btn {
    border: none;
    background-color: var(--light-white-color);
    cursor: pointer;
    display: flex;
    overflow: hidden;
    outline: none;

    svg {
      height: 24px;
      width: 24px;
      transition: fill 0.15s linear;
    }
    &:focus svg,
    &:hover svg {
      fill: var(--light-blue-color);
    }
    &:disabled svg {
      fill: var(--grey-color);
    }
  }
}
</style>
