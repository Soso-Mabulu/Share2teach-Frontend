<template>
  <div :class="['min-h-screen w-full max-w-none transition-all duration-500 ease-in-out', 
                isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 
                'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500']">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-white mb-12 tracking-tight">
        All Approved Documents
      </h1>

      <!-- Filter Section -->
      <div class="flex flex-wrap justify-center mb-12 gap-4">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search documents..." 
          class="w-full sm:w-64 py-3 px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
        />
        <select v-model="selectedModule" class="w-full sm:w-48 py-3 px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white transition-all duration-300">
          <option value="">All Modules</option>
          <option v-for="module in uniqueModules" :key="module" :value="module">{{ module }}</option>
        </select>
        <select v-model="selectedUniversity" class="w-full sm:w-48 py-3 px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white transition-all duration-300">
          <option value="">All Universities</option>
          <option v-for="university in uniqueUniversities" :key="university" :value="university">{{ university }}</option>
        </select>
        <select v-model="selectedYear" class="w-full sm:w-48 py-3 px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white transition-all duration-300">
          <option value="">All Years</option>
          <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <button @click="applySearch" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105">
          Filter
        </button>
      </div>

      <!-- Approved Documents Section (Grid Layout) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div 
          v-for="document in filteredDocuments" 
          :key="document.id" 
          @click="showPreview(document)"
          class="flex flex-col bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="w-full h-48 object-cover" />
          <div class="p-6 flex-grow">
            <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">{{ document.title }}</h3>
            <p class="text-sm text-gray-300 mb-4 line-clamp-3">{{ document.description }}</p>
            <p class="text-xs text-gray-400">By: {{ document.author }}</p>
          </div>
        </div>
      </div>

      <!-- Preview Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50" @click="closePreview">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full m-4 transform transition-all duration-300 ease-in-out" @click.stop>
          <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ currentDocument.title }}</h2>
          <img :src="currentDocument.preview_image_url || defaultImage" :alt="currentDocument.title" class="w-full h-64 object-cover rounded-lg mb-6" />
          <p class="text-gray-700 dark:text-gray-300 mb-6">{{ currentDocument.description }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">By: {{ currentDocument.author }}</p>
          <div class="flex justify-between">
            <a :href="currentDocument.download_url" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 ease-in-out">
              Download Full Document
            </a>
            <button @click="closePreview" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors duration-300 ease-in-out">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const documents = ref([]);
const approvedDocuments = ref([]);
const searchQuery = ref('');
const showModal = ref(false);
const currentDocument = ref(null);
const defaultImage = '/api/placeholder/400/320'; // Placeholder image
const isDarkMode = ref(false); // Dark mode toggle

// Filters
const selectedModule = ref('');
const selectedUniversity = ref('');
const selectedYear = ref('');

// Arrays to hold unique filter options
const uniqueModules = ref([]);
const uniqueUniversities = ref([]);
const uniqueYears = ref([]);

onMounted(() => {
  fetchApprovedDocuments();
});

async function fetchApprovedDocuments() {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const documentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, { headers });

    if (documentsResponse.data && documentsResponse.data.status === 'success') {
      approvedDocuments.value = documentsResponse.data.documents.map(mapDocument);
      extractUniqueFilters(approvedDocuments.value);
    } else {
      console.error('Failed to fetch approved documents:', documentsResponse.data);
    }
  } catch (error) {
    console.error('Failed to fetch approved documents:', error.message);
  }
}

function mapDocument(doc) {
  return {
    id: doc.id || doc.docId,
    title: doc.title || 'Unknown title',
    preview_image_url: doc.preview_image_url || defaultImage,
    description: doc.description || 'No description available',
    author: doc.author || 'Unknown Author',
    download_url: doc.download_url || '',
    module: doc.module || 'Unknown Module',
    university: doc.university || 'Unknown University',
    year: doc.academicYear || 'Unknown Year',
  };
}

function extractUniqueFilters(documents) {
  const modules = new Set();
  const universities = new Set();
  const years = new Set();

  documents.forEach(doc => {
    if (doc.module) modules.add(doc.module);
    if (doc.university) universities.add(doc.university);
    if (doc.year) years.add(doc.year);
  });

  uniqueModules.value = Array.from(modules);
  uniqueUniversities.value = Array.from(universities);
  uniqueYears.value = Array.from(years);
}

const filteredDocuments = computed(() => {
  return approvedDocuments.value.filter(doc => {
    const matchesSearchQuery = searchQuery.value ? 
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.value.toLowerCase()) : true;

    const matchesModule = selectedModule.value ? 
      doc.module === selectedModule.value : true;

    const matchesUniversity = selectedUniversity.value ? 
      doc.university === selectedUniversity.value : true;

    const matchesYear = selectedYear.value ? 
      doc.year === selectedYear.value : true;

    return matchesSearchQuery && matchesModule && matchesUniversity && matchesYear;
  });
});

function showPreview(document) {
  currentDocument.value = document;
  showModal.value = true;
}

function closePreview() {
  showModal.value = false;
}

function applySearch() {
  // This function is invoked when the user clicks the Filter button.
  // The filter logic is already handled in the filteredDocuments computed property.
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
</style>
