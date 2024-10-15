<template>
    <div :class="['view-reported-documents', { 'dark-mode': isDarkMode }]">
      <h1 class="page-title">Reported Documents</h1>
  
      <div v-if="hasDocuments" class="search-filter-container">
        <div class="search-bar-wrapper">
          <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-bar" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-options">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <select v-model="selectedModule" class="filter-select">
            <option value="">All Modules</option>
            <option v-for="module in modules" :key="module" :value="module">
              {{ module }}
            </option>
          </select>
          <select v-model="selectedAuthor" class="filter-select">
            <option value="">All Authors</option>
            <option v-for="author in authors" :key="author" :value="author">
              {{ author }}
            </option>
          </select>
          <label class="dark-mode-switch">
            <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
            <span class="toggle-slider"></span>
            <span class="toggle-label">Dark Mode</span>
          </label>
        </div>
      </div>
      
  
      <div v-if="hasDocuments" class="documents-container">
        <div class="documents-grid">
          <div 
            v-for="document in filteredDocuments" 
            :key="document.id" 
            class="document-card"
            @click="showDocumentDetails(document)"
          >
            <div class="document-header">
              <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
              <div class="report-count">
                <i class="fas fa-flag"></i>
                <span>{{ document.report_count }}</span>
              </div>
            </div>
            <div class="doc-info">
              <h3 class="doc-title">{{ document.title }}</h3>
              <p class="description">{{ truncateText(document.description, 100) }}</p>
              <p class="author">By: {{ document.author }}</p>
              <p class="category">Category: {{ document.category }}</p>
              <p class="module">Module: {{ document.module }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <div  v-if="hasDocuments && totalPages > 1" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>

      <div v-else class="no-documents-message">
        <i class="fas fa-inbox empty-inbox-icon "></i>
        <p class="text-center">There are no reported documents at the moment.</p>
        <p class="text-center">When users report documents, they will appear here for review.</p>
      </div>
  
      <!-- Document Details Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
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
          <p class="category">Category: {{ currentDocument.category }}</p>
          <p class="module">Module: {{ currentDocument.module }}</p>
          <p class="report-info">Reported {{ currentDocument.report_count }} times</p>
          
          <h3>Report Comments</h3>
          <div class="report-comments">
            <div v-for="(comment, index) in currentDocument.report_comments" :key="index" class="report-comment">
              <p class="comment-text">{{ index + 1 }}. {{ comment.text }}</p>
              <p class="comment-date">Reported on: {{ formatDate(comment.date) }}</p>
            </div>
          </div>
          
          <div class="action-buttons">
            <button @click="approveDocument" class="approve-btn">Re-Approve Document</button>
            <button @click="deleteDocument" class="delete-btn">Delete Document</button>
            <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
          </div>
          
          <button class="close-btn" @click="closeModal">&times;</button>
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
  const selectedCategory = ref('');
  const selectedModule = ref('');
  const selectedAuthor = ref('');
  const categories = ref([]);
  const modules = ref([]);
  const authors = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const totalItems = ref(0);
  
  const filteredDocuments = computed(() => {
    let filtered = documents.value.filter(document => 
      (document.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedCategory.value === '' || document.category === selectedCategory.value) &&
      (selectedModule.value === '' || document.module === selectedModule.value) &&
      (selectedAuthor.value === '' || document.author === selectedAuthor.value)
    );
    
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage);
  });
  
  const hasDocuments = computed(() => documents.value.length > 0);
  
  const currentPreviewImage = computed(() => {
    return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
  });
  
  onMounted(() => {
    fetchReportedDocuments();
  });
  
  async function fetchReportedDocuments() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/reported`, { headers });
      documents.value = mapDocuments(response.data.documents);
      totalItems.value = documents.value.length;
      categories.value = [...new Set(documents.value.map(doc => doc.category))];
      modules.value = [...new Set(documents.value.map(doc => doc.module))];
      authors.value = [...new Set(documents.value.map(doc => doc.author))];
    } catch (error) {
      console.error('Failed to fetch reported documents:', error);
      // Handle error (e.g., show error message to user)
    }
  }
  
  function mapDocuments(docs) {
    const groupedDocuments = {};

    docs.forEach(doc => {
      // If the document ID is already in the grouped object, add the reporting detail
      if (groupedDocuments[doc.docId]) {
        groupedDocuments[doc.docId].report_count += 1;
        groupedDocuments[doc.docId].report_comments.push({
          text: doc.reporting_details,
          date: doc.reporting_timestamp,
        });
      } else {
        // If the document ID is not yet in the grouped object, create a new entry
        groupedDocuments[doc.docId] = {
          id: doc.docId,
          title: doc.title || 'Unknown title',
          preview_image_url: doc.preview_image_url || defaultImage,
          description: doc.description || 'No description available',
          author: doc.documentUserId || 'Unknown Author',
          category: doc.category || 'Uncategorized',
          module: doc.module || 'Unspecified',
          report_count: 1,
          report_comments: [{
            text: doc.reporting_details,
            date: doc.reporting_timestamp,
          }],
          light_preview_url: doc.light_preview_url || '',
          download_url: doc.location || '',
        };
      }
    });

    return Object.values(groupedDocuments); // Return the grouped documents as an array
  }

  function showDocumentDetails(document) {
    currentDocument.value = document;
    currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
    currentImageIndex.value = 0;
    showModal.value = true;
  }
  
  function closeModal() {
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
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }
  
  async function approveDocument(action = 'approve', comments = '') {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const requestBody = {
        docid: currentDocument.value.id,
        action,  // 'approve' or 'disapprove'
        comments // Optional comments for disapproval
      };

      await axios.post(`${import.meta.env.VITE_API_URL}api/v1/moderation`, requestBody, { headers });

      // Remove the document from the list and close the modal if approved
      if (action === 'approve') {
        documents.value = documents.value.filter(doc => doc.id !== currentDocument.value.id);
      }
      closeModal();

      // Optionally, show a success message
      console.log('Document moderated successfully');
    } catch (error) {
      console.error('Failed to moderate document:', error);
      // Handle error (e.g., show error message to user)
    }
}

  
  async function deleteDocument() {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${import.meta.env.VITE_API_URL}api/v1/documents/${currentDocument.value.id}`, { headers });
        console.log(currentDocument.value.id, headers);
        // Remove the document from the list and close the modal
        documents.value = documents.value.filter(doc => doc.id !== currentDocument.value.id);
        closeModal();
        // Optionally, show a success message
      } catch (error) {
        console.error('Failed to delete document:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }
  </script>
  
  <style scoped>
  .view-reported-documents {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    min-height: 100vh;
    z-index: -1;
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
    background-color: #8c3ce7;
  }
  
  .search-filter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;
    max-width: 800px;
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
    border: 2px solid #8c3ce7;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .search-bar:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(163, 60, 231, 0.5);
  }
  
  .search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #8c3ce7;
  }
  
  .filter-options {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }
  
  .filter-select {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #8c3ce7;
    font-size: 16px;
    margin-right: 10px;
    margin-bottom: 10px;
    flex-grow: 1;
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
    background-color: #8c3ce7;
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
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  position: relative;
}

.document-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.document-header {
  position: relative;
}

.document-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.report-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(168, 60, 231, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
}

.report-count i {
  margin-right: 5px;
}

.doc-info {
  padding: 20px;
}

.doc-title {
  margin: 0 0 10px;
  font-size: 1.2em;
  color: #2c3e50;
}

.description, .author, .category, .module {
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
  background-color: #8c3ce7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #8c3ce7;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.preview-images-container {
  position: relative;
  margin: 20px 0;
}

.preview-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-button:hover {
  background: rgba(0,0,0,0.8);
}

.nav-button.left {
  left: 10px;
}

.nav-button.right {
  right: 10px;
}

.report-comments {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
}

.report-comment {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.comment-text {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.comment-date {
  font-size: 0.8em;
  color: #7f8c8d;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.approve-btn, .delete-btn, .download-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.approve-btn {
  background-color: #2ecc71;
  color: white;
}

.approve-btn:hover {
  background-color: #27ae60;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.download-btn {
  background-color: #3498db;
  color: white;
  text-decoration: none;
}

.download-btn:hover {
  background-color: #2980b9;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.close-btn:hover {
  color: #e74c3c;
}

/* Dark mode styles */
.dark-mode .page-title {
  color: #ecf0f1;
}

.dark-mode .page-title::after {
  background-color: #a83ce7;
}

.dark-mode .search-bar {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #a83ce7;
}

.dark-mode .search-icon {
  color: #a83ce7;
}

.dark-mode .filter-select {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #a83ce7;
}

.dark-mode .document-card {
  background-color: #34495e;
  border-color: #2c3e50;
}

.dark-mode .doc-title {
  color: #ecf0f1;
}

.dark-mode .description, 
.dark-mode .author, 
.dark-mode .category, 
.dark-mode .module {
  color: #bdc3c7;
}

.dark-mode .pagination button {
  background-color: #a83ce7;
}

.dark-mode .pagination button:hover {
  background-color: #a83ce7;
}

.dark-mode .pagination button:disabled {
  background-color: #7f8c8d;
}

.dark-mode .modal-content {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.dark-mode .report-comments {
  border-color: #34495e;
}

.dark-mode .report-comment {
  background-color: #34495e;
}

.dark-mode .comment-date {
  color: #bdc3c7;
}

.dark-mode .close-btn {
  color: #ecf0f1;
}

.dark-mode .close-btn:hover {
  color: #e74c3c;
}
</style>