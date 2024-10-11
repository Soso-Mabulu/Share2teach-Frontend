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
        <div class="flex justify-between mb-4">
          <button 
            class="px-3 md:px-4 py-1 md:py-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-300 ease-in-out"
            @click="prevPage"
            :disabled="currentPage === 0"
          >
            Previous
          </button>
          <button 
            class="px-3 md:px-4 py-1 md:py-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-300 ease-in-out"
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
          >
            Next
          </button>
        </div>
        
        <div class="flex overflow-x-auto space-x-6 pb-4">
          <div 
            v-for="(document, index) in paginatedDocuments" 
            :key="index" 
            @click="showPreview(document)"
            class="flex-shrink-0 w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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
      </div>

      <!-- Approved Documents Section -->
<div class="mb-8 md:mb-12">
  <h2 class="text-2xl md:text-3xl font-bold text-center text-white mb-6 md:mb-8">Browse for Documents</h2>
  <div class="flex overflow-x-auto space-x-6 pb-4">
    <div 
      v-for="(document, index) in approvedDocuments" 
      :key="index" 
      @click="showPreview(document)"
      class="flex-shrink-0 w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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
</div>



<button @click="router.push({ name: 'AllDocuments' })" class="block mx-auto py-2 md:py-3 px-4 md:px-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white font-semibold transform hover:scale-105 transition-all duration-300 ease-in-out">
  Explore All Cosmic Documents
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const documents = ref([]);
const ratings = ref([]);
const highRatedDocuments = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showModal = ref(false);
const currentDocument = ref(null);
const currentDocumentPreviewImages = ref([]);
const currentImageIndex = ref(0);
const defaultImage = '/api/placeholder/400/320'; // Placeholder image
const currentPage = ref(0);
const itemsPerPage = 8; // Show 8 documents at a time for better responsiveness

const paginatedDocuments = computed(() => {
  const start = currentPage.value * itemsPerPage;
  return highRatedDocuments.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(highRatedDocuments.value.length / itemsPerPage);
});

const currentPreviewImage = computed(() => {
  return currentDocumentPreviewImages.value[currentImageIndex.value] || defaultImage;
});

onMounted(() => {
  fetchRatings();
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

const approvedDocuments = ref([]);

onMounted(() => {
  fetchRatings();
  fetchApprovedDocuments(); // Fetch approved documents on mount
  initializeDarkMode();
});

async function fetchApprovedDocuments() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, { headers });
    
    if (response.data && response.data.status === 'success') {
      // Take only the first 5 approved documents
      approvedDocuments.value = response.data.documents.slice(0, 5).map(mapDocument);
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
    id: documentId,
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    light_preview_url: doc.light_preview_url || '',
    download_url: doc.download_url || '',
    rating: documentRating ? documentRating.rating : 0 
  };
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

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
}
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
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Ensure dark mode styles are applied */
:root {
  --text-color: #000;
  --bg-color: #fff;
}

.dark {
  --text-color: #fff;
  --bg-color: #1a202c;
}

body {
  color: var(--text-color);
  background-color: var(--bg-color);
}
</style>"
