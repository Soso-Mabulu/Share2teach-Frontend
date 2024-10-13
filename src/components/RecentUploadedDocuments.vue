<template>
  <section class="bg-white text-gray-900 m-6">
    <h2 class="text-2xl font-bold sm:text-4xl text-center m-6 text-gray-900">Continue Reading</h2>

    <!-- Limit to 4 Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="document in limitedDocuments"
        :key="document.fileName"
        class="block rounded-lg p-4 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-50 shadow-lg"
      >
        <!-- Document Icon Preview -->
        <div
          :style="{ width: '100%', height: '150px', backgroundColor: imageBackgroundColor }"
          class="flex justify-center items-center border border-dashed border-gray-300 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-10 w-10 text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 12h4m-4 4h4m-2-8h.01"
            />
          </svg>
        </div>

        <!-- Document Title -->
        <h3 class="mt-2 text-lg font-semibold text-purple-800 truncate">{{ document.module }}</h3>

        <!-- Key Information -->
        <div class="mt-2 text-sm text-gray-600">
          <p class="truncate"><strong>Category:</strong> {{ document.category }}</p>
          <p class="truncate">
            <strong>Published:</strong> {{ formatDate(document.creationDate) }}
          </p>
        </div>

        <!-- Button with Interesting Colors and Hover Effect -->
        <div class="mt-4 flex justify-between items-center">
          <span class="text-xs text-gray-500">By {{ document.author }}</span>
          <a
            :href="document.location"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block rounded-full bg-gradient-to-r from-purple-500 via-purple-200 to-purple-400 px-4 py-2 text-gray-700 font-semibold transition-transform hover:scale-105"
          >
            View
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
import { ref, onMounted, computed } from 'vue'
import debounce from 'lodash/debounce'

// Reactive properties
const documents = ref([])
const loading = ref(true)

// Limit displayed documents to 4
const limitedDocuments = computed(() => documents.value.slice(0, 4))

// Define a color variable for image backgrounds
const imageBackgroundColor = '#e9d8ef' // Change this to any color you prefer

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

// Fetch documents when the component is mounted
onMounted(debounce(fetchDocuments, 300))
</script>

<style scoped>
/* Adjustments for responsive layout and card appearance */

/* Horizontal Layout for Smaller Screens */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Button hover effect with color gradient */
a {
  transition: transform 0.3s ease-in-out;
}

svg {
  transition: all 0.3s ease-in-out;
}
</style>
