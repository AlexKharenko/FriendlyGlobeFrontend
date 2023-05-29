<template>
  <ModalWrapper
    :ifStatement="isModalCallingUserOpened"
    :closeFunc="handleCloseRejectClick"
  >
    <div class="modal modal-calling-user">
      <div class="header">
        <h3 class="title">Calling...</h3>
        <CloseModalBtn @click="handleCloseRejectClick" />
      </div>
      <div class="main">
        <div class="calling-user-container">
          <div class="inititator-image-container">
            <img
              v-if="callInitiator.profilePhotoURL"
              :src="getCallIniciatorProfilePhotoUrl"
              alt="Caller photo"
            />
            <div v-else class="no-photo-circle">
              {{ callInitiatorUsernameFirstLetter }}
            </div>
          </div>
          <h3 class="username">{{ callInitiator.username }}</h3>
        </div>
        <div class="controlls">
          <CallControllButton
            class="call-answer"
            @click="handleAnswerCallClick"
          >
            <img src="../../assets/icons/phone-call.png" alt="Answer call" />
          </CallControllButton>
          <CallControllButton
            class="call-reject"
            @click="handleCloseRejectClick"
          >
            <img src="../../assets/icons/close.png" alt="Reject call" />
          </CallControllButton>
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import ModalWrapper from "@/components/Modals/ModalWrapper.vue";
import CloseModalBtn from "@/components/Buttons/CloseModalBtn.vue";
import CallControllButton from "../Buttons/CallControllButton.vue";

export default {
  name: "CallingUserModal",
  components: {
    ModalWrapper,
    CloseModalBtn,
    CallControllButton,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["isModalCallingUserOpened", "getCallInfo", "getWsMessage"]),
    callInitiator() {
      return this.getCallInfo.initiator;
    },
    callInitiatorUsernameFirstLetter() {
      return this.callInitiator.username[0]?.toUpperCase();
    },
    getCallIniciatorProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.callInitiator.profilePhotoURL}`;
    },
  },
  methods: {
    ...mapActions([
      "closeCallingUserModal",
      "openCallingUserModal",
      "sendWsMessage",
    ]),
    closeModal() {
      return this.closeCallingUserModal();
    },
    async handleAnswerCallClick() {
      const redirectRoute = `/calls/?chatId=${this.getCallInfo.chatId}`;
      this.$router.push(
        `${redirectRoute}${
          this.$route.fullPath == redirectRoute ? "&update" : ""
        }`
      );
      this.closeModal();
    },
    async handleCloseRejectClick() {
      await this.sendWsMessage({
        event: "rejectCall",
        data: { chatId: this.getCallInfo.chatId },
      });
      this.closeModal();
    },
  },
  watch: {
    getWsMessage() {
      if (this.isModalCallingUserOpened)
        if (this.getWsMessage.event == "callEnded") {
          this.closeModal();
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
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    .calling-user-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .inititator-image-container {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        overflow: hidden;
        background: black;
        color: var(--light-white-color);
        img,
        .no-photo-circle {
          height: inherit;
          width: inherit;
        }

        .no-photo-circle {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2em;
        }

        img {
          object-fit: cover;
        }
      }
    }
    .controlls {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
