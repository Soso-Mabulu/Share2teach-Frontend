<template>
  <div :class="['min-h-screen w-full max-w-none transition-all duration-500 ease-in-out', 
                isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 
                'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500']">
    <div class="container mx-auto px-4 py-8">
      <!-- Cosmic Toggle -->
      <div class="flex justify-center mb-8">
        <button @click="toggleDarkMode" class="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden group">
          <div :class="['absolute inset-0 transition-all duration-500 ease-in-out transform group-hover:rotate-180',
                        isDarkMode ? 'bg-indigo-900' : 'bg-yellow-300']">
            <div :class="['absolute inset-2 rounded-full transform transition-all duration-500 ease-in-out group-hover:scale-75',
                          isDarkMode ? 'bg-indigo-700' : 'bg-yellow-500']"></div>
          </div>
          <span class="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl">
            {{ isDarkMode ? '🌙' : '☀️' }}
          </span>
        </button>
      </div>

      <h1 class="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center text-white mb-8 md:mb-12 transform hover:scale-110 transition-transform duration-300 ease-in-out">
        User Dashboard
      </h1>

      <!-- Search Bar -->
      <div class="relative mb-8 md:mb-12 max-w-2xl mx-auto">
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          placeholder="Search the cosmos..." 
          class="w-full py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button @click="handleSearch" class="absolute right-2 top-2 bg-white bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-all duration-300 ease-in-out">
          🔍
        </button>
      </div>

      <!-- High Rated Documents -->
      <div class="mb-8 md:mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-white mb-6 md:mb-8">High Rated Documents</h2>
        <div class="relative">
          <button @click="scrollDocuments('left', 'highRated')" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 z-10">
            ◀
          </button>
          <div ref="highRatedScrollContainer" class="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            <div 
              v-for="(document, index) in highRatedDocuments" 
              :key="index" 
              @click="showPreview(document)"
              class="flex-shrink-0 w-64 md:w-1/4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="w-full h-40 object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-semibold text-white mb-2">{{ document.title }}</h3>
                <p class="text-sm text-gray-300 mb-2">{{ document.description }}</p>
                <p class="text-xs text-gray-400">By: {{ document.author }}</p>
                <div class="flex mt-2">
                  <span v-for="star in 5" :key="star" class="text-2xl" :class="{ 'text-yellow-400': star <= document.rating, 'text-gray-600': star > document.rating }">
                    {{ star <= document.rating ? '★' : '☆' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="scrollDocuments('right', 'highRated')" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 z-10">
            ▶
          </button>
        </div>
      </div>

      <!-- Approved Documents Section -->
      <div class="mb-8 md:mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-white mb-6 md:mb-8">Browse for Documents</h2>
        <div class="relative">
          <button @click="scrollDocuments('left', 'approved')" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 z-10">
            ◀
          </button>
          <div ref="approvedScrollContainer" class="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            <div 
              v-for="(document, index) in approvedDocuments" 
              :key="index" 
              @click="showPreview(document)"
              class="flex-shrink-0 w-64 md:w-1/4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="w-full h-40 object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-semibold text-white mb-2">{{ document.title }}</h3>
                <p class="text-sm text-gray-300 mb-2">{{ document.description }}</p>
                <p class="text-xs text-gray-400">By: {{ document.author }}</p>
                <div class="flex mt-2">
                  <span v-for="star in 5" :key="star" class="text-2xl" :class="{ 'text-yellow-400': star <= document.rating, 'text-gray-600': star > document.rating }">
                    {{ star <= document.rating ? '★' : '☆' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="scrollDocuments('right', 'approved')" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 z-10">
            ▶
          </button>
        </div>
      </div>

      <button @click="router.push({ name: '/public-user-view-all-documents?token=${token}' })" class="block mx-auto py-2 md:py-3 px-4 md:px-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white font-semibold transform hover:scale-105 transition-all duration-300 ease-in-out">
        Explore Documents
      </button>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50" @click="closePreview">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-8 max-w-2xl w-full m-4 transform transition-all duration-300 ease-in-out" @click.stop>
        <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ currentDocument.title }}</h2>
        <div class="relative mb-4">
          <img :src="currentPreviewImage" :alt="currentDocument.title" class="w-full h-48 md:h-64 object-cover rounded-lg" />
          <div class="absolute inset-0 flex items-center justify-between">
            <button @click="prevImage" class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transform transition-all duration-300 ease-in-out hover:scale-110">
              ◀
            </button>
            <button @click="nextImage" class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transform transition-all duration-300 ease-in-out hover:scale-110">
              ▶
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ currentImageIndex + 1 }} / {{ currentDocumentPreviewImages.length }}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">{{ currentDocument.description }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">By: {{ currentDocument.author }}</p>
        <div class="flex flex-col sm:flex-row justify-between">
          <a :href="currentDocument.download_url" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out mb-2 sm:mb-0 text-center">
            Download Full Document
          </a>
          <button @click="closePreview" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out">
            Close
          </button>
        </div>
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
        <label id="report-success-message" class="text-center font-semibold" style="display: none; color: green; margin-top: 10px;"></label>

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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';

const router = useRouter();
const highRatedDocuments = ref([]);
const approvedDocuments = ref([]);
const ratings = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const defaultImage = '/api/placeholder/400/320';
const highRatedScrollContainer = ref(null);
const approvedScrollContainer = ref(null);

const selectedRating = ref('');
const ratingMessage = ref(''); // New: Message for ratings
const ratingMessageClass = ref('text-green-500'); // New: Styling class for rating message
// Report popup state
const showReportPopup = ref(false);
const reportReason = ref('');


const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});

onMounted(() => {
  fetchRatings();
  fetchApprovedDocuments();
  initializeDarkMode();
});

watch(isDarkMode, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue);
});

async function fetchRatings() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const ratingsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/ratings`, { headers });
    ratings.value = ratingsResponse.data;

    const highRatedIds = ratings.value
      .filter(rating => rating.rating > 3)
      .map(rating => rating.docId);

    await fetchHighRatedDocuments(highRatedIds, headers);
  } catch (error) {
    console.error('Failed to fetch ratings:', error.message);
  }
}

async function fetchHighRatedDocuments(ids, headers) {
  try {
    const documentPromises = ids.map(async (id) => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/${id}`, { headers });

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

async function fetchApprovedDocuments() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, { headers });

    if (response.data && response.data.status === 'success') {
      approvedDocuments.value = response.data.documents.map((doc) => mapDocument(doc));
    } else {
      console.error('Failed to fetch approved documents:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch approved documents:', error.message);
  }
}

function mapDocument(doc) {
  const documentId = doc.id || doc.docId;
  const documentRating = ratings.value.find(rating => rating.docId === documentId);

  return {
    docId: doc.id || doc.docId || null,
    id: documentId,
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    light_preview_url: doc.light_preview_url || '',
    download_url: doc.location || '',
    rating: documentRating ? documentRating.rating : 0 
  };
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

    console.log('Submitting report:', reportData);

    const response = await axios.post(`${import.meta.env.VITE_API_URL}api/v1/report`, reportData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Check if the response is successful
    if (response.status === 200 || response.status === 201) {
      console.log('Report submitted:', response.data);

      // Display success message
      const successLabel = document.getElementById('report-success-message');
      if (successLabel) {
        successLabel.innerText = 'Report submitted successfully.';
        successLabel.style.color = 'green'; // Set success color
        successLabel.style.display = 'block';

        // Hide the success message after a few seconds
        setTimeout(() => {
          successLabel.style.display = 'none';
        }, 3000);
      }

      // Close the modal after successful report
      closeReportPopup();

      return; // Exit the function early since it was successful
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    console.error('Error reporting document:', error);

    // Handle different error formats
    const response = error.response;

    if (response) {
      const { status, statusText, data } = response;
      const readyState = error.request.readyState;
      const responseText = error.request.responseText;

      // Show detailed error message using an alert
      alert(`
        Error: ${status} ${statusText}
        Ready State: ${readyState}
        Response Text: ${responseText || data.message || 'Unknown error'}
      `);

      // Show the error message on successLabel
      const successLabel = document.getElementById('report-success-message');
      if (successLabel) {
        successLabel.innerText = `
          Error: ${status} ${statusText}
          Response: ${responseText || data.message || 'Unknown error'}
        `;
        successLabel.style.color = 'red'; // Set error color
        successLabel.style.display = 'block';

        // Hide the error message after a few seconds
        setTimeout(() => {
          successLabel.style.display = 'none';
        }, 5000);
      }
    } else {
      // For network or other non-HTTP errors
      alert('An unexpected error occurred. Please try again.');

      const successLabel = document.getElementById('report-success-message');
      if (successLabel) {
        successLabel.innerText = 'An unexpected error occurred. Please try again.';
        successLabel.style.color = 'red'; 
        successLabel.style.display = 'block';

        setTimeout(() => {
          successLabel.style.display = 'none';
        }, 5000);
      }
    }
  }
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
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value.toString());
}

function initializeDarkMode() {
  const darkModePreference = localStorage.getItem('darkMode');
  isDarkMode.value = darkModePreference === 'true';
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

function scrollDocuments(direction, section) {
  const container = section === 'highRated' ? highRatedScrollContainer.value : approvedScrollContainer.value;
  if (container) {
    const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .container {
    padding-top: 4rem;
  }

  .hero-container {
    padding: 2rem;
  }

  .flex-shrink-0 {
    width: 16rem;
  }
}

@media (max-width: 767px) {
  .flex-shrink-0 {
    width: calc(100% - 1.5rem);
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