<template>
  <div :class="['moderate-documents', { 'dark-mode': isDarkMode }]">
    <h1 class="page-title">Moderate Documents</h1>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-bar" />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-options">
        <select v-model="selectedCategory" class="category-filter">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <label class="dark-mode-switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Dark Mode</span>
        </label>
      </div>
    </div>

    <div class="documents-container">
      <div class="documents-grid">
        <div 
          v-for="document in filteredDocuments" 
          :key="document.id" 
          class="document-card"
          @click="showPreview(document)"
        >
          <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
          <div class="doc-info">
            <h3 class="doc-title">{{ document.title }}</h3>
            <p class="description">{{ truncateText(document.description, 100) }}</p>
            <p class="author">By: {{ document.author }}</p>
            <p class="category">Category: {{ document.category }}</p>
            <p class="status">Status: {{ document.status }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <h2>{{ currentDocument.title }}</h2>
        <div class="preview-images-container">
          <button @click="prevImage" class="nav-button left" :disabled="currentImageIndex === 0">
            <i class="fas fa-chevron-left"></i>
          </button>
          <img :src="currentPreviewImage" alt="Preview" class="preview-image" />
          <button @click="nextImage" class="nav-button right" :disabled="currentImageIndex === currentDocumentPreviewImages.length - 1">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <p>{{ currentImageIndex + 1 }} / {{ currentDocumentPreviewImages.length }}</p>
        <p class="description">{{ currentDocument.description }}</p>
        <p class="author">By: {{ currentDocument.author }}</p>
        <p class="category">Category: {{ currentDocument.category }}</p>
        <p class="status">Status: {{ currentDocument.status }}</p>
        <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
        <div class="moderation-actions">
          <button @click="approveDocument" class="approve-btn">Approve</button>
          <button @click="openDisapproveModal" class="disapprove-btn">Disapprove</button>
        </div>
        <button class="close-btn" @click="closePreview">&times;</button>
      </div>
    </div>

    <!-- Disapprove Modal -->
    <div v-if="showDisapproveModal" class="modal-overlay" @click="closeDisapproveModal">
      <div class="modal-content disapprove-modal" @click.stop>
        <h3>Disapprove Document</h3>
        <textarea v-model="disapproveReason" placeholder="Please provide a reason for disapproval..." rows="4"></textarea>
        <div class="disapprove-actions">
          <button @click="submitDisapproval" class="submit-disapprove-btn">Submit</button>
          <button @click="closeDisapproveModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Response Message -->
    <div v-if="responseMessage" :class="['response-message', responseMessage.type]">
      {{ responseMessage.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';

const documents = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const showDisapproveModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const selectedCategory = ref('');
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = 12;
const totalItems = ref(0);
const disapproveReason = ref('');
const responseMessage = ref(null);

const filteredDocuments = computed(() => {
  let filtered = documents.value.filter(document => 
    (document.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    document.description.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (selectedCategory.value === '' || document.category === selectedCategory.value)
  );
  
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filtered.slice(startIndex, endIndex);
});

watch(filteredDocuments, (newFilteredDocuments) => {
  totalItems.value = newFilteredDocuments.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage);
});

const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});

onMounted(() => {
  fetchDocuments();
  loadDarkModePreference();
});

async function fetchDocuments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    const endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents/pending`;

    const response = await axios.get(endpoint, { headers });
    documents.value = mapDocuments(response.data.documents);
    totalItems.value = documents.value.length;
    categories.value = [...new Set(documents.value.map(doc => doc.category))];
  } catch (error) {
    console.error('Failed to fetch documents:', error.message);
    showResponseMessage('Error fetching documents. Please try again.', 'error');
  }
}

function mapDocuments(docs) {
  return docs.map(doc => ({
    id: doc.docId,
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    category: doc.category || 'Uncategorized',
    status: 'Pending',
    light_preview_url: doc.light_preview_url || '',
    download_url: doc.location || '',
  }));
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
  localStorage.setItem('darkMode', isDarkMode.value);
}

function loadDarkModePreference() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode.value);
  }
}

function nextImage() {
  if (currentImageIndex.value < currentDocumentPreviewImages.value.length - 1) {
    currentImageIndex.value++;
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

async function approveDocument() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    const endpoint = `${import.meta.env.VITE_API_URL}api/v1/moderation`;

    const payload = {
      docid: currentDocument.value.id,
      action: "approve",
      comments: "Document meets the required standards."
    };
    console.log("docid:", currentDocument.value.id,)

    // Make sure headers are passed as the third argument
    await axios.post(endpoint, payload, { headers });

    // Remove the approved document from the list
    documents.value = documents.value.filter(doc => doc.id !== currentDocument.value.id);
    closePreview();
    showResponseMessage('Document approved successfully.', 'success');
  } catch (error) {
    console.error('Failed to approve document:', error.message);
    showResponseMessage('Failed to approve document. Please try again.', 'error');
  }
}


function openDisapproveModal() {
  showDisapproveModal.value = true;
}

function closeDisapproveModal() {
  showDisapproveModal.value = false;
  disapproveReason.value = '';
}

async function submitDisapproval() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    const endpoint = `${import.meta.env.VITE_API_URL}api/v1/moderation`;

    const payload = {
      docid: currentDocument.value.id,
      action: "disapprove",
      comments: disapproveReason.value
    };

    await axios.post(endpoint, payload, { headers });

    // Remove the disapproved document from the list
    documents.value = documents.value.filter(doc => doc.id !== currentDocument.value.id);
    closeDisapproveModal();
    closePreview();
    showResponseMessage('Document disapproved successfully.', 'success');
  } catch (error) {
    console.error('Failed to disapprove document:', error.message);
    showResponseMessage('Failed to disapprove document. Please try again.', 'error');
  }
}

function showResponseMessage(text, type) {
  responseMessage.value = { text, type };
  setTimeout(() => {
    responseMessage.value = null;
  }, 5000);
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}
</script>
  
  <style scoped>
  .moderate-documents {
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
  
  .page-title {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5em;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    padding-bottom: 10px;
  }
  
  .page-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #3498db;
  }
  
  .search-filter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;
    max-width: 600px;
  }
  
  .search-bar-wrapper {
    position: relative;
    width: 100%;
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
  
  .filter-options {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .category-filter {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #3498db;
    font-size: 16px;
  }
  
  .dark-mode-switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  
  .dark-mode-switch input {
    display: none;
  }
  
  .toggle-slider {
    position: relative;
    width: 50px;
    height: 24px;
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }
  
  input:checked + .toggle-slider {
    background-color: #3498db;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }
  
  .toggle-label {
    margin-left: 10px;
    font-weight: 500;
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
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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
  
  .description, .author, .category, .status {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 5px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination button {
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .pagination button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  .pagination button:hover:not(:disabled) {
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
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
  }
  
  .preview-images-container {
    position: relative;
    margin-bottom: 20px;
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  
  .nav-button.left {
    left: 10px;
  }
  
  .nav-button.right {
    right: 10px;
  }
  
  .download-btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .download-btn:hover {
    background-color: #2980b9;
  }
  
  .moderation-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .approve-btn, .disapprove-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .approve-btn {
    background-color: #2ecc71;
    color: white;
  }
  
  .approve-btn:hover {
    background-color: #27ae60;
  }
  
  .disapprove-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .disapprove-btn:hover {
    background-color: #c0392b;
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
  
  .disapprove-modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
  }
  
  .disapprove-modal textarea {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .disapprove-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .submit-disapprove-btn, .cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .submit-disapprove-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel-btn {
    background-color: #95a5a6;
    color: white;
  }
  
  /* Dark mode styles */
  .dark-mode .document-card {
    background-color: #2c3e50;
    border-color: #34495e;
  }
  
  .dark-mode .doc-title {
    color: #ecf0f1;
  }
  
  .dark-mode .description, .dark-mode .author, .dark-mode .category, .dark-mode .status {
    color: #bdc3c7;
  }
  
  .dark-mode .modal-content, .dark-mode .disapprove-modal {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  
  .dark-mode .close-btn {
    color: #ecf0f1;
  }
  
  .dark-mode .disapprove-modal textarea {
    background-color: #34495e;
    color: #ecf0f1;
    border-color: #7f8c8d;
  }
  
  .dark-mode .search-bar {
    background-color: #34495e;
    color: #ecf0f1;
    border-color: #3498db;
  }
  
  .dark-mode .category-filter {
    background-color: #34495e;
    color: #ecf0f1;
    border-color: #3498db;
  }
  .response-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 4.7s;
}

.response-message.success {
  background-color: #2ecc71;
}

.response-message.error {
  background-color: #e74c3c;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Dark mode styles */
.dark-mode .response-message.success {
  background-color: #27ae60;
}

.dark-mode .response-message.error {
  background-color: #c0392b;
}
  </style>