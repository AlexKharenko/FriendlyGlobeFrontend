<template>
  <div class="users-search">
    <h2>Find your friend</h2>
    <div class="filters-container">
      <h3>Filters:</h3>
      <form @submit.prevent="onSubmit">
        <div class="filter-list">
          <FormInput
            title="Search"
            placeholder="Find user by username"
            v-model.trim="filters.search"
          />
          <FormInput
            title="Min age"
            placeholder="Min age"
            v-model.trim="filters.minAge"
          >
            <MinAgeError :v="v.filters.minAge" />
            <MinMaxValueError :v="v.filters.minAge" :min="12" :max="120" />
          </FormInput>
          <FormInput
            title="Max age"
            placeholder="Max age"
            v-model.trim="filters.maxAge"
          >
            <MaxAgeError :v="v.filters.maxAge" />
            <MinMaxValueError :v="v.filters.maxAge" :min="12" :max="120" />
          </FormInput>
          <FormInputSlot title="Languages">
            <template #input>
              <VueMultiselect
                v-model="languages"
                placeholder="Search languages"
                label="language"
                track-by="languageId"
                :options="getLanguagesList"
                :multiple="true"
              />
            </template>
          </FormInputSlot>
          <FormInputSlot title="Hobbies">
            <template #input>
              <VueMultiselect
                v-model="hobbies"
                placeholder="Search hobbies"
                label="hobby"
                track-by="hobbyId"
                :options="getHobbiesList"
                :multiple="true"
              />
            </template>
          </FormInputSlot>
          <FormInputSlot title="Countries">
            <template #input>
              <VueMultiselect
                v-model="countries"
                placeholder="Search countries"
                label="countryName"
                track-by="countryId"
                :options="getCountriesList"
                :multiple="true"
              />
            </template>
          </FormInputSlot>
          <FormInputSlot title="Sex:">
            <template #input>
              <VueMultiselect
                v-model="sex"
                :options="getFilterSexList"
                :close-on-select="true"
                :clear-on-select="false"
                placeholder="Select"
                :searchable="false"
                :allow-empty="false"
                label="title"
                track-by="title"
                selectLabel=" "
                deselectLabel=" "
              />
            </template>
          </FormInputSlot>
          <FormInputSlot title="Order by date:">
            <template #input>
              <VueMultiselect
                v-model="orderBy"
                :options="getOrderByList"
                :close-on-select="true"
                :clear-on-select="false"
                placeholder="Select"
                :searchable="false"
                :allow-empty="false"
                label="title"
                track-by="title"
                selectLabel=" "
                deselectLabel=" "
              />
            </template>
          </FormInputSlot>
        </div>
        <CustomButton btnType="submit">Filter</CustomButton>
      </form>
    </div>
    <div class="users-list users-grid" v-if="users.length > 0">
      <UserListItem v-for="user in users" :key="user.userId" :user="user" />
    </div>
    <div class="users-list users-grid" v-if="users.length == 0">
      <h3>No users found</h3>
    </div>
    <PaginationList
      v-if="totalPages > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="changePage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import useVuelidate from "@vuelidate/core";
import { minValue, maxValue } from "@vuelidate/validators";

import FormInputSlot from "@/components/Inputs/FormInputSlot.vue";
import FormInput from "@/components/Inputs/FormInput.vue";
import VueMultiselect from "vue-multiselect";
import CustomButton from "@/components/Buttons/CustomButton.vue";
import PaginationList from "@/components/PaginationList.vue";
import MinMaxValueError from "@/components/InputErrors/MinMaxValueError.vue";
import MaxAgeError from "@/components/InputErrors/MaxAgeError.vue";
import MinAgeError from "@/components/InputErrors/MinAgeError.vue";
import UserListItem from "../components/ListItems/UserListItem.vue";

export default {
  name: "UsersSearch",
  components: {
    FormInputSlot,
    VueMultiselect,
    FormInput,
    CustomButton,
    PaginationList,
    MinMaxValueError,
    MaxAgeError,
    MinAgeError,
    UserListItem,
  },

  setup() {
    return { v: useVuelidate() };
  },
  data() {
    return {
      users: [],
      currentPage: 1,
      usersCount: 0,
      itemsPerPage: 10,
      orderBy: "",
      sex: "",
      countries: [],
      languages: [],
      hobbies: [],
      filters: {
        search: "",
        minAge: "",
        maxAge: "",
        countries: [],
        languages: [],
        hobbies: [],
        orderBy: "",
        sex: "",
      },
    };
  },
  validations() {
    return {
      filters: {
        minAge: {
          minValue: minValue(12),
          maxValue: maxValue(120),
          maxAge: function (value) {
            if (this.filters.maxAge == "" || value == "") {
              return true;
            }
            return value <= this.filters.maxAge;
          },
        },
        maxAge: {
          minValue: minValue(12),
          maxValue: maxValue(120),
          minAge: function (value) {
            if (this.filters.minAge == "" || value == "") {
              return true;
            }
            return value >= this.filters.minAge;
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      "getHobbiesList",
      "getLanguagesList",
      "getCountriesList",
      "getOrderByList",
      "getFilterSexList",
    ]),
    totalPages() {
      return Math.ceil(this.usersCount / this.itemsPerPage);
    },
  },
  methods: {
    ...mapActions(["getUsers", "getCHLLists"]),
    async changePage(pageNumber) {
      this.currentPage = pageNumber;
      const { users, count: usersCount } = await this.getUsers({
        ...this.filters,
        page: this.currentPage,
      });
      this.users = users;
      this.usersCount = usersCount;
    },
    async onSubmit() {
      this.v.$touch();
      if (this.v.$error) return;
      this.currentPage = 1;
      const { users, count: usersCount } = await this.getUsers({
        ...this.filters,
        page: this.currentPage,
      });
      this.users = users;
      this.usersCount = usersCount;
    },
  },
  watch: {
    languages() {
      this.filters.languages = this.languages.map((item) => item.languageId);
    },
    hobbies() {
      this.filters.hobbies = this.hobbies.map((item) => item.hobbyId);
    },
    countries() {
      this.filters.countries = this.countries.map((item) => item.countryId);
    },
    orderBy() {
      this.filters.orderBy = this.orderBy.value;
    },
    sex() {
      this.filters.sex = this.sex.value;
    },
  },
  async mounted() {
    this.orderBy = await this.getOrderByList[0];
    this.sex = await this.getFilterSexList[0];
    const { users, count: usersCount } = await this.getUsers({
      ...this.filters,
      page: this.currentPage,
    });
    this.users = users;
    this.usersCount = usersCount;
    await this.getCHLLists();
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.users-search {
  display: flex;
  flex-direction: column;
  .filters-container {
    margin: 1rem 0;
    form {
      .filter-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem 1rem;
      }
      button {
        margin: 1rem 0;
      }
    }
    border-bottom: solid 2px black;
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
    gap: 0.5rem 1rem;
    margin-bottom: 1rem;
    justify-content: center;
  }
  .pagination {
    margin-top: auto;
  }
}
</style>
