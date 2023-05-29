<template>
  <div class="update-profile">
    <section>
      <h2>Options</h2>
      <div class="user-settings">
        <div class="mode">
          Hidden mode:
          <ToggleButton v-model="hidden" />
        </div>
        <div class="mode">
          <router-link to="/profile/blacklist">Blacklist</router-link>
        </div>
      </div>
    </section>
    <section>
      <div class="upload-photo">
        <UploadImage
          :imageUrl="profilePhotoURL"
          @imageUpdated="updateProfilePhoto"
        />
        <RemoveButton v-if="profilePhotoURL" @click="removeProfilePhoto" />
      </div>
    </section>
    <section>
      <div class="user-data">
        <div class="header">
          <h2>Update</h2>
          <p>
            If you update your account information, your account will be flagged
            for verification. During the verification process, your account may
            be limited in some way.
          </p>
          <span class="error-msg" v-if="getErrorMessage">
            {{ getErrorMessage }}
          </span>
        </div>
        <form @submit.prevent="updateUserSubmit" autocomplete="on">
          <section class="short-personal-info">
            <h3>Short personal info</h3>
            <div class="inputs-container">
              <FormInput title="First Name" v-model.trim="updateData.firstName">
                <RequiredError :v="v.updateData.firstName" />
                <MinMaxError :v="v.updateData.firstName" :min="2" :max="15" />
              </FormInput>
              <FormInput
                title="Second Name"
                v-model.trim="updateData.secondName"
              >
                <RequiredError :v="v.updateData.secondName" />
                <MinMaxError :v="v.updateData.secondName" :min="2" :max="15" />
              </FormInput>
              <FormInputSlot title="Birthday">
                <template #input>
                  <input
                    class="input"
                    type="date"
                    v-model="updateData.birthdayDate"
                    :min="minDate"
                    :max="maxDate"
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.updateData.birthdayDate" />
                </template>
              </FormInputSlot>
              <FormInputSlot title="Sex">
                <template #input>
                  <VueMultiselect
                    v-model="sex"
                    :options="getSexList"
                    :close-on-select="true"
                    :clear-on-select="false"
                    placeholder="Select"
                    label="title"
                    track-by="id"
                    :allow-empty="false"
                    selectLabel=" "
                    deselectLabel=" "
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.sex" />
                </template>
              </FormInputSlot>
              <FormInputSlot title="Country">
                <template #input>
                  <VueMultiselect
                    v-model="updateData.country"
                    :options="getCountriesList"
                    :close-on-select="true"
                    :clear-on-select="false"
                    placeholder="Select your country"
                    label="countryName"
                    track-by="countryId"
                    :allow-empty="false"
                    selectLabel=" "
                    deselectLabel=" "
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.updateData.country" />
                </template>
              </FormInputSlot>
            </div>
          </section>
          <section class="user-description">
            <h3>About you</h3>
            <p class="section-description">
              In this section you should write information about you and what
              are you loking for on this website. (The second is optional)
            </p>
            <div class="inputs-container">
              <FormInputSlot title="Bio">
                <template #input>
                  <textarea
                    v-model="updateData.bio"
                    :maxlength="1000"
                    placeholder="Type something about you (at least 100 symbols)"
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.updateData.bio" />
                  <MinMaxError :v="v.updateData.bio" :min="100" :max="1000" />
                </template>
              </FormInputSlot>
              <FormInputSlot title="What are you looking for?">
                <template #input>
                  <textarea
                    v-model="updateData.lookingForText"
                    :maxlength="1000"
                    placeholder="Your expectations (at least 100 symbols)"
                  />
                </template>
                <template #error>
                  <MinMaxError
                    :v="v.updateData.lookingForText"
                    :min="100"
                    :max="1000"
                  />
                </template>
              </FormInputSlot>
            </div>
          </section>
          <section class="user-languages">
            <h3>Languages</h3>
            <p class="section-description">
              Choose languages you are interested in (at least 1)
            </p>
            <div class="inputs-container">
              <FormInputSlot title="Hobbies and interests">
                <template #input>
                  <VueMultiselect
                    v-model="updateData.languages"
                    placeholder="Search language"
                    label="language"
                    track-by="languageId"
                    :options="getLanguagesList"
                    :multiple="true"
                    :allow-empty="false"
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.updateData.languages" />
                </template>
              </FormInputSlot>
            </div>
          </section>
          <section class="user-hobbies">
            <h3>Hobbies and interest</h3>
            <p class="section-description">
              Choose your favourite hobbies and interests (at least 1)
            </p>
            <div class="inputs-container">
              <FormInputSlot title="Hobbies and interests">
                <template #input>
                  <VueMultiselect
                    v-model="updateData.hobbies"
                    placeholder="Search hobby/interest"
                    label="hobby"
                    track-by="hobbyId"
                    :options="getHobbiesList"
                    :multiple="true"
                    :allow-empty="false"
                  />
                </template>
                <template #error>
                  <RequiredError :v="v.updateData.hobbies" />
                </template>
              </FormInputSlot>
            </div>
          </section>
          <section class="user-passwords"></section>
          <CustomButton btnType="submit">Update</CustomButton>
        </form>
        <form @submit.prevent="updateUserPasswordSubmit" autocomplete="on">
          <section class="user-passwords">
            <h2>Update password</h2>
            <div class="inputs-container">
              <FormInput
                title="Password"
                v-model.trim="updatePasswrod.password"
                :isPassword="!showPassword"
              >
                <RequiredError :v="v.updatePasswrod.password" />
                <MinMaxError
                  :v="v.updatePasswrod.password"
                  :min="6"
                  :max="18"
                />
              </FormInput>
              <FormInput
                title="Password confirmation"
                v-model="passwordConfirm"
                :isPassword="!showPassword"
              >
                <SameAsError
                  :v="v.passwordConfirm"
                  text="Passwords have to be the same"
                />
              </FormInput>
            </div>
            <ShowPassword v-model="showPassword" />
          </section>
          <CustomButton btnType="submit">Change Password</CustomButton>
        </form>
      </div>
    </section>
    <section class="delete-user">
      <h2>Delete account</h2>
      <DeleteMaxButton @click="deleteProfile" />
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, sameAs } from "@vuelidate/validators";

import FormInput from "../../components/Inputs/FormInput.vue";
import FormInputSlot from "../../components/Inputs/FormInputSlot.vue";
import RequiredError from "../../components/InputErrors/RequiredError.vue";
import SameAsError from "../../components/InputErrors/SameAsError.vue";
import MinMaxError from "../../components/InputErrors/MinMaxError.vue";
import ShowPassword from "../../components/Inputs/ShowPassword.vue";
import CustomButton from "../../components/Buttons/CustomButton.vue";
import VueMultiselect from "vue-multiselect";
import ToggleButton from "../../components/Buttons/ToggleButton.vue";
import DeleteMaxButton from "../../components/Buttons/DeleteMaxButton.vue";
import UploadImage from "../../components/UploadImage.vue";
import RemoveButton from "../../components/Buttons/RemoveButton.vue";

export default {
  name: "UpdateProfile",
  components: {
    FormInput,
    FormInputSlot,
    RequiredError,
    SameAsError,
    MinMaxError,
    ShowPassword,
    CustomButton,
    VueMultiselect,
    ToggleButton,
    DeleteMaxButton,
    UploadImage,
    RemoveButton,
  },
  setup() {
    return { v: useVuelidate() };
  },
  data() {
    return {
      updateData: {
        firstName: "",
        secondName: "",
        sexId: null,
        birthdayDate: null,
        country: null,
        languages: [],
        hobbies: [],
        bio: "",
        lookingForText: "",
      },
      updatePasswrod: {
        password: "",
      },
      profilePhotoURL: null,
      sex: null,
      hidden: false,
      passwordConfirm: "",
      showPassword: false,
    };
  },
  validations() {
    return {
      updateData: {
        firstName: {
          required,
          maxLength: maxLength(15),
          minLength: minLength(2),
        },
        secondName: {
          required,
          maxLength: maxLength(15),
          minLength: minLength(2),
        },
        birthdayDate: { required },
        country: { required },
        bio: {
          required,
          maxLength: maxLength(1000),
          minLength: minLength(100),
        },
        lookingForText: {
          maxLength: maxLength(1000),
          minLength: minLength(100),
        },
        languages: { required },
        hobbies: { required },
      },
      updatePasswrod: {
        password: {
          required,
          maxLength: maxLength(18),
          minLength: minLength(6),
        },
      },
      sex: { required },
      passwordConfirm: { sameAs: sameAs(this.updatePasswrod.password) },
    };
  },
  computed: {
    ...mapGetters([
      "getErrorMessage",
      "getSexList",
      "getCountriesList",
      "getHobbiesList",
      "getLanguagesList",
    ]),
    maxDate() {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 12);
      return today.toISOString().slice(0, 10);
    },
    minDate() {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 120);
      return today.toISOString().slice(0, 10);
    },
  },
  methods: {
    ...mapActions([
      "deleteUser",
      "updateUser",
      "getProfile",
      "getCHLLists",
      "updateUserHidden",
      "updateUserPassword",
      "deleteProfilePhoto",
    ]),
    async updateUserPasswordSubmit() {
      this.v.updatePasswrod.$touch();
      this.v.passwordConfirm.$touch();
      if (this.v.updatePasswrod.$error && this.v.passwordConfirm.$error) {
        return 0;
      }
      const { success } = await this.updateUserPassword(this.updatePasswrod);

      if (this.getErrorMessage)
        return window.scroll({ top: 0, behavior: "smooth" });

      if (success) {
        alert("Password updated succesfully");
        this.v.updatePasswrod.$reset();
        this.v.passwordConfirm.$reset();
        this.updatePasswrod.password = "";
        this.passwordConfirm = "";
      }
    },
    async updateUserSubmit() {
      this.v.updateData.$touch();
      if (this.v.updateData.$error) {
        return 0;
      }
      const { success } = await this.updateUser(this.updateData);

      if (this.getErrorMessage)
        return window.scroll({ top: 0, behavior: "smooth" });

      if (success) alert("Information updated succesfully");
    },
    async removeProfilePhoto() {
      if (this.profilePhotoURL) {
        await this.deleteProfilePhoto();
        this.profilePhotoURL = null;
      }
    },
    async deleteProfile() {
      const confirmationResult = confirm(
        "Do you want to delete your account? It will remove all data!"
      );

      if (confirmationResult) await this.deleteUser();
    },
    updateProfilePhoto(imageUrl) {
      this.profilePhotoURL = imageUrl;
    },
    fillUpdateData(user) {
      this.updateData = {
        firstName: user.firstName,
        secondName: user.secondName,
        sexId: user.sexId,
        birthdayDate: new Date(user.birthdayDate).toISOString().split("T")[0],
        country: user.country,
        languages: user.languages,
        hobbies: user.hobbies,
        bio: user.userDetails.bio,
        lookingForText: user.userDetails.lookingForText,
      };
      this.profilePhotoURL = user.profilePhotoURL;
      this.sex = this.getSexList.find((sex) => sex.id == user.sexId);
      this.hidden = user.hidden;
    },
  },
  watch: {
    sex() {
      this.updateData.sexId = this.sex.id;
    },
    async hidden() {
      await this.updateUserHidden({ hidden: this.hidden });
    },
  },
  async mounted() {
    if (
      this.getCountriesList.length == 0 ||
      this.getHobbiesList.length == 0 ||
      this.getLanguagesList.length == 0
    )
      await this.getCHLLists();
    this.$data.updateData.sex = this.getSexList[0];
    const { user, success } = await this.getProfile();
    if (!success) this.$router.push("/");
    this.fillUpdateData(user);
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.update-profile {
  position: relative;
  padding: 1rem 1rem;
  display: grid;
  gap: 1rem;
  .user-settings {
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    .mode {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }
  }
  .upload-photo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .delete-user {
    margin-bottom: 2rem;
    h2 {
      margin-bottom: 0.5rem;
    }
  }
  .user-data {
    display: grid;
    gap: 1rem;
    form {
      display: grid;
      gap: 1rem;
      .short-personal-info,
      .user-description,
      .user-languages,
      .user-hobbies,
      .user-passwords {
        h3,
        h2 {
          margin-bottom: 0.5rem;
        }
        .section-description {
          font-size: 0.9em;
          color: var(--grey-color);
          margin-bottom: 1rem;
        }
        .inputs-container {
          display: grid;
        }
      }
      .show-password {
        margin-top: 1rem;
      }
      .short-personal-info,
      .user-passwords {
        .inputs-container {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem 1rem;
        }
      }
      .short-personal-info {
        .inputs-container {
          .input-block:nth-child(5) {
            grid-column: 1 / -1;
          }
        }
      }

      .user-credentials,
      .user-description,
      .user-passwords {
        .inputs-container {
          gap: 0.5rem;
        }
      }
      .form-inputs-container {
        width: 100%;
        display: grid;
        gap: 0.5rem;
      }
    }
  }
}
@media screen and (max-width: 600px) {
  .update-profile {
    .user-data {
      form {
        .short-personal-info,
        .user-passwords {
          .inputs-container {
            grid-template-columns: 1fr;
            gap: 0.5rem 1rem;
          }
        }
      }
    }
  }
}
</style>
