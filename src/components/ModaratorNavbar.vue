<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import the useRouter composable for navigation

const router = useRouter(); // Initialize the router

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false);

// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Navigation links
const links = ref([
    { text: "Dashboard", icon: "🏠", route: `/moderator-dashboard?token=${token}` },
    { text: "Subject", icon: "📚", route: `/moderator-subject?token=${token}` },
    { text: "Search", icon: "🔍", route: `/moderator-search?token=${token}` },
    { text: "Contributors", icon: "👥", route: `/moderator-contributors?token=${token}` },
    { text: "FAQ", icon: "❓", route: `/moderator-faq?token=${token}` },
    { text: "Self Directed Learning", icon: "💡", route: `/moderator-self-learning?token=${token}` },
    { text: "Upload Documents", icon: "📤", route: `/moderator-upload-documents?token=${token}` }, // New link
    { text: "Moderate Documents", icon: "⚖️", route: `/moderate-documents?token=${token}` }, // New link
    { text: "View Reported Documents", icon: "📜", route: `/moderator-view-reported-documents?token=${token}` }, // New link
]);
  

// Toggle the mobile menu
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
  // Logout function
  const logout = async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}api/v1/auth/logout`;
    
    try {
      await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });
      
      // Clear user data and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Redirect to the landing page
      router.push('/'); // Change '/landing-page' to your actual landing page route
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
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
      <li>
        <a href="#" class="nav-link" @click.prevent="logout">
          <i class="icon">🚪</i>
          <span v-if="isExpanded">Logout</span>
        </a>
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
