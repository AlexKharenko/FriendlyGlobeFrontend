<template>
  <div class="signin">
    <div class="card-box">
      <div class="header">
        <h1>Sign In</h1>
        <span class="error-msg" v-if="getErrorMessage">
          {{ getErrorMessage }}
        </span>
      </div>
      <form @submit.prevent="onSubmit" autocomplete="on">
        <div class="form-inputs-container">
          <FormInput
            title="Email"
            inputName="email"
            v-model.trim="signInData.email"
          >
            <RequiredError :v="v.signInData.email" />
            <EmailError :v="v.signInData.email" />
          </FormInput>
          <FormInput
            title="Password"
            inputName="password"
            v-model.trim="signInData.password"
            :isPassword="!showPassword"
          >
            <RequiredError :v="v.signInData.password" />
            <MinMaxError :v="v.signInData.password" :min="6" :max="18" />
          </FormInput>
          <ShowPassword v-model="showPassword" />
        </div>

        <CustomButton btnType="submit">Sign In</CustomButton>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import useVuelidate from "@vuelidate/core";
import { required, email, maxLength, minLength } from "@vuelidate/validators";

import FormInput from "../../components/Inputs/FormInput.vue";
import RequiredError from "../../components/InputErrors/RequiredError.vue";
import MinMaxError from "@/components/InputErrors/MinMaxError.vue";
import EmailError from "../../components/InputErrors/EmailError.vue";
import ShowPassword from "../../components/Inputs/ShowPassword.vue";
import CustomButton from "../../components/Buttons/CustomButton.vue";

export default {
  name: "SignInView",
  components: {
    FormInput,
    RequiredError,
    EmailError,
    ShowPassword,
    MinMaxError,
    CustomButton,
  },
  setup() {
    return { v: useVuelidate() };
  },
  data() {
    return {
      signInData: {
        email: "",
        password: "",
      },
      showPassword: false,
      inputErrors: [],
    };
  },
  validations() {
    return {
      signInData: {
        email: { required, email },
        password: {
          required,
          maxLength: maxLength(18),
          minLength: minLength(6),
        },
      },
    };
  },
  computed: { ...mapGetters(["getErrorMessage"]) },
  methods: {
    ...mapActions(["signIn"]),
    async onSubmit() {
      this.v.$touch();
      if (this.v.$error) {
        return 0;
      }
      const result = await this.signIn(this.signInData);

      if (this.getErrorMessage) return;

      this.$router.push(`/users/${result.user.username}`);
    },
  },
  watch: {
    "this.store.getters.isAuthenticated"() {
      if (this.$store.getters.isAuthenticated) this.$router.push("/");
    },
  },
  mounted() {
    if (this.$store.getters.isAuthenticated) this.$router.push("/");
  },
};
</script>

<style lang="scss">
.signin {
  position: relative;
  padding: 1rem 1rem;
  .card-box {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: minmax(auto, 400px);
    gap: 2rem;
    // background: rgb(215, 208, 208);
    background: var(--ocean-color-half-transperent);
    padding: 2rem;
    border-radius: 1rem;
    .header {
      display: grid;
      gap: 0.5rem;
    }
    form {
      display: grid;
      gap: 1.5rem;
      .form-inputs-container {
        width: 100%;
        display: grid;
        gap: 0.5rem;
      }
    }
  }
}
@media screen and (max-width: 550px) {
  .signin {
    .card-box {
      right: 10%;
      padding: 2rem 1rem;
    }
  }
}
</style>
