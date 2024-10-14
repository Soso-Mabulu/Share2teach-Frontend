<template>
  <div :class="['moderator-dashboard', { 'dark-mode': isDarkMode }]">
    <h1 class="dashboard-title">Moderator Dashboard</h1>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input type="text" v-model="searchQuery" placeholder="Search documents..." class="search-bar" />
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

    <div v-for="sectionName in ['pending', 'approved']" :key="sectionName" class="document-section">
      <h2 class="section-title">{{ getSectionTitle(sectionName) }}</h2>
      <div class="documents-container">
        <div class="documents-grid">
            <div 
              v-for="(document, index) in limitedDocuments[sectionName]" 
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
      <button class="view-all-btn"  @click="viewAllDocuments(sectionName)">View All {{ sectionName }} Documents</button>
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
      <label id="report-success-message" class=" text-center font-semibold " style="display: none; color: green; margin-top: 10px;"></label>

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
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router'; // Import the router
  import axios from 'axios';
  import defaultImage from '@/assets/documentIcon.png';
  import '@fortawesome/fontawesome-free/css/all.css';

  const documents = ref({
    pending: [],
    approved: [],
  });

  const searchQuery = ref('');
  const isDarkMode = ref(false);
  const showModal = ref(false);
  const currentDocument = ref(null);
  const currentDocumentPreviewImages = ref([]);
  const currentImageIndex = ref(0);
  const router = useRouter(); // Initialize router
  const selectedRating = ref('');
  const ratingMessage = ref(''); // New: Message for ratings
  const ratingMessageClass = ref('text-green-500'); // New: Styling class for rating message
  // Report popup state
  const showReportPopup = ref(false);
  const reportReason = ref('');


  onMounted(() => {
    console.log('Component mounted, fetching documents...');
    fetchDocuments();
  });

  const filteredDocuments = computed(() => {
    const filtered = { pending: [], approved: [] };
    for (const key in documents.value) {
      filtered[key] = documents.value[key].filter(document => 
        document.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        document.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    return filtered;
  });

  const limitedDocuments = computed(() => {
    const limited = { pending: [], approved: [] };
    for (const key in filteredDocuments.value) {
      limited[key] = filteredDocuments.value[key].slice(0, 4);
    }
    return limited;
  });

  function viewAllDocuments(sectionName) {
    if (sectionName === 'pending') {
      router.push({ name: 'PendingDocuments' });
    } else if (sectionName === 'approved') {
      router.push({ name: 'ApprovedDocuments' });
    }
  }

  async function fetchDocuments() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const pendingResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/pending`, { headers });
      const approvedResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers });

      documents.value.pending = mapDocuments(pendingResponse.data.documents);
      documents.value.approved = mapDocuments(approvedResponse.data.documents);

    } catch (error) {
      console.error('Failed to fetch documents:', error.message);
    }
  }

  function mapDocuments(docs) {
    return docs.map(doc => ({
      docId: doc.id || doc.docId || null,
      title: doc.title || 'Unknown title',
      preview_image_url: doc.preview_image_url || defaultImage,
      description: doc.description || 'No description available',
      author: doc.author || 'Unknown Author',
      light_preview_url: doc.light_preview_url || '',
      download_url: doc.location || '',
    }));
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
  const currentPreviewImage = computed(() => {
      return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
    });
  function closePreview() {
    showModal.value = false;
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode', isDarkMode.value);
  }

  function getSectionTitle(section) {
    return section.charAt(0).toUpperCase() + section.slice(1) + ' Documents';
  }

  function nextImage() {
    currentImageIndex.value = (currentImageIndex.value + 1) % currentDocumentPreviewImages.value.length;
  }

  function prevImage() {
    currentImageIndex.value = (currentImageIndex.value - 1 + currentDocumentPreviewImages.value.length) % currentDocumentPreviewImages.value.length;
  }
</script>


<style scoped>
.moderator-dashboard {
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
  position: relative;
  padding-bottom: 10px;
}

.dashboard-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: #3498db;
}

.section-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.8em;
  color: #34495e;
  text-transform: capitalize;
  letter-spacing: 1px;
}

.search-filter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 600px;
  position: relative; /* or absolute */
  z-index: 1; /* Ensure this is lower than the navbar */
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

.document-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
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

.description {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.author {
  font-size: 0.8em;
  color: #95a5a6;
}

.view-all-btn {
  display: inline-block;
  padding: 12px 24px;
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
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.view-all-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.view-all-btn:active {
  transform: translateY(1px);
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
.dark-mode .dashboard-title {
  color: #ecf0f1;
}

.dark-mode .dashboard-title::after {
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