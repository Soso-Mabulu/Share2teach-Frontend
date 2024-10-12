<template>
    <div class="faq-page">
      <div class="container mx-auto p-6 lg:p-8 flex-1">
        <div class="header flex justify-center items-center mb-8">
          <h1 class="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
  
        <!-- Search Bar -->
        <div class="search-bar-wrapper mb-6 flex justify-center">
          <div class="relative w-full max-w-md">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search FAQs..."
              @keyup.enter="handleSearch"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            />
            <i
              class="fas fa-search search-icon absolute right-4 top-3 text-gray-400 cursor-pointer"
              @click="handleSearch"
            ></i>
          </div>
        </div>
  
        <transition-group name="fade" tag="div" class="faq-container space-y-4">
          <div
            v-for="faq in paginatedFAQs"
            :key="faq.faqId"
            class="faq-card border border-gray-200 rounded-md shadow-sm transition duration-300 ease-in-out hover:shadow-lg relative overflow-hidden hover:bg-purple-100"
          >
            <button
              @click="toggleFAQ(faq.faqId)"
              class="flex items-center justify-between w-full p-4 transition-colors duration-300"
            >
              <h1 class="font-semibold text-gray-800 text-sm">{{ faq.question }}</h1>
              <span
                :class="faqOpen[faq.faqId] ? 'text-white bg-purple-500' : 'text-gray-400 bg-gray-200'"
                class="rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="faqOpen[faq.faqId] ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M18 12H6'"
                  />
                </svg>
              </span>
            </button>
            <hr class="border-gray-300" />
            <p v-if="faqOpen[faq.faqId]" class="p-4 text-xs text-gray-600">
              {{ faq.answer }}
            </p>
          </div>
        </transition-group>
  
        <div v-if="!isLoading && !paginatedFAQs.length" class="no-results text-center text-gray-500 text-lg">
          <p>No FAQs found.</p>
        </div>
  
        <div v-if="isLoading" class="loading text-center text-gray-500 text-lg">
          <div class="spinner mx-auto mb-2"></div>
          <p>Loading FAQs...</p>
        </div>
  
        <!-- Pagination Controls -->
        <div class="pagination flex justify-center mt-6">
          <button
            @click="prevPage"
            :disabled="currentPage === 1 || loadingPage"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 transition duration-300 hover:bg-purple-700"
          >
            Previous
          </button>
          <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || loadingPage"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 transition duration-300 hover:bg-purple-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    setup() {
      const faqs = ref([]);
      const searchTerm = ref('');
      const faqOpen = ref({});
      const isLoading = ref(true);
      const loadingPage = ref(false); // Loading state for pagination
      const currentPage = ref(1);
      const itemsPerPage = 4;
  
      // Fetch FAQs from the API
      const fetchFAQs = async () => {
        isLoading.value = true; // Set loading to true when fetching begins
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faq/`);
          const data = await response.json();
          if (response.ok) {
            faqs.value = data; // Store FAQs in reactive property
            console.log("Fetched FAQs:", faqs.value); // Log fetched FAQs for debugging
            // Initialize FAQ open states
            faqs.value.forEach((faq) => {
              faqOpen.value[faq.faqId] = false;
            });
          } else {
            console.error("Error fetching FAQs:", data);
          }
        } catch (error) {
          console.error('Failed to fetch FAQs:', error);
        } finally {
          isLoading.value = false; // Set loading to false after fetching
        }
      };
  
      // Function to handle search action
      const handleSearch = () => {
        console.log("Search term:", searchTerm.value);
        currentPage.value = 1; // Reset to the first page on search
      };
  
      // Function to toggle FAQ visibility
      const toggleFAQ = (faqId) => {
        faqOpen.value[faqId] = !faqOpen.value[faqId];
      };
  
      // Computed property for filtered FAQs based on search term
      const filteredFAQs = computed(() => {
        return faqs.value.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    });

  
      // Computed properties for pagination
      const totalPages = computed(() => {
        return Math.ceil(filteredFAQs.value.length / itemsPerPage);
      });
  
      const paginatedFAQs = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredFAQs.value.slice(start, start + itemsPerPage);
      });
  
      // Pagination methods
      const nextPage = async () => {
        if (currentPage.value < totalPages.value) {
          loadingPage.value = true; // Start loading for the next page
          currentPage.value++; // Increment page number
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading delay
          loadingPage.value = false; // Stop loading after delay
        }
      };
  
      const prevPage = async () => {
        if (currentPage.value > 1) {
          loadingPage.value = true; // Start loading for the previous page
          currentPage.value--; // Decrement page number
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading delay
          loadingPage.value = false; // Stop loading after delay
        }
      };
  
      // Fetch FAQs when the component is mounted
      onMounted(fetchFAQs);
  
      // Return reactive properties and methods to the template
      return {
        faqs,
        searchTerm,
        faqOpen,
        isLoading,
        toggleFAQ,
        filteredFAQs,
        handleSearch,
        paginatedFAQs,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        loadingPage,
      };
    },
  };
  </script>
  
  <style scoped>
  .faq-page {
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically if needed */
    flex-direction: column; /* Stack items vertically */
    /*background: linear-gradient(to bottom right, #e0c3fc, #f0c6fa);*/
    min-height: 100vh;
  }
  
  .container {
    width: 100%; /* Allow container to take full width */
  }
  
  .faq-card {
    border: 1px solid #bf1ce0; /* Border color */
    border-radius: 5px;
    padding: 5px;
    margin: 10px 0;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; /* Transition for scaling and shadow */
    background-color: white; /* Background color */
  }
  
  .faq-card:hover {
    transform: scale(1.05); /* Slight scale on hover */
    box-shadow: 0 4px 10px rgba(178, 24, 178, 0.767); /* Add shadow on hover */
    border-color: #bd46e5; /* Change border color on hover */
  }
  
  .search-icon {
    font-size: 1.25rem; /* Adjust icon size */
  }

  .search-icon:hover{
    box-shadow: 0 4px 10px rgba(178, 24, 178, 0.767);
    border-color: #bd46e5; /* Change border color on hover */
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center; /* Center pagination controls */
    align-items: center; /* Center pagination controls vertically */
  }
  
  /* Transition effects */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  