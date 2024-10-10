<template>
  <div class="search-results" :class="{ 'dark-mode': isDarkMode }">
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
          class="search-bar"
          @keyup.enter="handleSearch"
        />
        <i class="fas fa-search search-icon" @click="handleSearch"></i>
      </div>

      <div class="filters">
        <select v-model="selectedModule" class="filter-select" @change="applyFilters">
          <option value="">All Modules</option>
          <option v-for="module in modules" :key="module">{{ module }}</option>
        </select>
        <select v-model="selectedYear" class="filter-select" @change="applyFilters">
          <option value="">All Years</option>
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>
        <select v-model="selectedUniversity" class="filter-select" @change="applyFilters">
          <option value="">All Universities</option>
          <option v-for="uni in universities" :key="uni">{{ uni }}</option>
        </select>
      </div>

      <h2 v-if="searchTerm" class="results-title">Results for "{{ searchTerm }}"</h2>

      <!-- Loading indicator moved to the top -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Searching for documents...</p>
      </div>

      <div v-if="filteredResults.length" class="results-container">
        <div v-for="document in filteredResults" :key="document.id" class="document-card">
          <img 
            :src="document.preview_image_url || defaultImage" 
            alt="Preview" 
            class="preview-image"
          />
          <div class="document-info">
            <h3 class="doc-title">{{ document.title }}</h3>
            <p class="description">{{ document.description }}</p>
            <p class="author">By: {{ document.author }}</p>
            <p class="module">Module: {{ document.module }}</p>
            <p class="year">Year: {{ document.year }}</p>
            <p class="university">University: {{ document.university }}</p>
            <a :href="document.download_url" class="download-btn" download>Download</a>
          </div>
        </div>
      </div>

      <div v-else-if="!filteredResults.length && !isLoading" class="no-results">
        <p>No documents found.</p>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const searchTerm = ref(route.query.term || '');
    const results = ref([]);
    const isLoading = ref(false);
    const isDarkMode = ref(false);

    const selectedModule = ref('');
    const selectedYear = ref('');
    const selectedUniversity = ref('');

    const modules = ref([]);
    const years = ref([]);
    const universities = ref([]);

    const filteredResults = computed(() => {
      return results.value.filter(doc => 
        (!selectedModule.value || doc.module === selectedModule.value) &&
        (!selectedYear.value || doc.year === selectedYear.value) &&
        (!selectedUniversity.value || doc.university === selectedUniversity.value)
      );
    });

    onMounted(() => {
      if (searchTerm.value) {
        fetchDocuments(searchTerm.value);
      }
      fetchApprovedDocuments();
    });

    watch(() => route.query.term, (newTerm) => {
      if (newTerm) {
        searchTerm.value = newTerm;
        fetchDocuments(newTerm);
      }
    });

    const fetchDocuments = async (term) => {
      isLoading.value = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/search?search=${term}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        results.value = response.data.documents || [];
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchApprovedDocuments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const approvedDocs = response.data.documents || [];
        modules.value = [...new Set(approvedDocs.map(doc => doc.module))];
        years.value = [...new Set(approvedDocs.map(doc => doc.year))];
        universities.value = [...new Set(approvedDocs.map(doc => doc.university))];
      } catch (error) {
        console.error('Error fetching approved documents:', error);
      }
    };

    const handleSearch = () => {
      if (searchTerm.value) {
        router.push({ name: 'search-results', query: { term: searchTerm.value } });
      }
    };

    const applyFilters = () => {
      // Access the computed property to update filtered results
      filteredResults.value; // Just read to trigger reactivity
    };

    return {
      searchTerm,
      filteredResults,
      isLoading,
      isDarkMode,
      handleSearch,
      selectedModule,
      selectedYear,
      selectedUniversity,
      modules,
      years,
      universities,
      applyFilters,
    };
  }
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
  border: 2px solid var(--border-color);
  border-radius: 30px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
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
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.results-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.spinner {
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.document-card {
  background-color: var(--card-background);
  box-shadow: var(--card-shadow);
  border-radius: 8px;
  overflow: hidden;
  padding: 1rem;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.document-info {
  padding: 0.5rem 0;
}

.doc-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.description {
  font-size: 0.9rem;
  color: #666;
}

.author, .module, .year, .university {
  font-size: 0.8rem;
  color: #999;
}

.download-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
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
  color: #999;
}
</style>
