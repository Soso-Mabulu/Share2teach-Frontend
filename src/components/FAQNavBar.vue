<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false);

// Navbar links
const links = [
  { text: "Dashboard", icon: "🏠", route: "/dashboard" },
  { text: "Contributors", icon: "👥", route: "/contributors" },
  { text: "Logout", icon: "🚪", route: "/logout" },
];

// Toggle the mobile menu
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <nav class="navbar">
    <!-- Logo -->
    <a class="logo" href="#">
      <img class="logo-img" src="@/assets/logo.jpg" alt="Share 2 Teach Logo" />
      SHARE2TEACH
    </a>

    <!-- Mobile menu toggle button -->
    <div class="navbar-burger lg:hidden">
      <button @click="toggleMenu">
        <svg class="block h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
    </div>

    <!-- Profile Button (visible on larger screens) -->
    <router-link 
      to="/update-profile" 
      class="profile-button hidden lg:inline-block">
      Profile
    </router-link>

    <!-- Navbar Links (visible when isMenuOpen is true on small screens) -->
    <ul v-if="isMenuOpen" class="mobile-links">
      <li v-for="link in links" :key="link.route" class="border-b border-gray-200">
        <RouterLink
          :to="link.route"
          class="nav-link"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.text }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%; /* Ensure navbar takes full width */
  padding: 1rem 2rem; /* Adjust padding as needed */
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed; /* Fixed position to keep it at the top */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it is above other elements */
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 2rem; /* Adjust logo size */
  margin-right: 0.5rem;
}

.navbar-burger {
  cursor: pointer;
}

.profile-button {
  padding: 0.5rem 1rem;
  background-color: #6B46C1; /* Purple */
  color: white;
  border-radius: 0.375rem; /* Rounded corners */
  transition: background-color 0.2s;
}

.profile-button:hover {
  background-color: #5A67D8; /* Darker purple */
}

.mobile-links {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%; /* Position below the navbar */
  left: 0;
  width: 100%; /* Ensure it takes full width */
}

.nav-link {
  padding: 1rem;
  display: flex;
  align-items: center;
  color: #2D3748; /* Gray text */
}

.nav-link:hover {
  background-color: rgba(50, 50, 50, 0.1);
}
</style>
