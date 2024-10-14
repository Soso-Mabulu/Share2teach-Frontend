<template>
  <div class="search-results-page">
    <h1 class="page-title">Search Documents</h1>

    <div class="search-container">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search documents..."
        class="search-input"
      />
      <button @click="searchDocuments" class="search-button">Search</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-if="noResults" class="no-results">No documents found.</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="results.length > 0" class="results-grid">
      <div
        v-for="document in results"
        :key="document.id"
        class="document-card"
      >
        <h3>{{ document.module }}</h3>
        <p>{{ document.description }}</p>
        <p class="university">{{ document.university }}</p>
        <p class="category">{{ document.category }}</p>
      </div>
    </div>

    <!-- Notification -->
    <transition name="fade">
      <div v-if="notification" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const searchTerm = ref('');
const results = ref([]);
const error = ref(null);
const loading = ref(false);
const noResults = ref(false);
const notification = ref(null);

const apiBaseUrl = import.meta.env.VITE_API_URL;

const searchDocuments = async () => {
  loading.value = true;
  error.value = null;
  noResults.value = false;
  results.value = [];

  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Authorization required. No token found.';
    loading.value = false;
    return;
  }

  try {
    const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    const endpoint = 'api/v1/documents/search';
    const fullUrl = `${normalizedApiBaseUrl}/${endpoint}?search=${encodeURIComponent(searchTerm.value)}`;
    
    console.log('API Endpoint:', fullUrl);

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.documents && response.data.documents.length > 0) {
      results.value = response.data.documents;
    } else {
      noResults.value = true;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = 'Unauthorized: valid token required.';
    } else if (err.response && err.response.status === 400) {
      error.value = 'Bad request: invalid query.';
    } else if (err.response && err.response.status === 404) {
      noResults.value = true;
    } else {
      error.value = 'Failed to perform search. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const showNotification = (message, type = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 3000);
};
</script>

<style scoped>
.search-results-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.loading, .no-results, .error {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}

.error {
  color: #D8000C;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.document-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.document-card h3 {
  margin-top: 0;
  color: #333;
}

.document-card p {
  color: #666;
  margin: 10px 0;
}

.university, .category {
  font-size: 0.9em;
  color: #888;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #D8000C;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

git config --global user.email "mxolisiprince87@gmail.com"
git config --global user.name "Leece"