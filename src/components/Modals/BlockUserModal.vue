<template>
  <ModalWrapper :ifStatement="isModalBlockUserOpened" :closeFunc="closeModal">
    <div class="modal modal-block-user">
      <div class="header">
        <h3 class="title">BlockUser</h3>
        <CloseModalBtn @click="closeModal" />
      </div>
      <div class="main">
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleSubmit">
          <FormInputSlot title="Block message">
            <template #input>
              <textarea
                v-model="blockMessage"
                :maxlength="1000"
                placeholder="Reason of blocking"
              />
            </template>
          </FormInputSlot>

          <CustomButton btnType="submit">Block</CustomButton>
        </form>
      </div>
    </div>
  </ModalWrapper>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { maxLength } from "@vuelidate/validators";

import ModalWrapper from "@/components/Modals/ModalWrapper.vue";
import FormInputSlot from "@/components/Inputs/FormInputSlot.vue";
import CloseModalBtn from "@/components/Buttons/CloseModalBtn.vue";
import CustomButton from "../Buttons/CustomButton.vue";

const initialData = () => {
  return {
    blockMessage: "",
    errorMessage: "",
  };
};

export default {
  name: "BlockUserModal",
  components: {
    ModalWrapper,
    CloseModalBtn,
    FormInputSlot,
    CustomButton,
  },
  emits: ["onSuccess"],

  data() {
    return initialData();
  },
  validations() {
    return {
      blockMessage: {
        maxLength: maxLength(1000),
      },
    };
  },
  computed: {
    ...mapGetters(["isModalBlockUserOpened", "getUserIdModalData"]),
  },
  methods: {
    ...mapActions(["closeBlockUserModal", "openBlockUserModal", "blockUser"]),
    resetModal() {
      const data = initialData();
      Object.keys(data).forEach((k) => (this[k] = data[k]));
    },
    closeModal() {
      this.resetModal();
      return this.closeBlockUserModal();
    },
    async handleSubmit() {
      try {
        const result = await this.blockUser({
          userId: this.getUserIdModalData,
          blockMessage: this.blockMessage,
        });
        if (result?.success) {
          this.$emit("onSuccess", {
            userId: this.getUserIdModalData,
            blocked: true,
            blockedUserMessage: { blockMessage: this.blockMessage },
          });
          this.closeModal();
        } else {
          this.errorMessage = "Something went wrong. Try later.";
        }
      } catch (e) {
        this.errorMessage = "Something went wrong. Try later.";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  text-align: left;
  border-radius: 10px;
  z-index: 101;
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
