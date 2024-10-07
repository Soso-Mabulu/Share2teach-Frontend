<template>
  <div class="hero">
    <h1>Welcome to your dashboard!</h1>
    
    <!-- Search Bar -->
    <div class="search-bar">
      <input type="text" placeholder="Search documents..." v-model="searchQuery" />
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
      <div class="document" v-for="document in highRatedDocuments" :key="document.id">
        <img :src="document.image" :alt="document.title" />
        <h3>{{ document.title }}</h3>
        <p>{{ document.description }}</p>
        <div class="ratings">
          <span>{{ document.rating }}</span> {{ document.ratingValue }}
        </div>
      </div>
      <button @click="nextSlide" class="next-button">Next</button>
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
import { ref } from 'vue';

const searchQuery = ref('');
const selectedModule = ref('');
const selectedYear = ref('');
const selectedUniversity = ref('');

const highRatedDocuments = ref([
  { id: 1, image: 'https://via.placeholder.com/200x120', title: 'Document Title 1', description: 'Short description of document 1.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 2, image: 'https://via.placeholder.com/200x120', title: 'Document Title 2', description: 'Short description of document 2.', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 3, image: 'https://via.placeholder.com/200x120', title: 'Document Title 3', description: 'Short description of document 3.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 4, image: 'https://via.placeholder.com/200x120', title: 'Document Title 4', description: 'Short description of document 4.', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
]);

const recentDocuments = ref([
  { id: 1, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 1', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 2, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 2', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
  { id: 3, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 3', rating: '⭐⭐⭐⭐', ratingValue: 4.0 },
  { id: 4, image: 'https://via.placeholder.com/200x120', title: 'Recent Document 4', rating: '⭐⭐⭐⭐⭐', ratingValue: 5.0 },
]);

const nextSlide = () => {
  alert("Next slide functionality to be implemented!");
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
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  margin-right: 10px;
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
  overflow-x: auto;
  padding: 20px 0;
}

.carousel .document {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  padding: 10px;
  width: 220px;
  flex-shrink: 0;
  margin-right: 20px;
  text-align: center;
}

.document img {
  max-width: 100%;
  height: 120px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.document h3 {
  margin: 10px 0;
  font-size: 18px;
  color: var(--color-text-dark);
}

.document p {
  font-size: 14px;
}

/* Ratings */
.ratings {
  margin: 5px 0;
}

.ratings span {
  color: gold;
}

/* Recent Documents Section */
.recent-documents {
  margin-top: 30px;
}

.recent-documents h2 {
  margin-bottom: 10px;
  color: var(--color-text-dark);
}

.recent-documents .document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recent-documents .document {
  width: calc(25% - 20px);
}
</style>

git config --global user.email "you@example.com"
git config --global user.name "Your Name"
