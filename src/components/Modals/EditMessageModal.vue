<template>
  <ModalWrapper :ifStatement="modelValue" :closeFunc="closeModal">
    <div class="modal modal-edit-message">
      <div class="header">
        <h3 class="title">Edit message</h3>
        <CloseModalBtn @click="closeModal" />
      </div>
      <div class="main">
        <form @submit.prevent="handleSubmit">
          <FormInputSlot title="Edit message">
            <template #input>
              <textarea
                v-model="content"
                placeholder="Message cannot be empty"
              />
            </template>
            <template #error>
              <RequiredError :v="v.content" />
            </template>
          </FormInputSlot>

          <CustomButton btnType="submit">Edit</CustomButton>
        </form>
      </div>
    </div>
  </ModalWrapper>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import ModalWrapper from "@/components/Modals/ModalWrapper.vue";
import FormInputSlot from "@/components/Inputs/FormInputSlot.vue";
import CloseModalBtn from "@/components/Buttons/CloseModalBtn.vue";
import CustomButton from "../Buttons/CustomButton.vue";
import RequiredError from "../InputErrors/RequiredError.vue";

const initialData = () => {
  return {
    content: "",
  };
};

export default {
  name: "EditMessageModal",
  components: {
    ModalWrapper,
    CloseModalBtn,
    FormInputSlot,
    CustomButton,
    RequiredError,
  },
  emits: ["editMessage", "update:modelValue"],
  props: ["modelValue", "message"],
  data() {
    return initialData();
  },
  setup() {
    return { v: useVuelidate() };
  },
  validations() {
    return {
      content: {
        required,
      },
    };
  },
  methods: {
    resetModal() {
      const data = initialData();
      Object.keys(data).forEach((k) => (this[k] = data[k]));
    },
    closeModal() {
      this.$emit("update:modelValue", false);
    },
    async handleSubmit() {
      if (this.message) {
        this.v.$touch();
        if (this.v.$error) return;
        this.$emit("editMessage", {
          messageId: this.message.messageId,
          content: this.content,
        });
      }
      this.closeModal();
    },
  },
  watch: {
    message() {
      if (!this.message) return this.closeModal();
      this.content = this.message.content;
    },
  },
  mounted() {
    this.resetModal();
    if (!this.message) return this.closeModal();
    this.content = this.message.content;
  },
};
</script>

<style lang="scss" scoped>
.modal {
  text-align: left;
  border-radius: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 1rem;
    .btn-modal-close {
      filter: invert(0.9);
    }
  }
  form {
    button {
      position: relative;
      margin-top: 1rem;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
