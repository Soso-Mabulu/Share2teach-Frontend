<template>
    <div class="search-results">
      <!-- Include the search bar on the search results page -->
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
  
      <!-- Results Section -->
      <h1 v-if="searchTerm">Search Results for: "{{ searchTerm }}"</h1>
  
      <div v-if="results && results.length" class="results-container">
        <ul>
          <li v-for="document in results" :key="document.fileName" class="document-card">
            <img 
              :src="document.preview_image_url" 
              alt="Preview" 
              class="preview-image"
            />
            <h2>{{ document.title }}</h2>
            <p>{{ document.description }}</p>
            <a :href="document.location" target="_blank">Download</a>
          </li>
        </ul>
      </div>
  
      <!-- No results found -->
      <div v-else-if="!results.length && !isLoading">
        <p>No documents found.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        results: [],
        searchTerm: this.$route.query.term || '', // Get the search term from the query
        isLoading: true, // To handle loading state
      };
    },
    async created() {
      // Fetch documents when the component is created
      await this.fetchDocuments(this.searchTerm);
    },
    watch: {
      // Watch for changes in the query parameter and refetch results
      '$route.query.term': {
        immediate: true, // Trigger immediately on page load
        handler(newTerm) {
          this.searchTerm = newTerm;
          this.fetchDocuments(newTerm); // Call the fetch function with the new term
        }
      }
    },
    methods: {
      async fetchDocuments(searchQuery) {
        if (!searchQuery) return;
        
        this.isLoading = true; // Start loading
        this.results = []; // Clear results before fetching new ones
  
        try {
          const url = `${import.meta.env.VITE_API_URL}/api/v1/documents/search?search=${searchQuery}`;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.results = data.documents || [];
          } else {
            console.error('Failed to fetch documents');
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        } finally {
          this.isLoading = false; // Stop loading
        }
      },
      handleSearch() {
        if (this.searchTerm) {
          // Update the URL with the search term and fetch new results
          this.$router.push({ name: 'search-results', query: { term: this.searchTerm } });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .search-results {
    font-family: Arial, sans-serif;
    margin: 20px;
    text-align: center;
  }
  
  .public-document-search {
    text-align: center;
    margin-bottom: 20px;
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
  
  .results-container {
    margin-top: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  .document-card {
    background-color: #f4f4f4;
    margin: 10px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .preview-image {
    max-width: 100px;
    margin-bottom: 10px;
  }
  </style>
  