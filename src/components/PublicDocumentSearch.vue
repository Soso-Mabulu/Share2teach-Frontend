<template>
    <div class="public-document-search">
      <h1>Search Documents</h1>
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Enter search term" 
        @keyup.enter="handleSearch"
        class="search-input"
      />
      <button @click="handleSearch" class="search-btn">Search</button>
    </div>
  </template>
  
  <script>
  // eslint-disable-next-line no-unused-vars
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        searchTerm: '', // Model for search input
      };
    },
    methods: {
      handleSearch() {
        if (this.searchTerm) {
          // Navigate to the Search Results page with the search term as a query parameter
          this.$router.push({ name: 'search-results', query: { term: this.searchTerm } });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .public-document-search {
    text-align: center;
  }
  .search-input {
    padding: 10px;
    margin: 20px;
    width: 80%;
    max-width: 400px;
  }
  .search-btn {
    padding: 10px 20px;
    background-color: #6200ea; /* Purple button */
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  