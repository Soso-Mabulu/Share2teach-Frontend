<template>
  <section class="bg-white text-gray-900 m-6">
    <h2 class="text-2xl font-bold sm:text-4xl text-center m-6">Continue Reading</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="document in documents"
        :key="document.fileName"
        class="block rounded-lg border border-gray-300 p-4 shadow-lg transition-transform hover:shadow-blue-500/10"
      >
        <!-- Image Preview for Document -->
        <div
          :style="{ width: '100%', height: '120px', backgroundColor: imageBackgroundColor }"
          class="flex justify-center items-center border border-dashed border-gray-300 rounded-lg"
        >
          <span class="text-gray-700 font-semibold">{{ document.fileName }}</span>
        </div>
        <h3 class="mt-2 text-lg font-semibold">{{ document.module }}</h3>
        <p class="text-sm text-gray-600">{{ document.description }}</p>

        <!-- Additional Metadata -->
        <div class="mt-2 text-sm text-gray-500">
          <p><strong>University:</strong> {{ document.university }}</p>
          <p><strong>Category:</strong> {{ document.category }}</p>
          <p><strong>Academic Year:</strong> {{ document.academicYear }}</p>
          <p><strong>Published:</strong> {{ formatDate(document.creationDate) }}</p>
          <p><strong>File Size:</strong> {{ formatFileSize(document.fileSize) }}</p>
        </div>

        <div class="mt-4 flex justify-between">
          <span class="text-sm text-gray-500">By {{ document.author }}</span>
          <a
            :href="document.location"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block rounded-lg bg-blue-600 px-3 py-1 text-white font-semibold transition hover:bg-blue-500"
          >
            View Full Doc
          </a>
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center my-4">
      <span>Loading documents...</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import debounce from 'lodash/debounce'

// Reactive properties
const documents = ref([])
const loading = ref(true)

// Define a color variable for image backgrounds
const imageBackgroundColor = '#ebf8ff' // Change this to any color you prefer

// Function to fetch documents from the API
const fetchDocuments = async () => {
  loading.value = true // Set loading to true before fetching
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/documents/approved`)
    const data = await response.json()
    if (data.status === 'success') {
      documents.value = data.documents // Directly use documents from response
    }
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  } finally {
    loading.value = false // Set loading to false after fetching
  }
}

// Function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Function to format file size from bytes to KB
const formatFileSize = (sizeInBytes) => {
  const sizeInKB = (sizeInBytes / 1024).toFixed(2)
  return `${sizeInKB} KB`
}

// Fetch documents when the component is mounted
onMounted(debounce(fetchDocuments, 300))
</script>

<style scoped>
/* Additional styling */
.card {
  max-width: 250px; /* Set max width for smaller cards */
}

img {
  border-radius: 8px; /* Round corners for images */
}
</style>
