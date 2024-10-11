<template>
    <div class="faq-page">
      <div class="container mx-auto p-6 lg:p-8">
        <div class="header flex justify-between items-center mb-8">
          <h1 class="main-title text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Frequently Asked Questions
          </h1>
        </div>
  
        <div class="search-bar-wrapper mb-6">
          <div class="relative">
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
            :key="faq.id" 
            class="faq-card bg-white border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg relative overflow-hidden"
          >
            <h3 
              class="faq-question cursor-pointer p-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 transition flex items-center justify-between"
              @click="faq.open = !faq.open"
            >
              {{ faq.question }}
              <span :class="{'rotate-180': faq.open}" class="transition-transform transform">
                <i class="fas fa-chevron-down"></i>
              </span>
            </h3>
            <transition name="slide-fade">
              <p v-if="faq.open" class="faq-answer p-4 text-gray-600 bg-gray-50 border-t border-gray-300">{{ faq.answer }}</p>
            </transition>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
        faqs: [],
        searchTerm: '',
        isLoading: true,
        isDarkMode: false,
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
        // Search handling logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .faq-page {
    font-family: 'Roboto', Arial, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    min-height: 100vh;
    transition: all 0.3s ease;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .main-title {
    font-size: 2rem;
    color: var(--primary-color);
  }
  
  .search-bar-wrapper {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .search-bar {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    font-size: 1rem;
    border: 2px solid var(--border-color);
    border-radius: 30px;
    background-color: var(--card-background);
    color: var(--text-color);
    transition: all 0.3s ease;
  }
  
  .search-bar:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  
  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-color);
    cursor: pointer;
  }
  
  .faq-container {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  
  .faq-card {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
  
  .faq-card:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }
  
  .faq-question {
    font-size: 1.2rem;
    color: var(--primary-color);
  }
  
  .faq-answer {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  
  .no-results {
    text-align: center;
    font-size: 1.2rem;
    color: var(--text-color);
  }
  
  .loading {
    text-align: center;
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
  
  /* Animation styles */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
  }
  .slide-fade-enter-to, .slide-fade-leave-active {
    max-height: 100px; /* Adjust this based on expected content height */
    opacity: 1;
  }
  </style>
  
  