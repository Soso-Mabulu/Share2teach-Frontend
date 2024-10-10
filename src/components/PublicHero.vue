<template>
  <div :class="['hero', { 'dark-mode': isDarkMode }]">
    <h1>Welcome to your dashboard!</h1>

    <!-- Light/Dark Mode Switch -->
    <div class="mode-switch">
      <label class="switch">
        <input type="checkbox" v-model="isDarkMode" />
        <span class="slider">
          <i v-if="isDarkMode" class="moon-icon">🌙</i>
          <i v-if="!isDarkMode" class="sun-icon">☀️</i>
        </span>
      </label>
    </div>

    <!-- Carousel for High Rated Documents -->
    <h2>High Rated Documents</h2>
    <div class="carousel">
      <div class="carousel-controls left">
        <button class="carousel-button" @click="prevSlide" :disabled="currentIndex === 0">&#60;</button>
      </div>
      <div class="documents-container">
        <div
          class="document"
          v-for="(document, index) in displayedDocuments"
          :key="document.id"
        >
          <img :src="document.preview_image_url" :alt="document.title" />
          <h3 class="document-title">{{ document.title }}</h3>
          <p class="document-description">{{ document.description }}</p>
          <div class="ratings">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ document.ratingValue }}</span>
          </div>
        </div>
      </div>
      <div class="carousel-controls right">
        <button class="carousel-button" @click="nextSlide" :disabled="currentIndex + displayCount >= approvedDocuments.length">&#62;</button>
      </div>
    </div>

    <!-- Recent Documents Section -->
    <div class="recent-documents">
      <h2>Recent Documents</h2>
      <div class="document-list">
        <div class="document" v-for="document in recentDocuments" :key="document.id">
          <img :src="document.preview_image_url" :alt="document.title" />
          <h3 class="document-title">{{ document.title }}</h3>
          <div class="ratings">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ document.ratingValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import defaultImage from '@/assets/documentIcon.png';

const isDarkMode = ref(false); // State for dark mode
const approvedDocuments = ref([]);
const recentDocuments = ref([]);

// Fetch documents when the component is mounted
onMounted(() => {
  fetchDocuments();
});

// Fetch approved documents from the API
async function fetchDocuments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch approved documents
    const approvedResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/documents/approved`, { headers });
    approvedDocuments.value = approvedResponse.data.documents.map(doc => ({
      title: doc.title || 'Unknown title',
      fileName: doc.fileName || 'Unknown Document',
      preview_image_url: doc.preview_image_url || defaultImage,
      description: doc.description || 'No description available',
      rating: doc.rating || 'N/A',
      ratingValue: doc.ratingValue || 'No Rating Value',
    }));

    // Set recent documents
    recentDocuments.value = approvedDocuments.value.slice(0, 5); // Example: first 5 approved documents

  } catch (error) {
    console.error('Failed to fetch documents:', error.message);
  }
}

// Filtering logic based on search query and selected filters
const displayCount = 4; // Number of documents to display at a time
const currentIndex = ref(0); // Current index for the displayed documents

const displayedDocuments = computed(() => {
  return approvedDocuments.value.slice(currentIndex.value, currentIndex.value + displayCount);
});

const nextSlide = () => {
  if (currentIndex.value + displayCount < approvedDocuments.value.length) {
    currentIndex.value += displayCount;
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= displayCount;
  }
};
</script>

<style scoped>
.hero {
  margin-top: 60px;
  padding: 20px;
  background-color: var(--color-bg-light);
  min-height: calc(100vh - 60px);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.dark-mode {
  background-color: #121212; /* Dark mode background */
  color: white; /* Light text color */
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--color-text-dark);
}

h2 {
  font-size: 24px; /* Increased font size for section titles */
  margin-bottom: 15px; /* Space below titles */
  color: #333; /* Title color */
}

/* Mode Switch */
.mode-switch {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; /* Default switch color */
  transition: .4s;
  border-radius: 34px; /* Rounded corners */
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background-color: white; /* Circle color */
  transition: .4s;
  border-radius: 50%; /* Circle shape */
}

input:checked + .slider {
  background-color: #6200ea; /* Color when checked */
}

input:checked + .slider:before {
  transform: translateX(30px); /* Move circle to the right */
}

/* Icons */
.moon-icon,
.sun-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px; /* Icon size */
}

.moon-icon {
  left: 8px; /* Position for moon icon */
}

.sun-icon {
  right: 8px; /* Position for sun icon */
}

/* Carousel Styles */
.carousel {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.documents-container {
  display: flex;
  overflow-x: auto; /* Allow horizontal scrolling */
}

.document {
  margin: 0 10px; /* Space between cards */
  padding: 10px; /* Consistent padding for cards */
  background-color: white; /* Background for document cards */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  width: 250px; /* Fixed width for rectangular cards */
  height: 180px; /* Fixed height for rectangular cards */
  text-align: center; /* Center text */
}

.document img {
  width: 80px; /* Set consistent width for images */
  height: 80px; /* Set consistent height for images */
  object-fit: cover; /* Cover to maintain aspect ratio */
  margin-bottom: 10px; /* Space below the image */
}

.document-title {
  font-size: 20px; /* Increased font size for document title */
  margin: 10px 0; /* Space above and below title */
  color: #333; /* Title color */
}

.document-description {
  font-size: 12px; /* Smaller font for description */
  color: #666; /* Grey color for description text */
  margin-bottom: 10px; /* Space below the description */
}

/* Ratings */
.ratings {
  display: flex;
  align-items: center;
  justify-content: center; /* Center ratings */
}

.stars {
  color: gold; /* Color for stars */
}

.rating-value {
  margin-left: 5px; /* Space between stars and rating value */
  color: #666; /* Grey color for rating value */
}

/* Carousel Controls */
.carousel-controls {
  display: flex;
}

.carousel-button {
  padding: 10px;
  background-color: #6200ea; /* Button color */
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 5px; /* Rounded corners */
}

.carousel-button:hover {
  background-color: #3700b3; /* Darker color on hover */
}

.carousel-controls.left {
  margin-right: 10px; /* Space on the right */
}

.carousel-controls.right {
  margin-left: 10px; /* Space on the left */
}

/* Recent Documents */
.recent-documents {
  margin-top: 30px; /* Space above the section */
}

.document-list {
  display: flex;
  flex-wrap: wrap; /* Wrap document cards */
  gap: 10px; /* Space between cards */
}

</style>
