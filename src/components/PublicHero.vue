<!-- eslint-disable vue/no-unused-vars -->
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

    <!-- Search Bar -->
    <div class="search-bar">
      <div class="search-icon">
        <img src="https://via.placeholder.com/20" alt="Search" />
      </div>
      <input
        type="text"
        placeholder="Search documents..."
        v-model="searchQuery"
      />
      <button class="search-button">Search</button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <select v-model="selectedModule">
        <option value="">Select Module</option>
        <option value="module1">Module 1</option>
        <option value="module2">Module 2</option>
      </select>
      <select v-model="selectedYear">
        <option value="">Select Year</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
      </select>
      <select v-model="selectedUniversity">
        <option value="">Select University</option>
        <option value="uni1">University 1</option>
        <option value="uni2">University 2</option>
      </select>
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

    console.log('Fetched approved documents:', approvedDocuments.value);

    // Set recent documents
    recentDocuments.value = approvedDocuments.value.slice(0, 5); // Example: first 5 approved documents

  } catch (error) {
    console.error('Failed to fetch documents:', error.message);
  }
}

// Filtering logic based on search query and selected filters
const searchQuery = ref('');
const selectedModule = ref('');
const selectedYear = ref('');
const selectedUniversity = ref('');
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

/* Increased font size for section titles */
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

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ccc; /* Grey border */
  border-radius: 5px;
  overflow: hidden;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: none; /* Remove default border */
  outline: none; /* Remove outline on focus */
  background-color: inherit; /* Match background color */
  color: inherit; /* Match text color */
}

.search-icon {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1; /* Light background for icon */
}

.search-icon img {
  width: 20px; /* Size of the icon */
  height: 20px;
}

.search-button {
  padding: 10px 20px;
  background-color: #6200ea; /* Purple button color */
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3700b3; /* Darker purple on hover */
}

/* Filters */
.filters {
  margin-bottom: 20px;
}

.filters select {
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc; /* Grey border */
  border-radius: 5px;
}

/* Carousel */
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
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow effect */
  width: 200px; /* Fixed width */
  text-align: center; /* Center text */
}

.document img {
  width: 100%; /* Full width */
  border-radius: 4px; /* Rounded corners */
}

.document-title {
  font-size: 20px; /* Increased font size */
  margin: 10px 0; /* Space above and below title */
  color: #333; /* Title color */
}

.ratings {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stars {
  color: gold; /* Gold color for stars */
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
  margin-top: 20px; /* Space above recent documents */
}

.document-list {
  display: flex;
  flex-wrap: wrap; /* Wrap to next line if necessary */
}

.document-list .document {
  margin: 10px; /* Space between recent document cards */
}
</style>

