<template>
  <div class="faq-page"> <!-- Background color applied to the outermost div -->
    <div class="container mx-auto p-6 lg:p-8 flex-1"> <!-- Flex-1 will allow it to grow and fill the space -->
      <!-- Page Header -->
      <div class="header flex justify-center items-center mb-8">
        <h1 class="text-3xl lg:text-4xl font-bold text-purple-700">Frequently Asked Questions</h1>
      </div>

      <!-- Search Bar -->
      <div class="search-bar-wrapper mb-6 flex justify-center">
        <div class="relative w-full max-w-md">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search FAQs..."
            @keyup.enter="handleSearch"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-purple-400 transition duration-300 ease-in-out"
          />
          <i
            class="fas fa-search search-icon absolute right-4 top-3 text-purple-500 cursor-pointer hover:text-purple-600 transition duration-300"
            @click="handleSearch"
          ></i>
        </div>
      </div>

      <!-- FAQs or Loading Spinner -->
      <transition-group name="fade" tag="div" class="faq-container space-y-4">
        <template v-if="!loadingPage">
          <div
            v-for="faq in paginatedFAQs"
            :key="faq.faqId"
            class="faq-card border border-gray-200 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out hover:shadow-2xl hover:bg-purple-100 relative overflow-hidden"
          >
            <button
              @click="toggleFAQ(faq.faqId)"
              class="flex items-center justify-between w-full p-3 transition-colors duration-300 hover:bg-purple-200 rounded-t-xl"
            >
              <h1 class="font-semibold text-gray-800 text-base">{{ faq.question }}</h1>
              <span
                :class="faqOpen[faq.faqId] ? 'text-white bg-purple-500' : 'text-purple-500 bg-purple-100'"
                class="rounded-full p-2"
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
            <hr class="border-purple-300" />
            <p v-if="faqOpen[faq.faqId]" class="p-3 text-sm text-gray-700 bg-purple-50 rounded-b-xl">
              {{ faq.answer }}
            </p>
          </div>
        </template>
      </transition-group>

      <!-- Loading Spinner -->
      <div v-if="loadingPage" class="loading-spinner text-center mt-6">
        <div class="spinner mx-auto mb-2"></div>
        <p class="text-purple-500">Loading FAQs...</p>
      </div>

      <!-- No Results -->
      <div v-if="!isLoading && !paginatedFAQs.length" class="no-results text-center text-gray-500 text-lg">
        <p>No FAQs found.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination flex justify-center mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1 || loadingPage"
          class="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 transition duration-300 hover:bg-purple-600"
        >
          Previous
        </button>
        <span class="mx-4 text-purple-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || loadingPage"
          class="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 transition duration-300 hover:bg-purple-600"
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
    const itemsPerPage = 6;

    // Fetch FAQs from the API
    const fetchFAQs = async () => {
      isLoading.value = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faq/`);
        const data = await response.json();
        if (response.ok) {
          faqs.value = data;
          // Initialize FAQ open states
          faqs.value.forEach((faq) => {
            faqOpen.value[faq.faqId] = false;
          });
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Handle search
    const handleSearch = () => {
      currentPage.value = 1;
    };

    // Toggle FAQ visibility
    const toggleFAQ = (faqId) => {
      faqOpen.value[faqId] = !faqOpen.value[faqId];
    };

    // Filtered FAQs based on search term
    const filteredFAQs = computed(() => {
      return faqs.value.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredFAQs.value.length / itemsPerPage);
    });

    const paginatedFAQs = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredFAQs.value.slice(start, start + itemsPerPage);
    });

    const nextPage = async () => {
      if (currentPage.value < totalPages.value) {
        loadingPage.value = true;
        await new Promise(resolve => setTimeout(resolve, 300));
        currentPage.value++;
        loadingPage.value = false;
      }
    };

    const prevPage = async () => {
      if (currentPage.value > 1) {
        loadingPage.value = true;
        await new Promise(resolve => setTimeout(resolve, 300));
        currentPage.value--;
        loadingPage.value = false;
      }
    };

    onMounted(fetchFAQs);

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


.faq-card {
  border: 1px solid #e0c3fc; /* Border with light purple */
  background-color: #ffffff; /* White background for cards */
  border-radius: 12px;
  padding: 0.75rem; /* Reduced padding */
  margin: 0.5rem 0; /* Keep margin */
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 90%; /* Added to make sure it fits within the page */
}

.faq-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(178, 24, 178, 0.2);
}

.search-icon {
  font-size: 1.25rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #6b46c1; /* Spinner color - purple */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
 
  }}
</style>