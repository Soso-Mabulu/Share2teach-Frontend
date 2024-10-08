<template>
  <div class="hero">
    <h1>Welcome to your dashboard!</h1>

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
        <button @click="prevSlide" :disabled="currentIndex === 0">&#60;</button>
      </div>
      <div class="documents-container">
        <div
          class="document"
          v-for="(document) in displayedDocuments"
          :key="document.id"
        >
          <img :src="document.image" :alt="document.title" />
          <h3>{{ document.title }}</h3>
          <p>{{ document.description }}</p>
          <div class="ratings">
            <span>{{ document.rating }}</span> {{ document.ratingValue }}
          </div>
        </div>
      </div>
      <div class="carousel-controls right">
        <button @click="nextSlide" :disabled="currentIndex + displayCount >= highRatedDocuments.length">&#62;</button>
      </div>
    </div>

    <!-- Recent Documents Section -->
    <div class="recent-documents">
      <h2>Recent Documents</h2>
      <div class="document-list">
        <div class="document" v-for="document in recentDocuments" :key="document.id">
          <img :src="document.image" :alt="document.title" />
          <h3>{{ document.title }}</h3>
          <div class="ratings">
            <span>{{ document.rating }}</span> {{ document.ratingValue }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedModule = ref('');
const selectedYear = ref('');
const selectedUniversity = ref('');
const displayCount = 4; // Number of documents to display at a time
const currentIndex = ref(0); // Current index for the displayed documents

const highRatedDocuments = ref([
  { id: 1, image: 'https://via.placeholder.com/200x120', title: 'Document Title 1', description: 'Short description of document 1.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 2, image: 'https://via.placeholder.com/200x120', title: 'Document Title 2', description: 'Short description of document 2.', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 3, image: 'https://via.placeholder.com/200x120', title: 'Document Title 3', description: 'Short description of document 3.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 4, image: 'https://via.placeholder.com/200x120', title: 'Document Title 4', description: 'Short description of document 4.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 5, image: 'https://via.placeholder.com/200x120', title: 'Document Title 5', description: 'Short description of document 5.', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 6, image: 'https://via.placeholder.com/200x120', title: 'Document Title 6', description: 'Short description of document 6.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 7, image: 'https://via.placeholder.com/200x120', title: 'Document Title 7', description: 'Short description of document 7.', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 8, image: 'https://via.placeholder.com/200x120', title: 'Document Title 8', description: 'Short description of document 8.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
]);

const recentDocuments = ref([
  { id: 1, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 1', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 2, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 2', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 3, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 3', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 4, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 4', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
]);

const displayedDocuments = computed(() => {
  return highRatedDocuments.value.slice(currentIndex.value, currentIndex.value + displayCount);
});

const nextSlide = () => {
  if (currentIndex.value + displayCount < highRatedDocuments.value.length) {
    currentIndex.value += displayCount; // Increment index by displayCount
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= displayCount; // Decrement index by displayCount
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
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--color-text-dark);
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
  background-color: #f90; /* Amazon-like button color */
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #d68e1c; /* Darker shade on hover */
}

/* Filters */
.filters {
  margin-bottom: 20px;
}

.filters select {
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  margin-right: 10px;
}

/* Carousel Styles */
.carousel {
  display: flex;
  position: relative; /* To position controls */
  padding: 20px 0;
}

.documents-container {
  display: flex;
  overflow: hidden; /* Hide overflow for sliding effect */
}

.carousel .document {
  background: rgba(255, 255, 255, 0.8);
  border: 3px solid var(--color-border); /* Border for documents */
  border-radius: 5px;
  padding: 10px;
  width: 220px;
  margin: 0 10px; /* Margin for spacing */
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Shadow for document */
  transition: transform 0.3s; /* Smooth transition for sliding */
}

.carousel .document img {
  max-width: 100%;
  height: 120px;
  border-radius: 5px;
}

/* Carousel Controls */
.carousel-controls {
  display: flex;
  align-items: center;
}

.carousel-controls button {
  background: #f90;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.carousel .document:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Shadow effect on hover */
  transform: translateY(-2px); /* Slight lift effect on hover */
}

.carousel-controls button:disabled {
  background: #ccc; /* Grey out disabled buttons */
  cursor: not-allowed; /* Change cursor for disabled */
}

.carousel-controls button:hover:not(:disabled) {
  background: #d68e1c; /* Darker shade on hover */
}

/* Recent Documents */
.recent-documents {
  margin-top: 40px;
}

.document-list {
  display: flex;
  flex-wrap: wrap; /* Wrap documents if needed */
}

.recent-documents .document {
  margin: 10px; /* Spacing between documents */
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--color-border); /* Added border for recent documents */
  border-radius: 5px;
  width: 220px; /* Fixed width for recent documents */
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.recent-documents img {
  max-width: 100%;
  height: 120px;
  border-radius: 5px;
}
</style>
