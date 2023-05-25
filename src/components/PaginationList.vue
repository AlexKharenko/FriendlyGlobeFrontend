<template>
  <nav class="pagination">
    <ul>
      <li v-if="currentPage > 1">
        <a href="#" @click.prevent="changePage(currentPage - 1)">Prev</a>
      </li>
      <li v-for="pageNumber in pageNumbers" :key="pageNumber">
        <a
          href="#"
          @click.prevent="changePage(pageNumber)"
          :class="{ active: pageNumber === currentPage }"
          >{{ pageNumber }}</a
        >
      </li>
      <li v-if="currentPage < totalPages">
        <a href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pageNumbers() {
      const range = 3; // Number of pages to show before and after current page
      const start = Math.max(1, this.currentPage - range);
      const end = Math.min(this.totalPages, this.currentPage + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  methods: {
    changePage(pageNumber) {
      this.$emit("page-changed", pageNumber);
    },
  },
};
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
}

.pagination ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pagination li {
  margin: 0 0.5rem;
}

.pagination a {
  display: block;
  padding: 0.5rem;
  text-decoration: none;
  color: #333;
}

.pagination a.active {
  background-color: #333;
  color: #fff;
}
</style>
