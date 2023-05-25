<template>
  <div class="image-container">
    <img v-if="imageUrl" :src="getProfilePhotoUrl" alt="User avatar" />
    <div class="upload-container">
      <label for="file-upload" class="upload-label">
        <span>Upload image</span>
      </label>
      <input id="file-upload" type="file" @change="handleImageUpload" />
    </div>
    <button v-if="imageFile" class="update-button" @click="handleImageUpdate">
      Update image
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    imageUrl: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      imageFile: null,
    };
  },
  computed: {
    getProfilePhotoUrl() {
      return `${process.env.VUE_APP_SERVER_URL}/static/images/${this.imageUrl}`;
    },
  },
  methods: {
    ...mapActions(["updateProfilePhoto"]),
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async handleImageUpdate() {
      const formData = new FormData();
      formData.append("image", this.imageFile);
      const result = await this.updateProfilePhoto(formData);
      if (result?.success) {
        const newImageUrl = result.profilePhotoURL;
        this.imageFile = null;
        this.$emit("imageUpdated", newImageUrl);
      }
    },
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 150px;
  height: 150px;
}

input {
  display: none;
}

.upload-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f072;
  border: 1px dashed #ccc;
}

.upload-label {
  cursor: pointer;
  padding: 10px;
}

.upload-label span {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.update-button {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>
