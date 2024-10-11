<template>
  <div class="faq-page">
    <MainNavbar />

    <div class="flex">
      <div :class="['faq-sidebar', { 'hidden': !isSidebarOpen }]">
        <FAQSideBar />
      </div>

      <div class="container mx-auto p-6 lg:p-8 flex-1">
        <div class="header flex justify-center items-center mb-8">
          <h1 class="main-title text-3xl font-semibold text-center text-gray-800 dark:text-gray-200">
            Frequently Asked Questions
          </h1>
        </div>

        <div class="search-bar-wrapper mb-6 flex justify-center">
          <div class="relative w-full max-w-md">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search FAQs..."
              @keyup.enter="handleSearch"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <i class="fas fa-search search-icon absolute right-4 top-2 text-gray-400 cursor-pointer" @click="handleSearch"></i>
          </div>
        </div>

        <transition-group name="fade" tag="div" class="faq-container space-y-4">
          <div 
            v-for="faq in filteredFAQs" 
            :key="faq.faqId" 
            class="faq-card border border-gray-200 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg relative overflow-hidden"
          >
            <button
              @click="toggleFAQ(faq.faqId)"
              class="flex items-center justify-between w-full p-8 transition-colors duration-300"
            >
              <h1 class="font-semibold text-gray-800">{{ faq.question }}</h1>
              <span
                :class="faqOpen[faq.faqId] ? 'text-white bg-purple-500' : 'text-gray-400 bg-gray-200'"
                class="rounded-full p-2"  
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 transition-transform duration-300"
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
            <p v-if="faqOpen[faq.faqId]" class="p-8 text-sm text-gray-600">
              {{ faq.answer }}
            </p>
          </div>
        </transition-group>

        <div v-if="!isLoading && !filteredFAQs.length" class="no-results text-center text-gray-500 text-lg">
          <p>No FAQs found.</p>
        </div>

        <div v-if="isLoading" class="loading text-center text-gray-500 text-lg">
          <div class="spinner mx-auto mb-2"></div>
          <p>Loading FAQs...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FAQSideBar from '@/components/FAQSideBar.vue';
import MainNavbar from '@/components/MainNavbar.vue';

export default {
  components: {
    MainNavbar,
    FAQSideBar,
  },
  data() {
    return {
      faqs: [],
      searchTerm: '',
      isLoading: true,
      isDarkMode: false,
      isSidebarOpen: true,
      faqOpen: {}, // Track which FAQs are open
    };
  },
  created() {
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.fetchFAQs();
  },
  computed: {
    filteredFAQs() {
      return this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  watch: {
    isDarkMode(newValue) {
      localStorage.setItem('isDarkMode', newValue);
    },
  },
  methods: {
    async fetchFAQs() {
      this.isLoading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/faq`);
        if (response.ok) {
          this.faqs = await response.json();
          // Initialize faqOpen state for each FAQ
          this.faqs.forEach(faq => {
            this.$set(this.faqOpen, faq.faqId, false);
          });
        } else {
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        this.isLoading = false;
      }
    },
    handleSearch() {
      // Add any search handling logic here if needed
    },
    toggleFAQ(faqId) {
      this.$set(this.faqOpen, faqId, !this.faqOpen[faqId]); // Toggle FAQ open/close state
    },
  },
};
</script>

<style scoped>
.faq-page {
  min-height: 100vh; /* Ensure the container takes full height */
}

.flex {
  display: flex; /* Use flexbox to position sidebar and main content */
}

/* Sidebar styles */
.faq-sidebar {
  width: 250px; /* Set your desired width for the sidebar */
  height: 100vh; /* Ensures it takes the full height of the viewport */
  overflow-y: auto; /* Allows scrolling if content is too tall */
  transition: transform 0.3s ease; /* Smooth transition */
}

.faq-sidebar.hidden {
  transform: translateX(-100%); /* Move sidebar out of view when hidden */
}

/* Main container styles */
.container {
  flex: 1; /* Allow the container to take up remaining space */
  padding: 2rem;
  display: flex;
  flex-direction: column; /* Allow elements to stack vertically */
  align-items: center; /* Center align items horizontally */
}

/* Centered and Smaller Search Bar */
.search-bar-wrapper {
  position: relative;
  margin-bottom: 2rem; /* Adjusted margin-bottom for spacing */
  display: flex;
  justify-content: center;
}

.search-bar-wrapper input {
  width: 100%;
  max-width: 400px; /* Make the input smaller */
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  cursor: pointer;
}

/* Modern FAQ Card Styles */
.faq-container {
  margin-top: 1.5rem;
  max-width: 600px; /* Set a maximum width for the FAQ container */
}

/* FAQ Card Styles */
.faq-card {
  border: 1px solid var(--border-color);
  border-radius: 13px;
  padding: 1rem; /* Increased padding for better spacing */
  display: flex;
  flex-direction: column; /* Stack children vertically */
  justify-content: space-between; /* Space out the contents */
  background-color: white; /* Default background */
  transition: background-color 0.5s ease;
  min-height: 150px; /* Set minimum height for FAQ cards to make them longer */
}

/* Gradient Hover Effect */
.faq-card:hover {
  background: linear-gradient(135deg, rgba(188, 82, 220, 0.397), rgba(188, 82, 220, 0.726)); /* Gradient hover effect */
}

.faq-question {
  font-size: 1.25rem; /* Increased font size for questions */
}

.faq-answer {
  margin-top: 0.5rem;
  font-size: 1.1rem; /* Increased font size for answers */
  line-height: 1.5; /* Improved line height for better readability */
}

/* No Results and Loading Styles */
.no-results {
  font-size: 1.2rem;
  color: var(--text-color);
}

.loading {
  font-size: 1.2rem;
  color: var(--text-color);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
