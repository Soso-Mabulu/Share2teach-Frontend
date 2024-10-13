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

      <h1 class="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center text-white mb-8 md:mb-12">
        Approved Documents
      </h1>

      <!-- Search and Filters -->
      <div class="mb-8">
        <input v-model="searchQuery" placeholder="Search documents..." class="w-full p-2 rounded-lg mb-4 bg-white bg-opacity-20 text-white placeholder-gray-300">
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select v-model="selectedRating" class="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <option value="">All Ratings</option>
            <option v-for="rating in uniqueRatings" :key="rating" :value="rating">{{ rating }} Stars</option>
          </select>
          
          <select v-model="selectedModule" class="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <option value="">All Modules</option>
            <option v-for="module in uniqueModules" :key="module" :value="module">{{ module }}</option>
          </select>
          
          <select v-model="selectedUniversity" class="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <option value="">All Universities</option>
            <option v-for="university in uniqueUniversities" :key="university" :value="university">{{ university }}</option>
          </select>
          
          <select v-model="selectedYear" class="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <option value="">All Years</option>
            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
          </select>
          
          <select v-model="selectedCategory" class="p-2 rounded-lg bg-white bg-opacity-20 text-white">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>

      <!-- Approved Documents Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="document in filteredDocuments" 
          :key="document.docId" 
          @click="showPreview(document)"
          class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-2">{{ document.title }}</h3>
            <p class="text-sm text-gray-300 mb-2">{{ document.description }}</p>
            <p class="text-xs text-gray-400">Module: {{ document.module }}</p>
            <p class="text-xs text-gray-400">Category: {{ document.category }}</p>
            <p class="text-xs text-gray-400">Year: {{ document.year }}</p>
            <p class="text-xs text-gray-400">Author: {{ document.author }}</p>
            <div class="flex mt-2">
              <span v-for="star in 5" :key="star" class="text-2xl" :class="{ 'text-yellow-400': star <= document.rating, 'text-gray-600': star > document.rating }">
                {{ star <= document.rating ? '★' : '☆' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50" @click="closePreview">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-8 max-w-2xl w-full m-4" @click.stop>
        <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ currentDocument.title }}</h2>
        <div class="relative mb-4">
          <img :src="currentPreviewImage" :alt="currentDocument.title" class="w-full h-48 md:h-64 object-cover rounded-lg" />
          <div class="absolute inset-0 flex items-center justify-between">
            <button @click="prevImage" class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2">
              ◀
            </button>
            <button @click="nextImage" class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2">
              ▶
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ currentImageIndex + 1 }} / {{ currentDocumentPreviewImages.length }}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">{{ currentDocument.description }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Module: {{ currentDocument.module }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Category: {{ currentDocument.category }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Year: {{ currentDocument.year }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Author: {{ currentDocument.author }}</p>
        <div class="flex flex-col sm:flex-row justify-between">
          <a :href="currentDocument.download_url" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Download Full Document
          </a>
          <button @click="closePreview" class="mt-2 sm:mt-0 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const approvedDocuments = ref([]);
const ratings = ref([]);
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const defaultImage = '/api/placeholder/400/320';

// Search and filter states
const searchQuery = ref('');
const selectedRating = ref('');
const selectedModule = ref('');
const selectedUniversity = ref('');
const selectedYear = ref('');
const selectedCategory = ref('');

// Fetch approved documents and ratings on mount
onMounted(() => {
  fetchRatings();
  fetchApprovedDocuments();
  initializeDarkMode();
});

async function fetchRatings() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/ratings`, { headers });
    ratings.value = response.data || [];
    //console.log(ratings);

  } catch (error) {
    console.error('Failed to fetch ratings:', error.message);
  }
}

async function fetchApprovedDocuments() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, { headers });

    if (response.data && response.data.status === 'success') {
      approvedDocuments.value = response.data.documents.map(doc => {
        const documentId = doc.id || doc.docId;
        const documentRating = ratings.value.find(rating => rating.docId === documentId);
        
        return {
          docId: doc.documentId,
          title: doc.title || 'Unknown title',
          preview_image_url: doc.preview_image_url || defaultImage,
          description: doc.description || 'No description available',
          author: doc.author || 'Unknown Author',
          download_url: doc.download_url || '',
          rating: documentRating ? documentRating.rating : 0,
          module: doc.module || 'Unknown Module',
          university: doc.university || 'Unknown University',
          year: doc.academicYear || 'Unknown Year',
          category: doc.category || 'Unknown Category',
          light_preview_url: doc.light_preview_url || []
        };
      });
      console.log(approvedDocuments.value);
    } else {
      console.error('Failed to fetch approved documents:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch approved documents:', error.message);
  }
}

// Preview Modal Logic
function showPreview(document) {
  currentDocument.value = document;
  currentDocumentPreviewImages.value = Array.isArray(document.light_preview_url) ? document.light_preview_url : [document.preview_image_url];
  currentImageIndex.value = 0;
  showModal.value = true;
}

function closePreview() {
  showModal.value = false;
}

// Dark Mode Logic
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value.toString());
}

function initializeDarkMode() {
  const darkModePreference = localStorage.getItem('darkMode');
  isDarkMode.value = darkModePreference === 'true';
}

// Image Navigation Logic
function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentDocumentPreviewImages.value.length;
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentDocumentPreviewImages.value.length) % currentDocumentPreviewImages.value.length;
}

// Computed properties for unique filter options
const uniqueRatings = computed(() => [...new Set(approvedDocuments.value.map(doc => doc.rating))].sort((a, b) => b - a));
const uniqueModules = computed(() => [...new Set(approvedDocuments.value.map(doc => doc.module))]);
const uniqueUniversities = computed(() => [...new Set(approvedDocuments.value.map(doc => doc.university))]);
const uniqueYears = computed(() => [...new Set(approvedDocuments.value.map(doc => doc.year))].sort((a, b) => b - a));
const uniqueCategories = computed(() => [...new Set(approvedDocuments.value.map(doc => doc.category))]);

// Computed property for filtered and searched documents
const filteredDocuments = computed(() => {
  return approvedDocuments.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRating = selectedRating.value === '' || doc.rating === parseInt(selectedRating.value);
    const matchesModule = selectedModule.value === '' || doc.module === selectedModule.value;
    const matchesUniversity = selectedUniversity.value === '' || doc.university === selectedUniversity.value;
    const matchesYear = selectedYear.value === '' || doc.year === selectedYear.value;
    const matchesCategory = selectedCategory.value === '' || doc.category === selectedCategory.value;

    return matchesSearch && matchesRating && matchesModule && matchesUniversity && matchesYear && matchesCategory;
  });
});

// Computed property for current preview image
const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>