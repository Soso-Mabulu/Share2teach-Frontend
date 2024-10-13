<template>
  <div :class="['view-all-documents', { 'dark-mode': isDarkMode }]">
    <!-- Go Back Button -->
    <button class="go-back-btn" @click="goBack">Go Back</button>

    <h1 class="page-title">{{ pageTitle }}</h1>
  
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
  
    <!-- Document List -->
    <div class="documents-container">
      <div class="documents-grid">
        <div v-if="filteredDocuments.length === 0" class="no-documents">
          <p class="text-gray-500 text-lg">No documents available.</p>
        </div>
        <div 
          v-for="document in filteredDocuments" 
          :key="document.id" 
          class="document-card"
          @click="showPreview(document)"
        >
          <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="document-image" />
          <div class="doc-info">
            <h3 class="doc-title">{{ document.title }}</h3>
            <p class="description">{{ document.description }}</p>
            <p class="author">By: {{ document.author }}</p>
            <p class="category">Category: {{ document.category }}</p>
            <p class="status">Status: {{ document.status }}</p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Pagination -->
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
        <p class="status">Status: {{ currentDocument.status }}</p>
        <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
        <button class="close-btn" @click="closePreview">&times;</button>
        <!-- Rating Section -->
        <div class="rating-section">
          <label class="rating-label">Rate this document:</label>
          <div class="star-rating">
            <i 
              v-for="star in 5" 
              :key="star" 
              :class="['fa-star', selectedRating >= star ? 'fas' : 'far']"
              @click="setRating(star)"
              class="star"
            ></i>
          </div>
          <button class="submit-rating-btn" @click="submitRating">Submit Rating</button>
        </div>

        <!-- Styled Response for Ratings -->
        <div v-if="ratingMessage" class="rating-message text-center mt-4 text-lg font-semibold" :class="ratingMessageClass">
          {{ ratingMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import defaultImage from '@/assets/documentIcon.png';
  import { useRouter } from 'vue-router';
  import '@fortawesome/fontawesome-free/css/all.css';


  const router = useRouter();
  
  const route = useRoute();
  const documents = ref([]);
  const searchQuery = ref('');
  const isDarkMode = ref(false);
  const showModal = ref(false);
  const currentDocument = ref(null);
  const currentDocumentPreviewImages = ref([]);
  const currentImageIndex = ref(0);
  const selectedCategory = ref('');
  const categories = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const totalItems = ref(0);
  const selectedRating = ref('');
  const ratingMessage = ref(''); // New: Message for ratings
  const ratingMessageClass = ref('text-green-500'); // New: Styling class for rating message


  
// Inside your script setup
  const pageTitle = computed(() => {
    switch (route.name) {
      case 'ApprovedDocuments':
        return 'Approved Documents';
      case 'PendingDocuments':
        return 'Pending Documents';
      case 'ReportedDocuments':
        return 'Reported Documents';
      case 'DeniedDocuments':
        return 'Denied Documents';
      default:
        return 'Documents'; // Default title
    }
  });
  
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
  
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage);
  });
  
  const currentPreviewImage = computed(() => {
    return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
  });
  
  onMounted(() => {
    fetchDocuments();
  });
  
  watch(() => route.name, () => {
    fetchDocuments();
  });
  
  async function fetchDocuments() {
  try {
    // Try to get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    
    // If the token is not in the URL, get it from local storage
    if (!token) {
      token = localStorage.getItem('token'); // Assume token is stored under 'token' key in local storage
    }
    
    if (!token) {
      throw new Error('Token not found in URL parameters or local storage');
    }
    
    const headers = { Authorization: `Bearer ${token}` };
    console.log('Token:', token); // Debug: Log token
    console.log('Headers:', headers); // Debug: Log headers
    
    // Adjust the endpoint based on the route name
    let endpoint = '';
    switch (route.name) {
      case 'PendingDocuments':
        endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents/pending`;
        break;
      case 'ApprovedDocuments':
        endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents/approved`;
        break;
      case 'ReportedDocuments':
        endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents/reported`;
        break;
      case 'DeniedDocuments':
        endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents/denied`;
        break;
      default:
        endpoint = `${import.meta.env.VITE_API_URL}api/v1/documents`;
        break;
    }
      
    
    const response = await axios.get(endpoint, { headers });
    documents.value = mapDocuments(response.data.documents);
    totalItems.value = documents.value.length;
    categories.value = [...new Set(documents.value.map(doc => doc.category))];
    
  } catch (error) {
    if (error.response) {
      console.error('Failed to fetch documents:', error.response.data);
    } else {
      console.error('Failed to fetch documents:', error.message);
    }
  }
}

  
  function mapDocuments(docs) {
    return docs.map(doc => ({
      id: doc.id,
      title: doc.title || 'Unknown title',
      preview_image_url: doc.preview_image_url || defaultImage,
      description: doc.description || 'No description available',
      author: doc.author || 'Unknown Author',
      category: doc.category || 'Uncategorized',
      status: doc.status || (route.name === 'PendingDocuments' ? 'Pending' : 'Approved'),
      light_preview_url: doc.light_preview_url || '',
      download_url: doc.download_url || '',
    }));
  }

  // Function to set the selected rating
  function setRating(star) {
    selectedRating.value = star;
  }


  // Function to submit a rating for the current document
  
  async function submitRating() {
    if (!selectedRating.value) {
      ratingMessage.value = 'Please select a rating before submitting.';
      ratingMessageClass.value = 'text-red-500'; // Error style
    } else {
      ratingMessage.value = `Thank you for rating ${selectedRating.value} stars!`;
      ratingMessageClass.value = 'text-green-500'; // Success style
    }
    try {
      // Fetch the userId (e.g., from local storage or your auth system)
      const userId = localStorage.getItem('userId'); // Adjust as necessary to get the actual userId
      const token = localStorage.getItem('token'); // Ensure the user is authenticated

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const ratingData = {
        docId: currentDocument.value.id, // Document ID
        userId: userId,                  // User ID (from auth)
        rating: selectedRating.value      // Selected rating (1-5)
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/v1/ratings`,
        ratingData,
        { headers }
      );

      if (response.data && response.data.message) {
        alert('Rating submitted successfully.');
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        ratingMessage.value = `Error: ${error.response.data.message}`;
        ratingMessageClass.value = 'text-red-500'; // Error style
      } else {
        ratingMessage.value = 'An error occurred while submitting your rating. please try again';
        ratingMessageClass.value = 'text-red-500'; // Error style
      }
    } finally {
      // Clear the selected rating after submission
      selectedRating.value = '';
    }
  }


  function showPreview(document) {
    currentDocument.value = document;
    currentDocumentPreviewImages.value = document.light_preview_url ? document.light_preview_url.split(',') : [];
    currentImageIndex.value = 0;
    showModal.value = true;
  }
  // Function to go back to the previous page
  function goBack() {
    router.back(); // Navigate to the previous page
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
  </script>
  
  <style scoped>
  .view-all-documents {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
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
  
  .pagination button:hover {
    background-color: #2980b9;
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
  
  .download-btn {
    display: inline-block;
    padding: 10px 20px;
    background: #2ecc71;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 20px;
    transition: background-color 0.3s ease;
  }
  
  .download-btn:hover {
    background: #27ae60;
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
  background-color: #3498db;
}

.dark-mode .search-bar {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #3498db;
}

.dark-mode .search-icon {
  color: #3498db;
}

.dark-mode .category-filter {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #3498db;
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
.dark-mode .status {
  color: #bdc3c7;
}

.dark-mode .pagination button {
  background-color: #3498db;
}

.dark-mode .pagination button:hover {
  background-color: #2980b9;
}

.dark-mode .pagination button:disabled {
  background-color: #7f8c8d;
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

.dark-mode .download-btn {
  background: #27ae60;
}

.dark-mode .download-btn:hover {
  background: #2ecc71;
}
.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.rating-label {
  font-size: 18px;
  margin-bottom: 10px;
}

.star-rating {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.star {
  font-size: 2rem;
  color: #ffd700;
  padding: 0 5px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.star:hover {
  transform: scale(1.2);
}

.submit-rating-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-rating-btn:hover {
  background-color: #45a049;
}

/* Add custom styling for rating message */
.rating-message {
  transition: opacity 0.3s ease-in-out;
}



</style>