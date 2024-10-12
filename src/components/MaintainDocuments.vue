<template>
    <div :class="['subject-view-page', { 'dark-mode': isDarkMode }]">
      <h1 class="page-title">Maintain Documents Page</h1>
        <!-- Success message display -->
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

  
      <div class="search-filter-container">
        <div class="search-bar-wrapper">
          <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-bar" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-options">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <select v-model="selectedModule" class="filter-select">
            <option value="">All Statuses</option>
            <option v-for="module in modules" :key="module" :value="module">{{ module }}</option>
          </select>
          <select v-model="selectedUniversity" class="filter-select">
            <option value="">All Universities</option>
            <option v-for="university in universities" :key="university" :value="university">{{ university }}</option>
          </select>
        </div>
      </div>
      <div class="search-filter-container">
        <div class="search-bar-wrapper">
          <div class="filter-options">
            <label class="dark-mode-switch">
              <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">Dark Mode</span>
            </label>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading documents...</p>
      </div>
  
      <div v-for="module in modules" :key="module" class="subject-section">
        <h2 class="section-title">{{ module }}</h2>
        <div class="documents-container">
          <button @click="prevSlide(module)" class="carousel-button prev">&lt;</button>
          <div class="documents-carousel">
            <div
              v-for="(document, index) in visibleDocuments(module)"
              :key="index"
              class="document-card"
              @click="showPreview(document)"
            >
              <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
              <div class="doc-info">
                <h3 class="doc-title">{{ document.title }}</h3>
                <p class="description">{{ document.description }}</p>
                <p class="author">By: {{ document.author }}</p>
                <p class="category">Category: {{ document.category }}</p>
                <p class="university">University: {{ document.university }}</p>
              </div>
            </div>
          </div>
          <button @click="nextSlide(module)" class="carousel-button next">&gt;</button>
        </div>
        <div class="section-divider my-8 flex flex-col items-center">
          <hr class="divider-line w-full border-t-2 border-blue-500 mb-4" />
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
            <p class="category">Category: {{ currentDocument.category }}</p>
            <p class="university">University: {{ currentDocument.university }}</p>
            <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
            <button class="close-btn" @click="closePreview">Close</button>
            </div>
        </div>
        </div>
        <!-- Updated Preview Modal -->
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
        <p class="category">Category: {{ currentDocument.category }}</p>
        <p class="university">University: {{ currentDocument.university }}</p>
        <div class="modal-actions">
          <a :href="currentDocument.download_url" class="action-btn download-btn" download>Download Full Document</a>
          <button class="action-btn edit-btn" @click="editDocumentMetadata">Edit Metadata</button>
          <button class="action-btn delete-btn" @click="confirmDelete">Delete Document</button>
        </div>
        <button class="close-btn" @click="closePreview">&times;</button>
      </div>
    </div>

    <!-- Edit Metadata Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content edit-modal" @click.stop>
        <h2>Edit Document Metadata</h2>
        <form @submit.prevent="updateDocumentMetadata">
          <div class="form-group">
            <label for="title">Title:</label>
            <input id="title" v-model="editingDocument.title" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" v-model="editingDocument.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="author">Author:</label>
            <input id="author" v-model="editingDocument.author" required>
          </div>
          <div class="form-group">
            <label for="category">Category:</label>
            <input id="category" v-model="editingDocument.category" required>
          </div>
          <div class="form-group">
            <label for="university">University:</label>
            <input id="university" v-model="editingDocument.university" required>
          </div>
          <div class="form-actions">
            <button class="action-btn edit-btn" @click="editDocument" :disabled="isEditing">
              <div v-if="isEditing" class="editing">
                <div class="spinner-edit"></div>
                <span>Editing...</span>
              </div>
              <div v-else>Edit</div>
            </button>

            <button type="button" class="action-btn cancel-btn" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-content confirm-modal" @click.stop>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this document? This action cannot be undone.</p>
        <div class="confirm-actions">
          <button class="action-btn delete-btn" @click="deleteDocument" :disabled="isDeleting">
            <div v-if="isDeleting" class="loading">
              <div class="spinner"></div>
              <span>Deleting...</span>
            </div>
            <div v-else>Delete</div>
          </button>

          <button class="action-btn cancel-btn" @click="closeConfirmModal">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import defaultImage from '@/assets/documentIcon.png';
  
  // Initialize reactive references
  const documents = ref({
    pending: [],
    reported: [],
    approved: [],
  });
  const searchQuery = ref('');
  const isDarkMode = ref(false);
  const showModal = ref(false);
  const currentDocument = ref(null);
  const currentDocumentPreviewImages = ref([]);
  const currentImageIndex = ref(0);
  const modules = ref(['pending', 'reported', 'approved']);
  
  // New reactive references for filters and carousel
  const selectedCategory = ref('');
  const selectedModule = ref('');
  const selectedUniversity = ref('');
  const carouselPositions = ref({});
  const isLoading = ref(true);
  const showEditModal = ref(false);
  const showConfirmModal = ref(false);
  const editingDocument = ref(null);
  const successMessage = ref(''); // New property for success messages
  const isEditing = ref(false); // New loading state for editing
  const isDeleting = ref(false); // New loading state for deleting

  
  // Computed properties for unique categories and universities
  const categories = computed(() => {
    const allCategories = new Set();
    Object.values(documents.value).forEach(moduleDocuments => {
      moduleDocuments.forEach(doc => allCategories.add(doc.category));
    });
    return Array.from(allCategories);
  });
  
  const universities = computed(() => {
    const allUniversities = new Set();
    Object.values(documents.value).forEach(moduleDocuments => {
      moduleDocuments.forEach(doc => allUniversities.add(doc.university));
    });
    return Array.from(allUniversities);
  });
  
  // Computed property to filter documents based on search query and selected filters
  const filteredDocuments = computed(() => {
    const filtered = {};
    for (const module of modules.value) {
      filtered[module] = documents.value[module].filter(document =>
        (document.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
         document.description.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
        (!selectedCategory.value || document.category === selectedCategory.value) &&
        (!selectedModule.value || module === selectedModule.value) &&
        (!selectedUniversity.value || document.university === selectedUniversity.value)
      );
    }
    return filtered;
  });
  
  // Function to get visible documents for each module
  const visibleDocuments = (module) => {
    const start = carouselPositions.value[module] || 0;
    return filteredDocuments.value[module].slice(start, start + 4);
  };
  
  // Carousel navigation functions
  const nextSlide = (module) => {
    const moduleDocuments = filteredDocuments.value[module];
    carouselPositions.value[module] = Math.min(
      (carouselPositions.value[module] || 0) + 4,
      moduleDocuments.length - 4
    );
  };
  
  const prevSlide = (module) => {
    carouselPositions.value[module] = Math.max(
      (carouselPositions.value[module] || 0) - 4,
      0
    );
  };
  
  // Async function to fetch documents from the API
  async function fetchDocuments() {  
      // Set loading state to true
      isLoading.value = true;
      try {  
          // Retrieve token from local storage
          const token = localStorage.getItem('token');  
          const headers = { Authorization: `Bearer ${token}` };  
          
          console.log('Token retrieved:', token); // Log the retrieved token
          
          // Fetch documents from all endpoints
          const responses = await Promise.allSettled([
              axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/pending`, { headers }),
              axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/reported`, { headers }),
              axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers })
          ]);
  
          // Store documents organized by module
          documents.value.pending = [];
          documents.value.reported = [];
          documents.value.approved = [];
  
          // Process each response
          responses.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                  // If the request was successful, map the documents
                  const documentsData = mapDocuments(result.value.data.documents || []);
                  switch (index) {
                      case 0:
                          documents.value.pending = documentsData;
                          break;
                      case 1:
                          documents.value.reported = documentsData;
                          break;
                      case 2:
                          documents.value.approved = documentsData;
                          break;
                  }
              } else {
                  // If the request failed, log the error
                  console.error(`Failed to fetch documents from endpoint ${index}:`, result.reason);
              }
          });
  
          console.log('Documents stored:', documents.value); // Log the stored documents
          
      } catch (error) {  
          console.error('An unexpected error occurred:', error.message);
          console.error('Error details:', error.response ? error.response.data : error);
          
      } 
      finally {
            isLoading.value = false;
      } 

  }
  
  
  // Function to map document data to the desired structure
  function mapDocuments(docs) {
    return docs.map(doc => ({
      id: doc.docId,
      title: doc.title || 'Unknown title',
      preview_image_url: doc.preview_image_url || defaultImage,
      description: doc.description || 'No description available',
      author: doc.author || 'Unknown Author',
      light_preview_url: doc.light_preview_url || '',
      download_url: doc.location || '',
      category: doc.category ||'',
      university: doc.university ||'',
      module: doc.module ||'',
  
    }));
  }
  
function showPreview(document) {
  currentDocument.value = document;
  currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
  currentImageIndex.value = 0;
  showModal.value = true;
}
const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});
// Function to edit document metadata
function editDocumentMetadata() {
  editingDocument.value = { ...currentDocument.value };
  showEditModal.value = true;
}

// Function to update document metadata
async function updateDocumentMetadata() {
  isEditing.value = true; // Set loading state to true
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.put(`${import.meta.env.VITE_API_URL}api/v1/documents/${editingDocument.value.id}`, editingDocument.value, { headers });
    
    if (response.status === 200) {
      // Update the document in the local state
      Object.assign(currentDocument.value, editingDocument.value);
      // Update the document in the documents list
      ['pending', 'reported', 'approved'].forEach(module => {
        const index = documents.value[module].findIndex(doc => doc.id === editingDocument.value.id);
        if (index !== -1) {
          documents.value[module][index] = { ...documents.value[module][index], ...editingDocument.value };
        }

      });
      successMessage.value = 'Document Updated successfully!';
      closeEditModal();
      setTimeout(() => { successMessage.value = ''; }, 3000);

    }
  } catch (error) {
    console.error('Failed to update document metadata:', error);
    // Handle error (e.g., show error message to user)
    successMessage.value = 'Failed to update document metadata: Please try again.';
    setTimeout(() => { successMessage.value = ''; }, 3000);
  }
  finally {
    isEditing.value = false; // Reset loading state
  }
}

// Function to close the edit metadata modal
function closeEditModal() {
  showEditModal.value = false;
  editingDocument.value = null;
}

// Function to confirm document deletion
function confirmDelete() {
  showConfirmModal.value = true;
}

// Function to delete the document
async function deleteDocument() {
  isDeleting.value = true; // Set loading state to true
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}api/v1/documents/${currentDocument.value.id}`, { headers });
    
    if (response.status === 200) {
      // Remove the document from the local state
      ['pending', 'reported', 'approved'].forEach(module => {
        documents.value[module] = documents.value[module].filter(doc => doc.id !== currentDocument.value.id);
      });
      successMessage.value = 'Document deleted successfully!';
      closeConfirmModal();
      closePreview();
      setTimeout(() => { successMessage.value = ''; }, 3000);
    }

  } catch (error) {
    console.error('Failed to delete document:', error);
    // Handle error (e.g., show error message to user)
    successMessage.value = 'Failed to delete document: Please try again later.';
    setTimeout(() => { successMessage.value = ''; }, 3000);
  }finally {
    isDeleting.value = false; // Reset loading state
  }
}

// Function to close the confirm deletion modal
function closeConfirmModal() {
  showConfirmModal.value = false;
}

onMounted(() => {
  console.log('Component mounted, fetching documents...');
  fetchDocuments();
});
  // Function to close the document preview modal
  function closePreview() {  
    showModal.value = false;  
  }  
  
  // Function to toggle dark mode
  function toggleDarkMode() {  
    document.body.classList.toggle('dark-mode', isDarkMode.value);  
  }  
  
  // Function to navigate to the next image in the preview
  function nextImage() {  
    currentImageIndex.value = (currentImageIndex.value + 1) % currentDocumentPreviewImages.value.length;  
  }  
  
  // Function to navigate to the previous image in the preview
  function prevImage() {  
    currentImageIndex.value = (currentImageIndex.value - 1 + currentDocumentPreviewImages.value.length) % currentDocumentPreviewImages.value.length;  
  } 
  
  onMounted(() => {
    console.log('Component mounted, fetching documents...');
    fetchDocuments();
  });
  </script>

  
  <style scoped>  
  /* Base styles */
  .subject-view-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  .dark-mode {
    background-color: #1a1a1a;
    color: #f5f5f5;
  }
  
  /* Page title */
  .page-title {
    text-align: center;
    margin: 20px 0 30px;
    font-size: 2.5em;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    padding-bottom: 10px;
    width: 100%;
  }
  
  .page-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #3498db;
  }
  
  /* Section title */
  .section-title {
    text-align: center;
    margin: 0 0 20px;
    font-size: 1.8em;
    color: #34495e;
    text-transform: capitalize;
    letter-spacing: 1px;
    width: 100%;
  }
  
  /* Search and filter container */
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
    box-sizing: border-box;
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
    font-size: 20px;
  }
  
  /* Dark mode switch */
  .dark-mode-switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    margin-top: 15px;
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
    font-size: 14px;
  }
  
  /* Subject section */
  .subject-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
  }
  
  /* Documents container and carousel */
  .documents-container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    padding: 0 40px;
    box-sizing: border-box;
  }
  
  .documents-carousel {
    display: flex;
    gap: 20px;
    overflow-x: hidden;
    scroll-behavior: smooth;
    width: 100%;
    padding: 10px 0;
  }
  
  /* Document card */
  .document-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    background-color: #ffffff;
    flex: 0 0 calc(25% - 15px);
    max-width: calc(25% - 15px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .document-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .document-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .doc-info {
    padding: 15px;
  }
  
  .doc-title {
    margin: 0 0 10px;
    font-size: 1.1em;
    color: #2c3e50;
    font-weight: 600;
  }
  
  .description {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 10px;
    line-height: 1.4;
  }
  
  .author {
    font-size: 0.8em;
    color: #95a5a6;
    font-style: italic;
  }
  
  /* Modal */
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
    padding: 40px;
    border-radius: 20px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .preview-images-container {
    position: relative;
    margin: 30px 0;
  }
  
  .preview-image {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
    border-radius: 10px;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(52, 152, 219, 0.8);
    color: white;
    border: none;
    padding: 15px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }
  
  .nav-button:hover {
    background: rgba(52, 152, 219, 1);
    transform: translateY(-50%) scale(1.1);
  }
  
  .nav-button.left {
    left: 20px;
  }
  
  .nav-button.right {
    right: 20px;
  }
  
  .download-btn {
    display: inline-block;
    padding: 12px 25px;
    background: #2ecc71;
    color: white;
    text-decoration: none;
    border-radius: 30px;
    margin-top: 30px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(46, 204, 113, 0.2);
  }
  
  .download-btn:hover {
    background: #27ae60;
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(46, 204, 113, 0.3);
  }
  
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #333;
    transition: color 0.3s ease, transform 0.3s ease;
  }
  
  .close-btn:hover {
    color: #e74c3c;
    transform: scale(1.1);
  }
  
  
  /* Filter options */
  .filter-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
  }
  
  .filter-select {
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid #3498db;
    background-color: white;
    color: #333;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    outline: none;
  }
  
  .filter-select:hover, .filter-select:focus {
    border-color: #2980b9;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  
  /* Carousel buttons */
  .carousel-button {
    background-color: rgba(52, 152, 219, 0.8);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .carousel-button:hover {
    background-color: rgba(52, 152, 219, 1);
    transform: translateY(-50%) scale(1.1);
  }
  
  .carousel-button.prev {
    left: 0;
  }
  
  .carousel-button.next {
    right: 0;
  }
  
  /* Responsive styles */
  @media (max-width: 1200px) {
    .document-card {
      flex: 0 0 calc(33.33% - 13.33px);
      max-width: calc(33.33% - 13.33px);
    }
  }
  
  @media (max-width: 900px) {
    .document-card {
      flex: 0 0 calc(50% - 10px);
      max-width: calc(50% - 10px);
    }
    
    .documents-container {
      padding: 0 30px;
    }
  }
  
  @media (max-width: 600px) {
    .document-card {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    .search-filter-container {
      flex-direction: column;
    }
    
    .filter-options {
      flex-direction: column;
    }
    
    .filter-select {
      width: 100%;
    }
    
    .documents-container {
      padding: 0 20px;
    }
    
    .page-title {
      font-size: 2em;
    }
    
    .section-title {
      font-size: 1.5em;
    }
  }
  
  /* Dark mode styles */
  .dark-mode .page-title {
    color: #ecf0f1;
  }
  
  .dark-mode .page-title::after {
    background-color: #3498db;
  }
  
  .dark-mode .section-title {
    color: #bdc3c7;
  }
  
  .dark-mode .search-bar {
    background-color: #2c3e50;
    color: #ecf0f1;
    border-color: #3498db;
  }
  
  .dark-mode .search-icon {
    color: #3498db;
  }
  
  .dark-mode .document-card {
    background-color: #34495e;
    border-color: #2c3e50;
  }
  
  .dark-mode .doc-title {
    color: #ecf0f1;
  }
  
  .dark-mode .description {
    color: #bdc3c7;
  }
  
  .dark-mode .author {
    color: #95a5a6;
  }
  
  .dark-mode .modal-content {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  
  .dark-mode .close-btn {
    color: #ecf0f1;
  }
  
  .dark-mode .close-btn:hover {
    color: #e74c3c;
  }
  
  .dark-mode .filter-select {
    background-color: #2c3e50;
    color: #ecf0f1;
    border-color: #3498db;
  }
  
  .dark-mode .carousel-button {
    background-color: rgba(52, 152, 219, 0.9);
  }
  
  .dark-mode .carousel-button:hover {
    background-color: rgba(52, 152, 219, 1);
  }

  /* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  color: white;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal action buttons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.download-btn {
  background-color: #2ecc71;
  color: white;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

/* Edit modal styles */
.edit-modal {
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

/* Confirm modal styles */
.confirm-modal {
  max-width: 400px;
  text-align: center;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* Dark mode styles for new elements */
.dark-mode .edit-modal,
.dark-mode .confirm-modal {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.dark-mode .form-group input,
.dark-mode .form-group textarea {
  background-color: #34495e;
  color: #ecf0f1;
  border-color: #2c3e50;
}

.dark-mode .action-btn {
  opacity: 0.9;
}

.dark-mode .action-btn:hover {
  opacity: 1;
}

.success-message {
  color: green;
  font-size: 1.2em;
  margin: 1em 0;
  padding: 1em;
  border: 1px solid green;
  background-color: #e9ffe9;
  border-radius: 5px;
  text-align: center;
}
.action-btn {
  position: relative;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6; /* Reduced opacity for disabled buttons */
}

/* Loading styles */
.loading {
  display: flex;
  align-items: center;
}

.loading span {
  margin-left: 5px; /* Space between icon and text */
}

.spinner {
  border: 3px solid #f3f3f3; /* Light gray */
  border-top: 3px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
  margin-right: 5px; /* Space between spinner and text */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Loading styles for editing */
.editing {
  display: flex;
  align-items: center;
}

.editing span {
  margin-left: 5px; /* Space between icon and text */
}

.spinner-edit {
  border: 3px solid #f3f3f3; /* Light gray */
  border-top: 3px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
  margin-right: 5px; /* Space between spinner and text */
}
  </style>