<template>
  <div class="contributors-page" :class="{ 'dark-mode': isDarkMode }">
    <h1 class="page-title">Our Contributors</h1>
    <p class="page-description">Celebrating the minds behind our growing knowledge base</p>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search contributors..."
          class="search-bar"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-options">
        <label class="dark-mode-switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Dark Mode</span>
        </label>
      </div>
    </div>

    <div class="contributors-grid">
      <div
        v-for="contributor in filteredContributors"
        :key="contributor.id"
        class="contributor-card"
      >
        <div class="contributor-avatar">
          <img :src="contributor.avatarUrl" :alt="contributor.name" />
          <div class="contribution-count">{{ contributor.documentCount }}</div>
        </div>
        <h3 class="contributor-name">{{ contributor.name }}</h3>
        <p class="contributor-role">{{ contributor.role }}</p>
        <p class="contribution-info">
          Uploaded {{ contributor.documentCount }} document
          {{ contributor.documentCount !== 1 ? 's' : '' }}
        </p>
        <button @click="viewContributorDetails(contributor)" class="view-details-btn">
          View Details
        </button>
      </div>
    </div>

    <!-- Contributor Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <div class="modal-header">
          <img :src="selectedContributor.avatarUrl" :alt="selectedContributor.name" class="modal-avatar" />
          <h2>{{ selectedContributor.name }}</h2>
          <p>{{ selectedContributor.role }}</p>
        </div>
        <div class="modal-body">
          <h3>Contributions</h3>
          <ul class="contribution-list">
            <li v-for="doc in selectedContributor.documents" :key="doc.id">
              <span class="document-title">{{ doc.title }}</span>
              <span class="document-date">{{ formatDate(doc.uploadDate) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const contributors = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const selectedContributor = ref(null);

onMounted(() => {
  fetchContributors();
});

const filteredContributors = computed(() => {
  return contributors.value.filter(contributor => 
    contributor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contributor.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function fetchContributors() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/contributors`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Mapping API response to the expected frontend structure
    contributors.value = response.data.contributors.map(contributor => ({
      id: contributor.userId,
      name: `${contributor.firstName} ${contributor.lastName}`,
      role: contributor.role,
      documentCount: contributor.documentCount,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.firstName + ' ' + contributor.lastName)}&background=random&size=200`
    }));
  } catch (error) {
    console.error('Failed to fetch contributors:', error);
  }
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
}

function viewContributorDetails(contributor) {
  selectedContributor.value = contributor;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

  
  <style scoped>
  .contributors-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 40px;
    background-color: #f5f5f5;
    min-height: 100vh;
    transition: background-color 0.3s ease;
  }
  
  .dark-mode {
    background-color: #1a1a1a;
    color: #f5f5f5;
  }
  
  .page-title {
    text-align: center;
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .page-description {
    text-align: center;
    font-size: 1.2em;
    color: #7f8c8d;
    margin-bottom: 40px;
  }
  
  .search-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .search-bar-wrapper {
    position: relative;
    width: 50%;
  }
  
  .search-bar {
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .search-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #bdc3c7;
  }
  
  .dark-mode-switch {
    display: flex;
    align-items: center;
  }
  
  .toggle-slider {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: #2196F3;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }
  
  .toggle-label {
    margin-left: 10px;
  }
  
  .contributors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .contributor-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .contributor-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .contributor-avatar {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
  }
  
  .contributor-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .contribution-count {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #3498db;
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .contributor-name {
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #2c3e50;
  }
  
  .contributor-role {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 10px;
  }
  
  .contribution-info {
    font-size: 0.9em;
    color: #3498db;
    margin-bottom: 15px;
  }
  
  .view-details-btn {
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .view-details-btn:hover {
    background-color: #2980b9;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .modal-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .modal-body h3 {
    margin-bottom: 10px;
  }
  
  .contribution-list {
    list-style-type: none;
    padding: 0;
  }
  
  .contribution-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .document-title {
    font-weight: bold;
  }
  
  .document-date {
    color: #7f8c8d;
  }
  
  /* Dark mode styles */
  .dark-mode .page-title,
  .dark-mode .contributor-name {
    color: #ecf0f1;
  }
  
  .dark-mode .page-description,
  .dark-mode .contributor-role {
    color: #bdc3c7;
  }
  
  .dark-mode .search-bar {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  
  .dark-mode .contributor-card {
    background-color: #34495e;
  }
  
  .dark-mode .modal-content {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  
  .dark-mode .contribution-list li {
    border-bottom-color: #4a6278;
  }
  
  .dark-mode .document-date {
    color: #bdc3c7;
  }
  </style>