<template>
  <div :class="['moderator-dashboard', { 'dark-mode': isDarkMode }]">
    <h1>Moderator Dashboard</h1>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-bar" />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-options">
        <label class="switch">
          <input type="checkbox" v-model="filters.option1" />
          <span class="slider round"></span>
          <span class="label-text">Option 1</span>
        </label>
        <label class="switch">
          <input type="checkbox" v-model="filters.option2" />
          <span class="slider round"></span>
          <span class="label-text">Option 2</span>
        </label>
        <label class="switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
          <span class="slider round"></span>
          <span class="label-text">Dark Mode</span>
        </label>
      </div>
    </div>

    <div v-for="sectionName in ['pending', 'approved']" :key="sectionName" class="document-section">
      <h2>{{ getSectionTitle(sectionName) }}</h2>
      <div class="carousel-container">
        <button @click="prevThumbnail(sectionName)" class="nav-button left" title="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="thumbnails">
          <div 
            v-for="(document, index) in filteredDocuments[sectionName]" 
            :key="index" 
            class="thumbnail" 
            @click="showPreview(document.light_preview_url)"
          >
            <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="thumbnail-image" />
            <div class="doc-info">
              <h3 class="doc-title">{{ document.title }}</h3>
              <p class="description">{{ document.description }}</p>
              <p class="author">By: <span>{{ document.author }}</span></p>
              <p class="size">Size: <span>{{ document.fileSize }}</span></p>
              <p class="academic-year">Academic Year: <span>{{ document.academicYear }}</span></p>
              <p class="module">Module: <span>{{ document.module }}</span></p>
              <p class="category">Category: <span>{{ document.category }}</span></p>
            </div>
          </div>
        </div>
        <button @click="nextThumbnail(sectionName)" class="nav-button right" title="Next">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <button class="view-all-btn">View All</button>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <h2>Document Preview</h2>
        <iframe :src="currentDocumentPreviewUrl" class="preview-iframe"></iframe>
        <button class="close-btn" @click="closePreview">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';

const documents = ref({
  pending: [],
  approved: [],
});

const thumbnailStartIndex = ref({
  pending: 0,
  approved: 0,
});

const searchQuery = ref('');
const filters = ref({
  option1: false,
  option2: false,
});

const showModal = ref(false);
const currentDocumentPreviewUrl = ref('');
const isDarkMode = ref(false); // Dark mode state

// Fetch documents when the component is mounted
onMounted(() => {
  console.log('Component mounted, fetching documents...');
  fetchDocuments();
});

// Computed property to filter documents based on search query and filters
const filteredDocuments = computed(() => {
  const filtered = { pending: [], approved: [] };

  for (const key in documents.value) {
    if (documents.value[key]) {
      filtered[key] = documents.value[key].filter(document => {
        // Check if the document matches the search query
        const matchesQuery = document.fileName.toLowerCase().includes(searchQuery.value.toLowerCase());
        console.log(`Filtering ${key}: ${document.fileName}, matches: ${matchesQuery}`);
        return matchesQuery;
      });
    }
  }

  console.log('Filtered documents:', filtered);
  return filtered;
});

// Fetch documents from the API
async function fetchDocuments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token obtained:', token);

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch pending documents
    const pendingResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/pending`, { headers });
    documents.value.pending = pendingResponse.data.documents.map(doc => ({
      title: doc.title || 'Unknown title',
      fileName: doc.fileName || 'Unknown Document',
      preview_image_url: doc.preview_image_url || defaultImage, // Default image if not found
      description: doc.description || 'No description available',
      author: doc.author || 'Unknown Author', // Ensure author is available
      fileSize: formatFileSize(doc.fileSize || 0), // Format file size
      light_preview_url: doc.light_preview_url || '', // URL for document light preview
      documentStatus: doc.documentStatus || 'Pending', // Ensure document status is available
      academicYear: doc.academicYear || 'Unknown Year', // Ensure academic year is available
      module: doc.module || 'N/A', // Ensure module is available
      location: doc.location || 'N/A', // Ensure location is available
      category: doc.category || 'Uncategorized', // Ensure category is available
      reportingDetails: doc.reportingDetails || 'No reporting details available', // Ensure reporting details are available
    }));
    console.log('Fetched pending documents:', documents.value.pending);

    // Fetch approved documents
    const approvedResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers });
    documents.value.approved = approvedResponse.data.documents.map(doc => ({
      title: doc.title || 'Unknown title',
      fileName: doc.fileName || 'Unknown Document',
      preview_image_url: doc.preview_image_url || defaultImage, // Default image if not found
      description: doc.description || 'No description available',
      author: doc.author || 'Unknown Author', // Ensure author is available
      fileSize: formatFileSize(doc.fileSize || 0), // Format file size
      light_preview_url: doc.light_preview_url || '', // URL for document light preview
      documentStatus: doc.documentStatus || 'Approved', // Ensure document status is available
      academicYear: doc.academicYear || 'Unknown Year', // Ensure academic year is available
      module: doc.module || 'N/A', // Ensure module is available
      location: doc.location || 'N/A', // Ensure location is available
      category: doc.category || 'Uncategorized', // Ensure category is available
      reportingDetails: doc.reportingDetails || 'No reporting details available', // Ensure reporting details are available
    }));
    console.log('Fetched approved documents:', documents.value.approved);

  } catch (error) {
    console.error('Failed to fetch documents:', error.message);
  }
}

// Format file size for display
function formatFileSize(size) {
  if (size < 1024) return `${size} bytes`;
  else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / 1048576).toFixed(2)} MB`;
}


// Navigate to the next set of thumbnails
function nextThumbnail(section) {
  thumbnailStartIndex.value[section] += 1;
  if (thumbnailStartIndex.value[section] >= documents.value[section].length) {
    thumbnailStartIndex.value[section] = 0; // Loop back to the start
  }
}

// Navigate to the previous set of thumbnails
function prevThumbnail(section) {
  thumbnailStartIndex.value[section] -= 1;
  if (thumbnailStartIndex.value[section] < 0) {
    thumbnailStartIndex.value[section] = documents.value[section].length - 1; // Loop back to the end
  }
}

// Show preview modal for a document
function showPreview(url) {
  currentDocumentPreviewUrl.value = url;
  showModal.value = true;
}

// Close preview modal
function closePreview() {
  showModal.value = false;
  currentDocumentPreviewUrl.value = ''; // Reset the URL when closing
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode', isDarkMode.value);
}

// Get section title based on the section name
function getSectionTitle(section) {
  return section.charAt(0).toUpperCase() + section.slice(1) + ' Documents';
}

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.moderator-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f0f4f8;
  font-family: 'Roboto', sans-serif;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.search-filter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;
  max-width: 600px;
}

.search-bar-wrapper {
  position: relative;
  width: 100%;
}

.search-bar {
  padding: 12px 20px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  background-color: #fff;
  transition: border 0.3s;
}

.search-bar:focus {
  border-color: #3498db;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #bdc3c7;
}

.filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.switch {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.switch input {
  display: none;
}

.slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

input:checked + .slider {
  background-color: #3498db;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.label-text {
  margin-left: 10px;
  font-weight: 500;
}

.document-section {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 50px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.document-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.thumbnails {
  display: flex;
  overflow: hidden;
  flex-grow: 1;
}

.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 15px; /* Increased padding for better spacing */
  border: 1px solid #e0e0e0;
  border-radius: 12px; /* Slightly more rounded corners */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
  cursor: pointer;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0); /* Gradient background */
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
}

.thumbnail:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2); /* Increased shadow effect on hover */
}

.thumbnail-image {
  width: 120px; /* Kept the width for square shape */
  height: 120px; /* Kept the height for square shape */
  border-radius: 10px; /* More pronounced rounding */
  object-fit: cover; /* Maintains aspect ratio */
  margin-bottom: 10px; /* Increased margin for spacing */
  transition: transform 0.3s ease; /* Smooth image scaling */
}

.thumbnail-image:hover {
  transform: scale(1.05); /* Slightly enlarges the image on hover */
}


.doc-info {
  text-align: center;
  padding-top: 5px;
}

.doc-title {
  font-size: 1.2rem;
  margin: 5px 0;
  color: #2c3e50;
  font-weight: bold;
}

.description {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.author, .size {
  font-size: 0.8rem;
  color: #95a5a6;
}

.nav-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.view-all-btn {
  background: linear-gradient(135deg, #8e27ae5b, #219653);
  color: white;
  border: none;
  border-radius: 25px; /* Increased radius for more roundness */
  padding: 12px 24px; /* Adjusted padding for better spacing */
  margin: 10px auto; /* Centering the button */
  display: block; /* Ensures the margin auto centers the button */
  cursor: pointer;
  text-align: center; /* Centering text within the button */
  position: relative; /* Position for pseudo-element */
  overflow: hidden; /* Hides overflow for the hover effect */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for scaling and shadow */
}

.view-all-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 300%; /* Wider than the button */
  height: 300%; /* Higher than the button */
  background: rgba(255, 255, 255, 0.3); /* Light overlay for effect */
  border-radius: 50%; /* Circular overlay */
  transform: translate(-50%, -50%) scale(0); /* Initially hidden */
  transition: transform 0.4s ease; /* Smooth transition for the overlay */
}

.view-all-btn:hover {
  transform: scale(1.05); /* Slightly enlarges the button on hover */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Adds shadow on hover */
}

.view-all-btn:hover::before {
  transform: translate(-50%, -50%) scale(1); /* Reveals the overlay on hover */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Optional: Add a pulsing effect on load */
.view-all-btn {
  animation: pulse 2s infinite; /* Pulsing effect */
}

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
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.preview-iframe {
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 5px;
}

.close-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #c0392b;
}

/* Dark mode styles */
.dark-mode {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.dark-mode .search-bar {
  background-color: #34495e;
  color: #ecf0f1;
}

.dark-mode .search-bar:focus {
  box-shadow: 0 2px 15px rgba(255, 255, 255, 0.2);
}

.dark-mode .filter-options {
  background-color: #3a4750;
}

.dark-mode .thumbnail {
  background-color: #3a4750;
  border: 1px solid #4a6572;
}

.dark-mode .thumbnail:hover {
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
}

.dark-mode .modal-content {
  background-color: #34495e;
}

</style>
