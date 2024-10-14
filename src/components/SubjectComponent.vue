<template>
  <div :class="['subject-view-page', { 'dark-mode': isDarkMode }]">
    <h1 class="page-title">Subject View Page</h1>

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
      <div class="dark-mode-switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" id="darkModeToggle" />
        <label for="darkModeToggle" class="toggle-slider"></label>
        <span class="toggle-label">Dark Mode</span>
      </div>
    </div>

    <div v-for="module in modules" :key="module" class="subject-section">
      <h2 class="section-title">{{ module }}</h2>
      <div class="documents-container">
        <button @click="prevSlide(module)" class="carousel-button prev" aria-label="Previous slide">
          <i class="fas fa-chevron-left"></i>
        </button>
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
        <button @click="nextSlide(module)" class="carousel-button next" aria-label="Next slide">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <button class="view-all-btn" @click="viewAllDocuments(module)">View All {{ module }} Documents</button>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <h2>{{ currentDocument.title }}</h2>
        <div class="preview-images-container">
          <button @click="prevImage" class="nav-button left" aria-label="Previous image">
            <i class="fas fa-chevron-left"></i>
          </button>
          <img :src="currentPreviewImage" alt="Preview" class="preview-image" />
          <button @click="nextImage" class="nav-button right" aria-label="Next image">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <p class="image-counter">{{ currentImageIndex + 1 }} / {{ currentDocumentPreviewImages.length }}</p>
        <p class="description">{{ currentDocument.description }}</p>
        <p class="author">By: {{ currentDocument.author }}</p>
        <p class="category">Category: {{ currentDocument.category }}</p>
        <p class="university">University: {{ currentDocument.university }}</p>
        <a :href="currentDocument.download_url" class="download-btn" download>Download Full Document</a>
        <button class="close-btn" @click="closePreview" aria-label="Close preview">
          <i class="fas fa-times"></i>
        </button>
        <!-- Rating Section -->
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

        <!-- Report Button -->
        <button class="report-btn" @click="openReportPopup">Report Document</button>
        <!-- Label for success message -->
        <label id="report-success-message text-center font-semibold " style="display: none; color: green; margin-top: 10px;"></label>

        <!-- Report Popup -->
        <div v-if="showReportPopup" class="report-popup-overlay" @click="closeReportPopup">
        <div class="report-popup-content" @click.stop>
          <h3>Report Document</h3>
          <textarea v-model="reportReason" placeholder="Enter reason for reporting this document" class="report-textarea"></textarea>
          <button class="submit-report-btn" @click="submitReport">Submit Report</button>
          <button class="cancel-report-btn" @click="closeReportPopup">Cancel</button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';
import '@fortawesome/fontawesome-free/css/all.css';

// Initialize reactive references
const documents = ref({
  pending: [],
  reported: [],
  approved: [],
  denied: [],
});
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const router = useRouter();
const modules = ref(['pending', 'reported', 'approved','denied']);

// New reactive references for filters and carousel
const selectedCategory = ref('');
const selectedModule = ref('');
const selectedUniversity = ref('');
const carouselPositions = ref({});
const itemsPerPage = ref(4); // Default to 4, dynamically adjust later
const selectedRating = ref('');
const ratingMessage = ref(''); // New: Message for ratings
const ratingMessageClass = ref('text-green-500'); // New: Styling class for rating message
// Report popup state
const showReportPopup = ref(false);
const reportReason = ref('');


// Update the number of items per page based on the screen size
const updateItemsPerPage = () => {
  if (window.innerWidth <= 768) {
    itemsPerPage.value = 2; // Show 1 document on small screens
  } else if (window.innerWidth <= 1024) {
    itemsPerPage.value = 2; // Show 2 documents on medium screens
  } else {
    itemsPerPage.value = 4; // Show 4 documents on large screens
  }
};

// Watch for window resize to update the items per page
onMounted(() => {
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerPage);
});


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

// Function to get visible documents for each module based on screen size
const visibleDocuments = (module) => {
  const start = carouselPositions.value[module] || 0;
  return filteredDocuments.value[module].slice(start, start + itemsPerPage.value);
};
// Carousel navigation functions
const nextSlide = (module) => {
  const moduleDocuments = filteredDocuments.value[module];
  carouselPositions.value[module] = Math.min(
    (carouselPositions.value[module] || 0) + 1,
    moduleDocuments.length - 4
  );
};

const prevSlide = (module) => {
  carouselPositions.value[module] = Math.max(
    (carouselPositions.value[module] || 0) - 1,
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
            axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/pending`, { headers }),
            axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/reported`, { headers }),
            axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers }),
            axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/denied`, { headers }),
        ]);

        // Store documents organized by module
        documents.value.pending = [];
        documents.value.reported = [];
        documents.value.approved = [];
        documents.value.denied = [];

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
                    case 3:
                        documents.value.denied = documentsData;
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
}

function setRating(star) {
  selectedRating.value = star;
}


function decodeToken(token) {
  // Split the token into parts (Header, Payload, Signature)
  const tokenParts = token.split('.');
  
  if (tokenParts.length !== 3) {
    throw new Error('Invalid token format');
  }

  // Decode the payload (2nd part of the token)
  const base64Url = tokenParts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Convert the Base64-encoded payload to a JSON string
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  // Parse the JSON string to get the actual object
  return JSON.parse(jsonPayload);
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
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      throw new Error('User not authenticated');
    }

    // Decode the token to extract the payload manually
    const decodedToken = decodeToken(token);

    // Assuming the token contains user_id in the payload
    const userId = decodedToken.id;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    console.log('Extracted userId:', userId);

    const ratingData = {
      docId: currentDocument.value.docId, // Document ID
      userId: userId,                  // User ID (from auth)
      rating: selectedRating.value      // Selected rating (1-5)
    };

    console.log('Submitting rating:', ratingData);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}api/v1/ratings`,  // Ensure this URL is correct
      ratingData,
    );
    console.log('Rating submitted:', response.data);
    
    if (response.data && response.data.message) {
      ratingMessage.value = 'Rating submitted successfully.';
      ratingMessageClass.value = 'text-green-500'; // Success style
    }

  } catch (error) {
    // Extracting error message more effectively
    let errorMessage = 'An unexpected error occurred.';

    if (error.response) {
      // Check if error response has a data object
      if (error.response.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error; // Use the error key for the message
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message; // Fallback to message if error key is not available
        }
      }
      
      // Specific check for the duplicate rating error
      if (errorMessage === "You cannot rate the same document more than once") {
        ratingMessage.value = 'You have already rated this document. Thank you!';
      } else {
        ratingMessage.value = `Error: ${errorMessage}`;
      }

      ratingMessageClass.value = 'text-red-500'; // Error style
      console.log('Rating submission error:', errorMessage);
      console.error('Error details:', error.response.data);

    } else {
      ratingMessage.value = 'An error occurred while submitting your rating. Please try again.';
      ratingMessageClass.value = 'text-red-500'; // Error style
      console.error('An unexpected error occurred:', error.message);
    }
  } finally {
    // Clear the selected rating after submission
    selectedRating.value = '';
  }
}


// Open and close report popup
function openReportPopup() {
  showReportPopup.value = true;
}

function closeReportPopup() {
  showReportPopup.value = false;
  reportReason.value = ''; // Clear the reason after closing
}

// Submit the report
async function submitReport() {
  if (!reportReason.value) {
    alert('Please provide a reason for reporting.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const decodedToken = decodeToken(token); // Assuming the decodeToken method is available
    const userId = decodedToken.id;

    const reportData = {
      docId: currentDocument.value.docId,  // Document ID from the current document
      userId: userId,                      // User ID from the decoded token
      reporting_details: reportReason.value // The report reason from the textarea
    };

    const response = await axios.post(`${import.meta.env.VITE_API_URL}api/v1/report`, reportData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.message) {
        // Show success message using label instead of alert
        const successLabel = document.getElementById('report-success-message');
        successLabel.innerText = 'Report submitted successfully.';
        successLabel.style.display = 'block'; // Show the success message

        // Optionally hide the label after a few seconds
        setTimeout(() => {
          successLabel.style.display = 'none';
        }, 3000);

        closeReportPopup(); // You can remove this if you don't want to close the modal immediately
      }
  } catch (error) {
    console.error('Error reporting document:', error);
    alert('Failed to report the document. Please try again.');
  }
}



// Function to map document data to the desired structure
function mapDocuments(docs) {
  return docs.map(doc => ({
    docId: doc.id || doc.docId || null,
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
  const token = localStorage.getItem('token');  
  const routeName = `${module.charAt(0).toUpperCase() + module.slice(1)}Documents`; // Converts module to the route name format
  router.push({ name: routeName, query: { token } });
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
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

/* Page title */
.page-title {
  text-align: center;
  margin: 20px 0 30px;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
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
  font-size: clamp(1.4rem, 3vw, 1.8rem);
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
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

.author, .category, .university {
  font-size: 0.8em;
  color: #95a5a6;
  margin-bottom: 5px;
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

.image-counter {
  text-align: center;
  margin-top: 10px;
  font-size: 0.9em;
  color: #7f8c8d;
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
  flex: 1 1 auto;
  min-width: 120px;
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
  .subject-view-page {
    padding: 10px;
  }

  .search-filter-container {
    max-width: 100%;
  }

  .document-card {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .documents-container {
    padding: 0 10px;
  }
  
  .carousel-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .modal-content {
    padding: 20px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .download-btn {
    width: 100%;
    text-align: center;
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

.dark-mode .author, .dark-mode .category, .dark-mode .university {
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

/* Accessibility improvements */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus styles for better keyboard navigation */
.search-bar:focus,
.filter-select:focus,
.document-card:focus,
.view-all-btn:focus,
.carousel-button:focus,
.nav-button:focus,
.download-btn:focus,
.close-btn:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

.dark-mode .search-bar:focus,
.dark-mode .filter-select:focus,
.dark-mode .document-card:focus,
.dark-mode .view-all-btn:focus,
.dark-mode .carousel-button:focus,
.dark-mode .nav-button:focus,
.dark-mode .download-btn:focus,
.dark-mode .close-btn:focus {
  outline-color: #ecf0f1;
}
/* Updated and new responsive styles */
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

  .search-filter-container {
    background-color: rgba(52, 152, 219, 0.1);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .dark-mode .search-filter-container {
    background-color: rgba(52, 152, 219, 0.2);
  }
}

@media (max-width: 600px) {
  .subject-view-page {
    padding: 10px;
  }

  .search-filter-container {
    max-width: 100%;
  }

  .document-card {
    flex: 0 0 calc(50% - 10px);
    max-width: calc(50% - 10px);
    margin-bottom: 20px;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .documents-container {
    padding: 0 10px;
  }
  
  .carousel-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
    background-color: rgba(52, 152, 219, 0.9);
  }

  .modal-content {
    padding: 20px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .download-btn {
    width: 100%;
    text-align: center;
  }

  /* Creative additions for small screens */
  .document-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .document-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(52, 152, 219, 0.5), rgba(46, 204, 113, 0.5));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .document-card:hover::before {
    opacity: 1;
  }

  .document-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .doc-info {
    position: relative;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.9);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    transform: translateY(70%);
    transition: transform 0.3s ease;
  }

  .document-card:hover .doc-info {
    transform: translateY(0);
  }

  .dark-mode .doc-info {
    background-color: rgba(44, 62, 80, 0.9);
  }

  .section-title {
    position: relative;
    display: inline-block;
    padding: 0 10px;
  }

  .section-title::before,
  .section-title::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30px;
    height: 2px;
    background-color: #3498db;
  }

  .section-title::before {
    left: -40px;
  }

  .section-title::after {
    right: -40px;
  }

  .dark-mode .section-title::before,
  .dark-mode .section-title::after {
    background-color: #ecf0f1;
  }

  .view-all-btn {
    position: relative;
    overflow: hidden;
  }

  .view-all-btn::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: scale(0);
    transition: transform 0.6s ease-out;
  }

  .view-all-btn:hover::before {
    transform: scale(1);
  }
}

@media (max-width: 400px) {
  .document-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .doc-info {
    transform: translateY(0);
  }
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

.report-btn {
  margin: 10px auto;
  display: block;
  background-color: #f0f0f0;
  color: #333;
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.report-btn:hover {
  background-color: #ddd;
}

/* Modal Overlay */
.report-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.report-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* Soft shadow for better visibility */
  max-width: 400px;
  width: 100%;
  text-align: center; /* Center the content */
  transition: transform 0.3s ease;
}

.report-popup-content h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

/* Textarea for input */
.report-textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px; /* Rounded corners for textarea */
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none; /* Disable resizing for a cleaner look */
}

/* Buttons for submit/cancel */
.submit-report-btn,
.cancel-report-btn {
  margin-top: 15px;
  padding: 10px;
  border-radius: 20px; /* Rounded buttons */
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.submit-report-btn {
  background-color: #4caf50;
  color: white;
}

.submit-report-btn:hover {
  background-color: #45a049;
}

.cancel-report-btn {
  background-color: #f44336;
  color: white;
}

.cancel-report-btn:hover {
  background-color: #e53935;
}

</style>