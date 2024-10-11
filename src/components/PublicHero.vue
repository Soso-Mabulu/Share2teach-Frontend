<template>
  <div :class="['User-dashboard', { 'dark-mode': isDarkMode }]">
    <h1 class="dashboard-title">User Dashboard</h1>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search documents..." 
          class="search-bar"
          @keyup.enter="handleSearch" 
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

    <!-- High Rated Documents Section -->
    <div class="document-section">
      <h2 class="section-title">High Rated Documents</h2>
      <div class="documents-container">
        <div class="documents-grid">
          <div 
            v-for="(document, index) in highRatedDocuments" 
            :key="index" 
            class="document-card"
            @click="showPreview(document)"
          >
            <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
            <div class="doc-info">
              <h3 class="doc-title">{{ document.title }}</h3>
              <p class="description">{{ document.description }}</p>
              <p class="author">By: {{ document.author }}</p>
              <div class="rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= document.rating }">&#9733;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="view-all-btn">View All Approved Documents</button>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <h2>{{ currentDocument.title }}</h2>
        <div class="preview-images-container">
          <button @click="prevImage" class="nav-button left">
            <i class="fas fa-chevron-left"></i>
          </button>
          <img :src="currentPreviewImage" alt="Preview" class="preview-image" />
          <button @click="nextImage" class="nav-button right">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <p>{{ currentImageIndex + 1 }} / {{ currentDocumentPreviewImages.length }}</p>
        <p class="description">{{ currentDocument.description }}</p>
        <p class="author">By: {{ currentDocument.author }}</p>
        <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
        <button class="close-btn" @click="closePreview">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';

const documents = ref([]);
const ratings = ref([]);
const highRatedDocuments = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const router = useRouter();

onMounted(() => {
  fetchRatings();
});

const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});

async function fetchRatings() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    const ratingsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/ratings`, { headers });
    ratings.value = ratingsResponse.data;

    const highRatedIds = ratings.value
      .filter(rating => rating.rating > 3)
      .map(rating => rating.docId);

    fetchHighRatedDocuments(highRatedIds, headers);
  } catch (error) {
    console.error('Failed to fetch ratings:', error.message);
  }
}

async function fetchHighRatedDocuments(ids, headers) {
  try {
    const documentPromises = ids.map(async (id) => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/${id}`, { headers });

      if (response.data && response.data.status === 'success') {
        return mapDocument(response.data.document);
      } else {
        console.error(`Failed to fetch document for ID ${id}:`, response.data);
        return null;
      }
    });

    const documentsArray = (await Promise.all(documentPromises)).filter(doc => doc !== null);
    highRatedDocuments.value = documentsArray;
  } catch (error) {
    console.error('Failed to fetch documents for high ratings:', error.message);
  }
}

function mapDocument(doc) {
  const documentId = doc.id || doc.docId;
  const documentRating = ratings.value.find(rating => rating.docId === documentId);

  return {
    id: documentId,
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    light_preview_url: doc.light_preview_url || '',
    download_url: doc.download_url || '',
    rating: documentRating ? documentRating.rating : 0 
  };
}

function showPreview(document) {
  currentDocument.value = document;
  currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
  currentImageIndex.value = 0;
  showModal.value = true;
}

function closePreview() {
  showModal.value = false;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode', isDarkMode.value);
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentDocumentPreviewImages.value.length;
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentDocumentPreviewImages.value.length) % currentDocumentPreviewImages.value.length;
}

function handleSearch() {
  if (searchQuery.value) {
    router.push({ name: 'search-results', query: { term: searchQuery.value } });
  }
}
</script>

<style scoped>
.User-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dashboard-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.8em;
  color: #34495e;
  text-transform: capitalize;
}

.document-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.documents-grid {
  display: flex;
  overflow-x: auto; /* Allow horizontal scrolling if needed */
  gap: 20px; /* Space between documents */
  padding: 10px; /* Optional padding */
}

.document-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  min-width: 250px; /* Ensure a minimum width for each card */
}

.document-card:hover {
  transform: scale(1.05);
}

.document-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.doc-info {
  padding: 10px 0;
}

.rating {
  display: flex;
}

.star {
  color: #d3d3d3; /* Default star color */
  font-size: 1.2em; /* Star size */
}

.star.filled {
  color: #f39c12; /* Filled star color */
}

.view-all-btn {
  padding: 10px 15px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-all-btn:hover {
  background-color: #357ab7;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  text-align: center;
}

.preview-images-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  max-width: 400px;
}

.nav-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0 15px;
}

.close-btn {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #c0392b;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.search-bar-wrapper {
  position: relative;
  flex: 1;
  margin-right: 10px;
}

.search-bar {
  width: 100%;
  padding: 10px 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-options {
  display: flex;
  align-items: center;
}

.dark-mode-switch {
  display: flex;
  align-items: center;
}

.toggle-slider {
  width: 40px;
  height: 20px;
  background-color: #ddd;
  border-radius: 20px;
  position: relative;
  margin-right: 10px;
}

.toggle-slider::before {
  content: '';
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

input[type="checkbox"]:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 1em;
}
</style>
