<template>
    <div class="search-results">
      <h1>Search Results for: "{{ searchTerm }}"</h1>
      
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
      <div v-else>
        <p>No documents found.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        results: [],
        searchTerm: this.$route.query.term || '', // Get the search term from the query parameter
      };
    },
    async created() {
      if (this.searchTerm) {
        await this.fetchSearchResults();
      }
    },
    methods: {
      async fetchSearchResults() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/documents/search?search=${this.searchTerm}`, 
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            this.results = data.documents || [];
          } else {
            console.error('Failed to fetch search results');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .search-results {
    font-family: Arial, sans-serif;
    margin: 20px;
    text-align: center;
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
  