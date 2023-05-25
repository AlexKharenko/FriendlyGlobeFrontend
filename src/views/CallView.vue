<template>
  <div class="call-view">
    <div class="view-block">
      <div class="call-message-container" v-if="message">
        <h3>{{ message }}</h3>
      </div>
      <div class="videos-container">
        <div
          class="video-block iniciator"
          :class="{ 'small-video': callInfo?.status == 'inProgress' }"
        >
          <div class="no-video" v-if="!localStream || !videoEnabled">
            <div class="profile-photo-block">
              <img
                v-if="getSelf?.profilePhotoURL"
                :src="getOwnProfilePhotoUrl"
                alt="Initiator photo"
              />
              <div v-else class="no-photo-circle">
                {{ ownUsernameFirstLetter }}
              </div>
            </div>
            <h3>{{ getSelf?.username }}</h3>
          </div>

          <video
            v-if="localStream"
            ref="localVideo"
            id="local"
            class="video-player"
            autoplay
            playsinline
          />
        </div>
        <div
          class="video-block recipient main-video"
          v-if="callInfo?.status == 'inProgress'"
        >
          <div class="no-video" v-if="!remoteStream">
            <div class="profile-photo-block">
              <img
                v-if="getSecondUser?.profilePhotoURL"
                :src="getsecondUserProfilePhotoUrl"
                alt="Recipient photo"
              />
              <div v-else class="no-photo-circle">
                {{ secondUserUsernameFirstLetter }}
              </div>
            </div>

            <h3>{{ getSecondUser?.username }}</h3>
          </div>

          <video
            v-if="remoteStream"
            ref="remoteVideo"
            id="remote"
            class="video-player"
            autoplay
            playsinline
          />
        </div>
      </div>
    </div>
    <div class="controls">
      <CallControllButton
        class="media-btn"
        @click="toggleAudioEnabled"
        :class="{ disabled: !audioEnabled }"
      >
        <img src="../assets/icons/microphone.png" alt="toggle microphone" />
      </CallControllButton>
      <CallControllButton
        class="media-btn"
        @click="toggleVideoEnabled"
        :class="{ disabled: !videoEnabled }"
      >
        <img src="../assets/icons/video-camera.png" alt="toggle video" />
      </CallControllButton>
      <CallControllButton class="call-end" @click="handleEndCallClick">
        <img src="../assets/icons/phone-call.png" alt="end call" />
      </CallControllButton>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isNumberWithoutDecimal } from "@/utils/isNumber";
import CallControllButton from "../components/Buttons/CallControllButton.vue";

export default {
  components: { CallControllButton },
  name: "CallView",
  data() {
    return {
      chatId: null,
      message: "",
      callInfo: null,
      callingTimeout: null,
      localStream: null,
      remoteStream: null,
      videoEnabled: true,
      audioEnabled: true,
      peerConnection: null,
      stunServers: {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      },
      constraints: {
        video: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: {
            min: 480,
            ideal: 1080,
            max: 1080,
          },
        },
        audio: true,
      },
    };
  },
  computed: {
    ...mapGetters(["getWS", "getPayload", "getWsMessage"]),
    getSelf() {
      return this.callInfo?.recipient.userId == this.getPayload.userId
        ? this.callInfo?.recipient
        : this.callInfo?.initiator;
    },
    getSecondUser() {
      return this.callInfo?.recipient.userId != this.getPayload.userId
        ? this.callInfo?.recipient
        : this.callInfo?.initiator;
    },
    ownUsernameFirstLetter() {
      return this.getSelf?.username[0]?.toUpperCase();
    },
    secondUserUsernameFirstLetter() {
      return this.getSecondUser?.username[0]?.toUpperCase();
    },
    getOwnProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.getSelf?.profilePhotoURL}`;
    },
    getsecondUserProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.getSecondUser?.profilePhotoURL}`;
    },
    eventHandlers() {
      return {
        error: () => {
          this.$router.push("/505");
        },
        noChatFound: () => {
          this.redirectToChats();
        },
        callEnded: () => {
          this.callEndedLogic();
        },
        callRejected: () => {
          this.callRejectedLogic();
        },
        recipientAnswered: async () => {
          await this.onRecipientAnswer();
        },
        callDetails: () => {
          this.setCallInfo();
        },
        dialing: async () => {
          await this.dialingLogic();
        },

        offerCreated: async () => {
          await this.onOfferCreated();
        },
        answerCreated: async () => {
          await this.addAnswer();
        },
        newIceCandidate: async () => {
          await this.addIceCandidate();
        },
        connectedToCall: async () => {
          await this.onCallConnect();
        },
      };
    },
  },
  methods: {
    ...mapActions(["sendWsMessage"]),
    isNumberWithoutDecimal,

    async init() {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(
          this.constraints
        );
        this.$nextTick(() => {
          this.$refs.localVideo.srcObject = this.localStream;
        });
      } catch (err) {
        console.log(err);
        await this.endCall();
        alert("Can't get your camera! You will be redirected immediately!");
        this.redirectToChats();
      }
    },
    async createPeerConnection() {
      this.peerConnection = new RTCPeerConnection(this.stunServers);
      this.remoteStream = new MediaStream();
      this.$nextTick(() => {
        this.$refs.remoteVideo.srcObject = this.remoteStream;
      });

      if (!this.localStream) await this.init();

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
        });
      };

      this.peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          // add
          setTimeout(async () => {
            await this.sendWsMessage({
              event: "iceCandidate",
              data: { candidate: event.candidate, chatId: this.chatId },
            });
          }, 100);
        }
      };
    },

    async createOffer() {
      await this.createPeerConnection();

      let offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    },

    async createAnswer() {
      await this.createPeerConnection();
      if (this.localStream) {
        this.toggleVideoEnabled();
        this.toggleAudioEnabled();
      }
      const offer = this.getWsMessage.data.offer;
      await this.peerConnection.setRemoteDescription(offer);
      let answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      await this.sendWsMessage({
        event: "callAnswer",
        data: { answer, chatId: this.chatId },
      });
    },

    async onOfferCreated() {
      await this.createAnswer();
    },

    async addAnswer() {
      const answer = this.getWsMessage.data.answer;
      if (!this.peerConnection.currentRemoteDescription) {
        this.peerConnection.setRemoteDescription(answer);
      }
    },
    async addIceCandidate() {
      const candidate = this.getWsMessage.data.candidate;
      if (this.peerConnection.currentRemoteDescription) {
        this.peerConnection.addIceCandidate(candidate);
      }
    },
    stopStream(videoStream) {
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    },
    toggleVideoEnabled() {
      this.videoEnabled = !this.videoEnabled;
      if (this.localStream) {
        let videoTrack = this.localStream
          .getTracks()
          .find((track) => track.kind === "video");

        videoTrack.enabled = this.videoEnabled;
      }
    },
    toggleAudioEnabled() {
      this.audioEnabled = !this.audioEnabled;
      if (this.localStream) {
        let audioTrack = this.localStream
          .getTracks()
          .find((track) => track.kind === "audio");

        if (audioTrack) audioTrack.enabled = this.audioEnabled;
      }
    },
    callTimeOuted() {
      this.message =
        "Calling time out! You will be redirected to chats page in 5!";
      const timeoutId = setTimeout(() => {
        this.$router.push("/chats");
      }, 5 * 1000);
      this.setCallingTimeout(timeoutId);
    },
    setCallingTimeout(newTimeout) {
      clearTimeout(this.callingTimeout);
      this.callingTimeout = newTimeout;
    },
    async onRecipientAnswer() {
      clearTimeout(this.callingTimeout);
      this.changeCallStatus();
      const offer = await this.createOffer();
      this.message = "";
      await this.sendWsMessage({
        event: "callOffer",
        data: { offer, chatId: this.chatId },
      });
    },
    async onCallConnect() {
      this.setCallInfo();
      await this.init();
    },
    async dialingLogic() {
      await this.init();
      this.setCallInfo();
      this.message = `Calling ${this.getSecondUser?.username}`;
      const timeoutId = setTimeout(this.callTimeOuted, 60 * 1000);
      this.setCallingTimeout(timeoutId);
    },
    setCallInfo() {
      this.callInfo = this.getWsMessage.data.call;
    },
    changeCallStatus() {
      if (this.callInfo) {
        this.callInfo.status = this.getWsMessage.data.status;
      }
    },
    callRejectedLogic() {
      this.changeCallStatus();
      this.stopStreams();
      this.message = "Call rejected! You will be redirected in 5 seconds!";
      const timeoutId = setTimeout(() => {
        this.redirectToChats();
      }, 5 * 1000);
      this.setCallingTimeout(timeoutId);
    },
    callEndedLogic() {
      if (this.chatId == this.getWsMessage.data.chatId) {
        this.changeCallStatus();
        this.message = "Call ended! You will be redirected in 5 seconds!";
        this.stopStreams();
        const timeoutId = setTimeout(() => {
          this.redirectToChats();
        }, 5 * 1000);
        this.setCallingTimeout(timeoutId);
      }
    },
    stopStreams() {
      this.stopStream(this.localStream);
      this.stopStream(this.remoteStream);
      this.localStream = null;
      this.remoteStream = null;
    },
    async endCall() {
      if (this.callInfo && this.chatId) {
        this.stopStreams();
        await this.sendWsMessage({
          event: "endCall",
          data: { chatId: this.chatId },
        });
      }
    },
    redirectToChats() {
      this.stopStreams();
      this.$router.push("/chats");
    },

    async handleEndCallClick() {
      await this.endCall();
      clearTimeout(this.callingTimeout);
      this.redirectToChats();
    },

    async handleRouteEnter() {
      const chatId = this.$route.query.chatId;
      if (this.isNumberWithoutDecimal(chatId)) {
        await this.sendWsMessage({
          event: "callEnter",
          data: { chatId },
        });
        this.chatId = +chatId;
      } else this.redirectToChats();
    },

    async handleRouteUpdate() {
      clearTimeout(this.callingTimeout);
      await this.handleRouteEnter();
      this.peerConnection = null;
      this.audioEnabled = true;
      this.videoEnabled = true;
      this.stopStreams();
      this.message = null;
    },

    async handleWsEvent(event) {
      const eventName = event;
      if (Object.prototype.hasOwnProperty.call(this.eventHandlers, eventName)) {
        await this.eventHandlers[eventName]();
      }
    },
  },

  async beforeRouteUpdate(to) {
    if (this.chatId != to.query.chatId) {
      await this.endCall();
    }
  },

  async beforeRouteLeave() {
    await this.endCall();
  },

  watch: {
    async $route() {
      await this.handleRouteUpdate();
    },
    async getWsMessage() {
      await this.handleWsEvent(this.getWsMessage.event);
    },
  },

  async mounted() {
    await this.handleRouteEnter();
    if (this.chatId) window.addEventListener("beforeunload", this.endCall);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.endCall);
    this.stopStream();
  },
};
</script>

<style lang="scss">
.call-view {
  background-color: #3d3b3b;
  height: calc(100vh - var(--navbar-height) - var(--messages-block-height));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 0;

  .view-block {
    position: relative;
    flex: 1;
    overflow: hidden;
    .videos-container {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .video-block {
        position: relative;
        background-color: grey;
        border-radius: 20px;
        margin: 1rem;
        overflow: hidden;
        max-height: 90%;
        aspect-ratio: 16/9;
        .video-player {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
        &.small-video {
          position: absolute;
          top: 2rem;
          left: 2rem;
          width: 250px;
          background-color: #201f1f;
          z-index: 1;
          .no-video {
            max-height: 100%;
            width: 45%;
            gap: 0.2rem;
            .profile-photo-block .no-photo-circle {
              font-size: 2em;
            }
          }
        }
        .no-video {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          overflow: hidden;
          max-height: 60%;
          width: 40%;
          aspect-ratio: 1/1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--light-grey-color);
          .profile-photo-block {
            overflow: hidden;
            flex: 1;
            aspect-ratio: 1/1;
            border-radius: 50%;
            background-color: #464646;
            img,
            .no-photo-circle {
              height: 100%;
              width: 100%;
            }
            img {
              object-fit: cover;
            }
            .no-photo-circle {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 3em;
            }
          }
        }
      }
    }
    .call-message-container {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: rgb(224, 210, 210);
      background: rgba(0, 0, 0, 0.488);
      backdrop-filter: blur(10px);
      z-index: 20;
    }
  }
  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    .coll-controll-btn {
      img {
        filter: invert(0.1);
      }
      &.media-btn:hover,
      &.media-btn:focus-visible {
        background-color: var(--light-white-color);
        box-shadow: 0 0 15px #b8b7b7;
      }
    }
  }
}
</style>
