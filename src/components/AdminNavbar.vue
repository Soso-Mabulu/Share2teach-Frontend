<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false);

// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Navigation links
const links = ref([
    { text: "Dashboard", icon: "🏠", route: `/moderator-dashboard?token=${token}` },
    { text: "Subject", icon: "📚", route: `/subject?token=${token}` },
    { text: "Search", icon: "🔍", route: `/search?token=${token}` },
    { text: "Contributors", icon: "👥", route: `contributors?token=${token}` },
    { text: "FAQ", icon: "❓", route: `/faq?token=${token}` },
    { text: "Self Directed Learning", icon: "💡", route: `/self-learning?token=${token}` },
    { text: "Upload Documents", icon: "📤", route: `/upload-documents?token=${token}` },
    { text: "Moderate Documents", icon: "⚖️", route: `/moderate-documents?token=${token}` },
    { text: "View Reported Documents", icon: "📜", route: `/view-reported-documents?token=${token}` },
    { text: "Advanced Reports", icon: "📊", route: `/advanced-reports?token=${token}` }, // New link
    { text: "System Matrix", icon: "🔧", route: `/system-matrix?token=${token}` }, // New link
    { text: "Logout", icon: "🚪", route: `/logout?token=${token}` },
]);
  

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
    <a class="hidden lg:inline-block py-2 px-6 bg-purple-600 hover:bg-purple-800 text-sm text-white font-bold rounded-xl transition duration-200" href="#">
      Profile
    </a>

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
