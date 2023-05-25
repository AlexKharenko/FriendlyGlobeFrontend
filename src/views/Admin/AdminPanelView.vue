<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>
    <div class="filters-container">
      <h3>Filters:</h3>
      <form @submit.prevent="onSubmit">
        <div class="filter-list">
          <FormInput
            title="Search"
            placeholder="Search by username, email"
            v-model.trim="filters.search"
          />
          <FormInputSlot title="Verified">
            <template #input>
              <VueMultiselect
                v-model="verified"
                :options="verifiedList"
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
          <FormInputSlot title="Blocked">
            <template #input>
              <VueMultiselect
                v-model="blocked"
                :options="blockedList"
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
          <FormInputSlot title="Order by created date:">
            <template #input>
              <VueMultiselect
                v-model="filters.orderBy"
                :options="orderByList"
                :close-on-select="true"
                :clear-on-select="false"
                placeholder="Select"
                :searchable="false"
                :allow-empty="false"
                selectLabel=" "
                deselectLabel=" "
              />
            </template>
          </FormInputSlot>
        </div>
        <CustomButton btnType="submit">Filter</CustomButton>
      </form>
    </div>
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Block message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="users.length > 0">
            <TableIUserAdminItem
              v-for="user in users"
              :key="user.userId"
              :user="user"
              @onUnblock="saveChanges"
              @onVerify="saveChanges"
            />
          </template>
          <template v-else>
            <tr>
              <td colspan="7">No users found</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <PaginationList
      v-if="totalPages > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="changePage"
    />
    <BlockUserModal @onSuccess="saveChanges" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BlockUserModal from "@/components/Modals/BlockUserModal.vue";
import TableIUserAdminItem from "../../components/TableItems/TableIUserAdminItem.vue";
import FormInputSlot from "../../components/Inputs/FormInputSlot.vue";
import FormInput from "@/components/Inputs/FormInput.vue";
import VueMultiselect from "vue-multiselect";
import CustomButton from "../../components/Buttons/CustomButton.vue";
import PaginationList from "../../components/PaginationList.vue";

export default {
  components: {
    TableIUserAdminItem,
    BlockUserModal,
    FormInputSlot,
    VueMultiselect,
    FormInput,
    CustomButton,
    PaginationList,
  },
  name: "AdminPanel",
  data() {
    return {
      users: [],
      currentPage: 1,
      usersCount: 0,
      itemsPerPage: 10,
      orderByList: ["desc", "asc"],
      verifiedList: [
        { title: "Both", value: undefined },
        { title: "Verified", value: true },
        { title: "Unverified", value: false },
      ],
      blockedList: [
        { title: "Both", value: undefined },
        { title: "Blocked", value: true },
        { title: "Not Blocked", value: false },
      ],
      verified: {},
      blocked: {},
      filters: {
        search: "",
        verified: undefined,
        blocked: undefined,
        orderBy: "desc",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.usersCount / this.itemsPerPage);
    },
  },
  methods: {
    ...mapActions(["getAdminUsers"]),
    async changePage(pageNumber) {
      this.currentPage = pageNumber;
      const { users, count: usersCount } = await this.getAdminUsers({
        ...this.filters,
        page: this.currentPage,
      });
      this.users = users;
      this.usersCount = usersCount;
    },
    saveChanges(data) {
      const { userId, ...dataChanged } = data;
      const userIndex = this.users.findIndex((item) => item.userId === userId);
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...dataChanged,
      };
    },
    async onSubmit() {
      this.currentPage = 1;
      const { users, count: usersCount } = await this.getAdminUsers({
        ...this.filters,
        page: this.currentPage,
      });
      this.users = users;
      this.usersCount = usersCount;
    },
  },
  watch: {
    verified() {
      this.filters.verified = this.verified.value;
    },
    blocked() {
      this.filters.blocked = this.blocked.value;
    },
  },
  async mounted() {
    const { users, count: usersCount } = await this.getAdminUsers({
      ...this.filters,
      page: this.currentPage,
    });
    this.users = users;
    this.usersCount = usersCount;
    this.verified = this.verifiedList[0];
    this.blocked = this.blockedList[0];
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.admin-panel {
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

  .pagination {
    margin-top: auto;
  }

  .users-table {
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;

      th,
      td {
        padding: 0.75rem;
        text-align: left;
        vertical-align: top;
        border-top: 1px solid #dee2e6;
      }

      th {
        background-color: #f8f9fa;
        font-weight: bold;
      }

      tbody {
        tr {
          &:nth-of-type(even) {
            background-color: #f8f9fa;
          }
          td a {
            text-decoration: none;
          }

          td.buttons-block {
            display: flex;
            gap: 1rem;
            button {
              padding: 0.375rem 0.75rem;
              border-radius: 0.25rem;
              background-color: #007bff;
              color: #fff;
              border: none;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                background-color: #0069d9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
