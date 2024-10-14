<template>
    <div :class="['subject-view-page', { 'dark-mode': isDarkMode }]">
      <h1 class="page-title"> Educator Subject View Page</h1>
  
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
        <button class="view-all-btn" @click="viewAllDocuments(module)">View All {{ module }} Documents</button>
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
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import defaultImage from '@/assets/documentIcon.png';
  
  // Initialize reactive references
  const documents = ref({
    approved: [],
  });
  const searchQuery = ref('');
  const isDarkMode = ref(false);
  const showModal = ref(false);
  const currentDocument = ref(null);
  const currentDocumentPreviewImages = ref([]);
  const currentImageIndex = ref(0);
  const router = useRouter();
  const modules = ref(['approved']);
  
  // New reactive references for filters and carousel
  const selectedCategory = ref('');
  const selectedModule = ref('');
  const selectedUniversity = ref('');
  const carouselPositions = ref({});
  
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
      try {  
          // Retrieve token from local storage
          const token = localStorage.getItem('token');  
          const headers = { Authorization: `Bearer ${token}` };  
          
          console.log('Token retrieved:', token); // Log the retrieved token
          
          // Fetch documents from all endpoints
          const responses = await Promise.allSettled([

              axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers })
          ]);
  
          // Store documents organized by module
          documents.value.approved = [];
  
          // Process each response
          responses.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                  // If the request was successful, map the documents
                  const documentsData = mapDocuments(result.value.data.documents || []);
                          documents.value.approved = documentsData;
    
                  }
               else {
                  // If the request failed, log the error
                  console.error(`Failed to fetch documents from endpoint ${index}:`, result.reason);
              }
          });
  
          console.log('Documents stored:', documents.value); // Log the stored documents
          
      } catch (error) {  
          console.error('An unexpected error occurred:', error.message);
          console.error('Error details:', error.response ? error.response.data : error);
      }  
  }
  
  
  // Function to map document data to the desired structure
  function mapDocuments(docs) {
    return docs.map(doc => ({
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
  
  // Function to show the document preview modal
  function showPreview(document) {
      currentDocument.value = document;
      currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
      currentImageIndex.value = 0;
      showModal.value = true;
    }
  
  const currentPreviewImage = computed(() => {
    return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
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
  
  // Function to navigate to all documents by module
  function viewAllDocuments(module) {
    router.push({ name: 'EducatorAllApprovedDocumentsView', params: { module } });
  }
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
    z-index: -1;
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
  
  /* View all button */
  .view-all-btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 4px rgba(50, 50, 93, 0.1);
    margin-top: 30px;
  }
  
  .view-all-btn:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1);
  }
  
  
  .view-all-btn:active {
    transform: translateY(1px);
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
  </style>