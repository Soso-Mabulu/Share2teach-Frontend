<template>
  <div class="search-results" :class="{ 'dark-mode': isDarkMode }">
    <!-- Go Back Button -->
    <button class="go-back-btn" @click="goBack">Go Back</button>

    <div class="container">
      <div class="header">
        <h1 class="main-title">Document Search</h1>
        <label class="switch">
          <input type="checkbox" v-model="isDarkMode">
          <span class="slider round"></span>
          <span class="mode-label">{{ isDarkMode ? 'Dark' : 'Light' }} Mode</span>
        </label>
      </div>

      <div class="search-bar-wrapper">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Enter search term..." 
          @keyup.enter="handleSearch"
          class="search-bar"
        />
        <i class="fas fa-search search-icon" @click="handleSearch"></i>
      </div>

      <div class="filters">
        <select v-model="selectedModule" class="filter-select">
          <option value="">All Modules</option>
          <option v-for="module in modules" :key="module">{{ module }}</option>
        </select>
        <select v-model="selectedYear" class="filter-select">
          <option value="">All Years</option>
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>
        <select v-model="selectedUniversity" class="filter-select">
          <option value="">All Universities</option>
          <option v-for="uni in universities" :key="uni">{{ uni }}</option>
        </select>
      </div>

      <h2 v-if="searchTerm" class="results-title">Results for "{{ searchTerm }}"</h2>

      <div v-if="filteredResults.length" class="results-container">
  <div v-for="document in filteredResults" :key="document.fileName" class="document-card">
    <img 
      :src="document.preview_image_url" 
      alt="Preview" 
      class="preview-image"
    />
    <div class="document-info">
      <h3 class="doc-title">{{ document.title }}</h3>
      <p class="description">{{ document.description }}</p>
      
      <div class="document-details">
        <p><strong>Author:</strong> {{ document.author || 'N/A' }}</p>
        <p><strong>Year:</strong> {{ document.year || 'N/A' }}</p>
        <p><strong>Publication Date:</strong> {{ document.publication_date || 'N/A' }}</p>
        <p><strong>Size:</strong> {{ document.size ? document.size + ' MB' : 'N/A' }}</p>
        <p><strong>University:</strong> {{ document.university || 'N/A' }}</p>
      </div>
      
      <a :href="document.location" target="_blank" class="download-btn">Download</a>
    </div>
  </div>
</div>

      <div v-else-if="!filteredResults.length && !isLoading" class="no-results">
        <p>No documents found.</p>
      </div>

      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Searching for documents...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      results: [],
      searchTerm: this.$route.query.term || '',
      isLoading: false,
      isDarkMode: false,
      selectedModule: '',
      selectedYear: '',
      selectedUniversity: '',
      modules: [],
      years: [],
      universities: [],
    };
  },
  created() {
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (this.searchTerm) {
      this.fetchDocuments(this.searchTerm);
    }
  },
  computed: {
    filteredResults() {
      return this.results.filter(doc => 
        (!this.selectedModule || doc.module === this.selectedModule) &&
        (!this.selectedYear || (doc.year === this.selectedYear && doc.approved)) && // Filter by year only if the document is approved
        (!this.selectedUniversity || doc.university === this.selectedUniversity) &&
        (!this.searchTerm || doc.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         doc.description.toLowerCase().includes(this.searchTerm.toLowerCase())) // Filter by search term
      );
    }
  },
  watch: {
    '$route.query.term': {
      handler(newTerm) {
        this.searchTerm = newTerm;
        if (newTerm) {
          this.fetchDocuments(newTerm);
        }
      },
      immediate: true,
    },
    isDarkMode(newValue) {
      localStorage.setItem('isDarkMode', newValue);
    },
  },
  methods: {
    // Function to go back to the previous page
    goBack() {
      this.router.back(); // Navigate to the previous page
    },
    async fetchDocuments(searchQuery) {
      this.isLoading = true;
      this.results = [];
      
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
          this.extractFilters(this.results); // Extract modules, years, and universities
        } else {
          console.error('Failed to fetch documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        this.isLoading = false;
      }
    },
    extractFilters(documents) {
      this.modules = [...new Set(documents.map(doc => doc.module))].filter(Boolean);
      // Extract years from approved documents
      this.years = [...new Set(documents.filter(doc => doc.approved).map(doc => doc.year))].filter(Boolean);
      this.universities = [...new Set(documents.map(doc => doc.university))].filter(Boolean);
    },
    handleSearch() {
      if (this.searchTerm) {
        this.$router.push({ name: 'search-results', query: { term: this.searchTerm } });
      }
    },
  },
};
</script>





<style scoped>
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5a623;
  --text-color: #333;
  --background-color: #f4f4f4;
  --card-background: #fff;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --border-color: #dcdcdc;
}

.dark-mode {
  --primary-color: #61dafb;
  --secondary-color: #ffc107;
  --text-color: #f4f4f4;
  --background-color: #1a1a1a;
  --card-background: #2c2c2c;
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  --border-color: #444;
}

.search-results {
  font-family: 'Roboto', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: all 0.3s ease;
  z-index: -1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.main-title {
  font-size: 2.5rem;
  color: var(--primary-color);
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.mode-label {
  margin-left: 70px;
  font-size: 0.9rem;
}

.search-bar-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-bar {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color); /* Existing border */
  border-radius: 30px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow for more depth */
}

.search-bar:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-select {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid var(--border-color); /* Make the border more visible */
  border-radius: 5px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: border-color 0.3s ease; /* Add transition for smoother effect */
}

.filter-select:focus,
.search-bar:focus { /* Style for focused state */
  outline: none; /* Remove default outline */
  border-color: var(--primary-color); /* Change border color on focus */
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3); /* Add shadow on focus */
}
.results-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.document-card {
  background-color: var(--card-background);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.document-info {
  padding: 1.5rem;
}

.doc-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.description {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.download-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: var(--secondary-color);
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color);
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .results-container {
    grid-template-columns: 1fr;
  }
}
.go-back-btn {
  background-color: purple;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
  font-weight: bold;
  display: block;
  margin: 2rem auto; /* Center the button */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Add shadow for depth */
}

.go-back-btn:hover {
  background-color: darkviolet;
  transform: translateY(-3px); /* Slightly lift the button */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Enhance shadow on hover */
}

.go-back-btn:active {
  transform: translateY(1px); /* Slightly press the button */
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15); /* Reduce shadow on active */
}
</style>