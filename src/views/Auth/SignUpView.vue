<template>
  <div class="signup">
    <div class="card-box">
      <div class="header">
        <h1>Sign Up</h1>
        <span class="error-msg" v-if="getErrorMessage">
          {{ getErrorMessage }}
        </span>
      </div>
      <form @submit.prevent="onSubmit" autocomplete="on">
        <section class="short-personal-info">
          <h3>Short personal info</h3>
          <div class="inputs-container">
            <FormInput title="First Name" v-model.trim="signUpData.firstName">
              <RequiredError :v="v.signUpData.firstName" />
              <MinMaxError :v="v.signUpData.firstName" :min="2" :max="15" />
            </FormInput>
            <FormInput title="Second Name" v-model.trim="signUpData.secondName">
              <RequiredError :v="v.signUpData.secondName" />
              <MinMaxError :v="v.signUpData.secondName" :min="2" :max="15" />
            </FormInput>
            <FormInputSlot title="Birthday">
              <template #input>
                <input
                  class="input"
                  type="date"
                  v-model="signUpData.birthdayDate"
                  :min="minDate"
                  :max="maxDate"
                />
              </template>
              <template #error>
                <RequiredError :v="v.signUpData.birthdayDate" />
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
                  v-model="signUpData.country"
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
                <RequiredError :v="v.signUpData.country" />
              </template>
            </FormInputSlot>
          </div>
        </section>
        <section class="user-credentials">
          <h3>Credentials</h3>
          <div class="inputs-container">
            <FormInput title="Email" v-model.trim="signUpData.email">
              <RequiredError :v="v.signUpData.email" />
              <EmailError :v="v.signUpData.email" />
            </FormInput>
            <FormInput title="Username" v-model.trim="signUpData.username">
              <RequiredError :v="v.signUpData.username" />
              <MinMaxError :v="v.signUpData.username" :min="2" :max="15" />
            </FormInput>
          </div>
        </section>

        <section class="user-description">
          <h3>About you</h3>
          <p class="section-description">
            In this section you should write information about you and what are
            you loking for on this website. (The second is optional)
          </p>
          <div class="inputs-container">
            <FormInputSlot title="Bio">
              <template #input>
                <textarea
                  v-model="signUpData.bio"
                  :maxlength="1000"
                  placeholder="Type something about you (at least 100 symbols)"
                />
              </template>
              <template #error>
                <RequiredError :v="v.signUpData.bio" />
                <MinMaxError :v="v.signUpData.bio" :min="100" :max="1000" />
              </template>
            </FormInputSlot>
            <FormInputSlot title="What are you looking for?">
              <template #input>
                <textarea
                  v-model="signUpData.lookingForText"
                  :maxlength="1000"
                  placeholder="Your expectations (at least 100 symbols)"
                />
              </template>
              <template #error>
                <RequiredError :v="v.signUpData.lookingForText" />
                <MinMaxError
                  :v="v.signUpData.lookingForText"
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
                  v-model="signUpData.languages"
                  placeholder="Search language"
                  label="language"
                  track-by="languageId"
                  :options="getLanguagesList"
                  :multiple="true"
                  :allow-empty="false"
                />
              </template>
              <template #error>
                <RequiredError :v="v.signUpData.languages" />
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
                  v-model="signUpData.hobbies"
                  placeholder="Search hobby/interest"
                  label="hobby"
                  track-by="hobbyId"
                  :options="getHobbiesList"
                  :multiple="true"
                  :allow-empty="false"
                />
              </template>
              <template #error>
                <RequiredError :v="v.signUpData.hobbies" />
              </template>
            </FormInputSlot>
          </div>
        </section>
        <section class="user-passwords">
          <h3>Passwords</h3>
          <div class="inputs-container">
            <FormInput
              title="Password"
              v-model.trim="signUpData.password"
              :isPassword="!showPassword"
            >
              <RequiredError :v="v.signUpData.password" />
              <MinMaxError :v="v.signUpData.password" :min="6" :max="18" />
            </FormInput>
            <FormInput
              title="Password confirmation"
              v-model="passwordConfirm"
              :isPassword="!showPassword"
            >
              <RequiredError :v="v.passwordConfirm" />
              <SameAsError
                :v="v.passwordConfirm"
                text="Passwords have to be the same"
              />
            </FormInput>
          </div>
          <ShowPassword v-model="showPassword" />
        </section>
        <CustomButton btnType="submit">Sign Up</CustomButton>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  email,
} from "@vuelidate/validators";

import FormInput from "../../components/Inputs/FormInput.vue";
import FormInputSlot from "../../components/Inputs/FormInputSlot.vue";
import RequiredError from "../../components/InputErrors/RequiredError.vue";
import SameAsError from "../../components/InputErrors/SameAsError.vue";
import MinMaxError from "../../components/InputErrors/MinMaxError.vue";
import EmailError from "../../components/InputErrors/EmailError.vue";
import ShowPassword from "../../components/Inputs/ShowPassword.vue";
import CustomButton from "../../components/Buttons/CustomButton.vue";
import VueMultiselect from "vue-multiselect";

export default {
  name: "SignUpView",
  components: {
    FormInput,
    FormInputSlot,
    RequiredError,
    SameAsError,
    MinMaxError,
    EmailError,
    ShowPassword,
    CustomButton,
    VueMultiselect,
  },
  setup() {
    return { v: useVuelidate() };
  },
  data() {
    return {
      signUpData: {
        firstName: "",
        secondName: "",
        username: "",
        email: "",
        password: "",
        sexId: null,
        birthdayDate: null,
        country: null,
        languages: [],
        hobbies: [],
        bio: "",
        lookingForText: "",
      },
      sex: null,
      passwordConfirm: "",
      showPassword: false,
    };
  },
  validations() {
    return {
      signUpData: {
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
        username: {
          required,
          maxLength: maxLength(15),
          minLength: minLength(2),
        },
        email: { required, email },
        birthdayDate: { required },
        country: { required },
        bio: {
          required,
          maxLength: maxLength(1000),
          minLength: minLength(100),
        },
        lookingForText: {
          required,
          maxLength: maxLength(1000),
          minLength: minLength(100),
        },
        languages: { required },
        hobbies: { required },
        password: {
          required,
          maxLength: maxLength(18),
          minLength: minLength(6),
        },
      },
      sex: { required },
      passwordConfirm: { required, sameAs: sameAs(this.signUpData.password) },
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
    ...mapActions(["signUp", "getCHLLists"]),
    async onSubmit() {
      this.v.$touch();
      if (this.v.$error) {
        return 0;
      }

      await this.signUp(this.signUpData);

      if (this.getErrorMessage)
        return window.scroll({ top: 0, behavior: "smooth" });

      this.$router.push("/signin");
    },
  },
  watch: {
    sex() {
      this.signUpData.sexId = this.sex.id;
    },
  },
  async mounted() {
    if (
      this.getCountriesList.length == 0 ||
      this.getHobbiesList.length == 0 ||
      this.getLanguagesList.length == 0
    )
      await this.getCHLLists();
    this.sex = this.getSexList[0];
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.signup {
  position: relative;
  padding: 1rem 1rem;
  .card-box {
    position: relative;
    display: grid;
    grid-template-columns: minmax(auto, 500px);
    max-width: 500px;
    gap: 2rem;
    margin: 2rem 10% 1rem 10%;
    background: var(--ocean-color-half-transperent);
    padding: 2rem;
    border-radius: 1rem;
    .header {
      display: grid;
      gap: 0.5rem;
    }
    form {
      display: grid;
      gap: 1rem;
      .short-personal-info,
      .user-credentials,
      .user-description,
      .user-languages,
      .user-hobbies,
      .user-passwords {
        h3 {
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
  .signup {
    .card-box {
      padding: 2rem 1rem;

      margin: 2rem 2% 1rem 2%;
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
