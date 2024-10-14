<template>
  <div :class="['all-documents-page', { 'dark-mode': isDarkMode }]">
    <h1 class="page-title">All Approved Documents</h1>

    <div class="search-bar-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search documents..."
        class="search-bar"
      />
      <i class="fas fa-search search-icon"></i>
    </div>

    <div class="documents-container">
      <div class="documents-grid">
        <div
          v-for="(document, index) in filteredDocuments"
          :key="index"
          class="document-card"
          @click="showPreview(document)"
        >
          <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
          <div class="doc-info">
            <h3 class="doc-title">{{ document.title }}</h3>
            <p class="description">{{ document.description }}</p>
            <p class="author">By: {{ document.author }}</p>
          </div>
        </div>
      </div>
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
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';

const documents = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);

onMounted(() => {
  console.log('Component mounted, fetching all approved documents...');
  fetchDocuments();
});

const filteredDocuments = computed(() => {
  return documents.value.filter(document =>
    document.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    document.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});

async function fetchDocuments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    const approvedResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers });

    documents.value = mapDocuments(approvedResponse.data.documents);
    console.log(documents.value); // Check if documents are loaded
  } catch (error) {
    console.error('Failed to fetch documents:', error.message);
  }
}

function mapDocuments(docs) {
  return docs.map(doc => ({
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    light_preview_url: doc.light_preview_url || '',
    download_url: doc.download_url || '',
  }));
}

function showPreview(document) {
  console.log('Document clicked:', document); // Check if click works
  currentDocument.value = document;
  currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
  currentImageIndex.value = 0;
  showModal.value = true;
  console.log('Modal state:', showModal.value); // Check if modal shows
}

function closePreview() {
  showModal.value = false;
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentDocumentPreviewImages.value.length;
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentDocumentPreviewImages.value.length) % currentDocumentPreviewImages.value.length;
}
</script>

<style scoped>
.all-documents-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 1; /* Removed z-index: -1 */
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.search-bar-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.search-bar {
  padding: 12px 40px 12px 20px;
  width: 100%;
  border-radius: 25px;
  border: 2px solid #3498db;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3498db;
}

.documents-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  max-width: 1200px;
  width: 100%;
}

.document-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background-color: #ffffff;
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.document-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.doc-info {
  padding: 20px;
}

.doc-title {
  margin: 0 0 10px;
  font-size: 1.2em;
  color: #2c3e50;
}

.description {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.author {
  font-size: 0.8em;
  color: #95a5a6;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  max-width: 800px;
  width: 90%;
}

.preview-images-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-image {
  max-width: 100%;
  height: auto;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
}

.button-container {
  display: flex;
  gap: 15px; /* Adjust the spacing between the buttons */
  margin-top: 10px; /* You can also adjust this to control spacing above the buttons */
}

.download-btn {
  padding: 10px 15px;
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: #2980b9;
}

.close-btn {
  padding: 10px;
  background-color: #ed250e;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

/* Dark mode styles */
.dark-mode .page-title {
  color: #ecf0f1;
}

.dark-mode .document-card {
  background-color: #2c3e50;
}

.dark-mode .modal-content {
  background-color: #2c3e50;
  color: #ecf0f1;
}
</style>
