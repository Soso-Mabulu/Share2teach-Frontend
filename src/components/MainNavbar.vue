<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false);

// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Navbar links
const links = [
{ text: "Dashboard", icon: "🏠", route: `/public-user-dashboard?token=${token}` },
  { text: "Subject", icon: "📚", route: "/public-user-view-all-documents?token=${token}" },
  { text: "Search", icon: "🔍", route: "/public-user-search-results" },
  { text: "Contributors", icon: "👥", route: `/public-user-contributors?token=${token}` },
  { text: "FAQ", icon: "❓", route: `/public-user-faq?token=${token}` },
  { text: "Self Directed Learning", icon: "💡", route: `/public-user-self-directed-learning?token=${token}` }
];

// Toggle the mobile menu
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <nav class="relative px-4 py-4 flex justify-between items-center bg-white shadow-md">
    <!-- Logo -->
    <a class="text-xl font-bold leading-none flex items-center" href="#">
      <img class="h-8 mr-2" src="@/assets/logo.jpg" alt="Share 2 Teach Logo" />
      SHARE2TEACH
    </a>

    <!-- Mobile menu toggle button -->
    <div class="lg:hidden">
      <button class="navbar-burger flex items-center text-blue-600 p-3" @click="toggleMenu">
        <svg class="block h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
      
    </div>

   <!-- Profile Button (visible on larger screens) -->
<router-link 
  to="/update-profile" 
  class="hidden lg:inline-block py-2 px-6 bg-purple-600 hover:bg-purple-800 text-sm text-white font-bold rounded-xl transition duration-200">
  Profile
</router-link>

    <!-- Navbar Links (visible when isMenuOpen is true on small screens) -->
    <ul v-if="isMenuOpen" class="lg:hidden bg-white shadow-lg absolute top-full left-0 w-full">
      <li v-for="link in links" :key="link.route" class="border-b border-gray-200">
        <RouterLink
          :to="link.route"
          class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 flex items-center space-x-2"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.text }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Custom styles for the mobile navbar */
.navbar-burger {
  cursor: pointer;
}
</style>
