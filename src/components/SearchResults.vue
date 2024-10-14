<template>
  <div :class="['min-h-screen', 'p-4', 'sm:p-6', 'md:p-8', { 'bg-gray-100 text-gray-900': !isDarkMode, 'bg-gray-900 text-gray-100': isDarkMode }]">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8" :class="{ 'text-purple-600': !isDarkMode, 'text-purple-400': isDarkMode }">
        Search Documents
      </h1>

      <div class="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative flex-grow">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search documents..."
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            :class="{ 'bg-white border-gray-300': !isDarkMode, 'bg-gray-800 border-gray-700': isDarkMode }"
          />
          <button @click="searchDocuments" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium">Dark Mode</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isDarkMode" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
      
      <div v-if="noResults" class="text-center py-12 text-xl font-medium" :class="{ 'text-gray-600': !isDarkMode, 'text-gray-400': isDarkMode }">
        No documents found.
      </div>

      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>

      <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="document in results"
          :key="document.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
          @click="openModal(document)"
        >
          <img :src="document.preview_image_url" :alt="document.title" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">{{ document.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1"><span class="font-medium">Module:</span> {{ document.module }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1"><span class="font-medium">University:</span> {{ document.university }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3"><span class="font-medium">Category:</span> {{ document.category }}</p>
            <button @click.stop="downloadDocument(document)" class="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors duration-300">Download</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="selectedDocument" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ selectedDocument.title }}</h2>
              <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex overflow-x-auto space-x-4 mb-6">
              <img 
                v-for="(url, index) in selectedDocument.light_preview_url.split(',')"
                :key="index"
                :src="url"
                :alt="`Preview ${index + 1}`"
                class="w-40 h-40 object-cover rounded-md flex-shrink-0"
              />
            </div>
            <div class="space-y-2 text-sm">
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Module:</span> {{ selectedDocument.module }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Description:</span> {{ selectedDocument.description }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">University:</span> {{ selectedDocument.university }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Category:</span> {{ selectedDocument.category }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Academic Year:</span> {{ selectedDocument.academicYear }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">File Name:</span> {{ selectedDocument.fileName }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">File Type:</span> {{ selectedDocument.fileType }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">File Size:</span> {{ formatFileSize(selectedDocument.fileSize) }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Page Count:</span> {{ selectedDocument.pageCount }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Author:</span> {{ selectedDocument.author }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Creation Date:</span> {{ formatDate(selectedDocument.creationDate) }}</p>
              <p><span class="font-medium text-gray-700 dark:text-gray-300">Modification Date:</span> {{ formatDate(selectedDocument.modificationDate) }}</p>
            </div>
            <button @click="downloadDocument(selectedDocument)" class="mt-6 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors duration-300">
              Download
            </button>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="notification" :class="['fixed bottom-4 right-4 px-4 py-2 rounded-md text-white', { 'bg-green-500': notification.type === 'success', 'bg-red-500': notification.type === 'error' }]">
          {{ notification.message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const searchTerm = ref('');
const results = ref([]);
const error = ref(null);
const loading = ref(false);
const noResults = ref(false);
const notification = ref(null);
const selectedDocument = ref(null);
const isDarkMode = ref(false);

const apiBaseUrl = import.meta.env.VITE_API_URL;

const searchDocuments = async () => {
  loading.value = true;
  error.value = null;
  noResults.value = false;
  results.value = [];

  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Authorization required. No token found.';
    loading.value = false;
    return;
  }

  try {
    const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    const endpoint = 'api/v1/documents/search';
    const fullUrl = `${normalizedApiBaseUrl}/${endpoint}?search=${encodeURIComponent(searchTerm.value)}`;
    
    console.log('API Endpoint:', fullUrl);

    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.documents && response.data.documents.length > 0) {
      results.value = response.data.documents;
    } else {
      noResults.value = true;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = 'Unauthorized: valid token required.';
    } else if (err.response && err.response.status === 400) {
      error.value = 'Bad request: invalid query.';
    } else if (err.response && err.response.status === 404) {
      noResults.value = true;
    } else {
      error.value = 'Failed to perform search. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const showNotification = (message, type = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 3000);
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const openModal = (document) => {
  selectedDocument.value = document;
};

const closeModal = () => {
  selectedDocument.value = null;
};

const downloadDocument = (document) => {
  window.open(document.location, '_blank');
};
</script>