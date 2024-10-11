<template>
    <div :class="['min-h-screen w-full max-w-none transition-all duration-500 ease-in-out', 
                  isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 
                  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500']">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl md:text-4xl lg:text-6xl font-extrabold text-center text-white mb-8 md:mb-12">
          All Approved Documents
        </h1>
  
        <!-- Filter Section -->
        <div class="flex flex-wrap mb-8">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search documents..." 
            class="w-full sm:w-1/4 py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white mb-4 sm:mr-4"
          />
          <select v-model="selectedModule" class="w-full sm:w-1/4 py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white">
            <option value="">Select Module</option>
            <option v-for="module in uniqueModules" :key="module" :value="module">{{ module }}</option>
          </select>
          <select v-model="selectedUniversity" class="w-full sm:w-1/4 py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white mb-4 sm:mr-4">
            <option value="">Select University</option>
            <option v-for="university in uniqueUniversities" :key="university" :value="university">{{ university }}</option>
          </select>
          <select v-model="selectedYear" class="w-full sm:w-1/4 py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white mb-4 sm:mr-4">
            <option value="">Select Year</option>
            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
          </select>
          <select v-model="selectedRating" class="w-full sm:w-1/4 py-3 md:py-4 px-4 md:px-6 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white mb-4 sm:mr-4">
            <option value="">Select Rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} Stars & Above</option>
          </select>
          <button @click="applySearch" class="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-all duration-300 ease-in-out">
            Filter
          </button>
        </div>
  
        <!-- Approved Documents Section (Grid Layout) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="(document, index) in filteredDocuments" 
            :key="document.id" 
            @click="showPreview(document)"
            class="flex flex-col bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
          >
            <img :src="document.preview_image_url || defaultImage" alt="Document Preview" class="w-full h-40 object-cover" />
            <div class="p-4 flex-grow">
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
  
        <!-- Preview Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50" @click="closePreview">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-8 max-w-2xl w-full m-4 transform transition-all duration-300 ease-in-out" @click.stop>
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ currentDocument.title }}</h2>
            <img :src="currentDocument.preview_image_url || defaultImage" :alt="currentDocument.title" class="w-full h-48 md:h-64 object-cover rounded-lg" />
            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ currentDocument.description }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">By: {{ currentDocument.author }}</p>
            <a :href="currentDocument.download_url" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out mb-2">
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
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const documents = ref([]);
  const approvedDocuments = ref([]);
  const searchQuery = ref('');
  const showModal = ref(false);
  const currentDocument = ref(null);
  const defaultImage = '/api/placeholder/400/320'; // Placeholder image
  const isDarkMode = ref(false); // Define isDarkMode here or import it from your store/context
  
  // Additional Filters
  const selectedModule = ref('');
  const selectedUniversity = ref('');
  const selectedYear = ref('');
  const selectedRating = ref('');
  
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
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`, { headers });
  
      if (response.data && response.data.status === 'success') {
        approvedDocuments.value = response.data.documents.map(mapDocument);
        extractUniqueFilters(approvedDocuments.value); // Extract unique values for filters
      } else {
        console.error('Failed to fetch approved documents:', response.data);
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
      rating: doc.rating || 0, // Assuming document has a rating
      module: doc.module || 'Unknown Module', // Assuming document has a module field
      university: doc.university || 'Unknown University', // Assuming document has a university field
      year: doc.academicYear || 'Unknown Year', // Assuming document has a year field
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
  
      const matchesRating = selectedRating.value ? 
        doc.rating >= selectedRating.value : true;
  
      return matchesSearchQuery && matchesModule && matchesUniversity && matchesYear && matchesRating;
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
  