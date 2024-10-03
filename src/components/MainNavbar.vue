<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false)

// Sidebar links
const links = [
  { text: "Dashboard", icon: "🏠", route: "/dashboard" },
  { text: "Subject", icon: "📚", route: "/subject" },
  { text: "Search", icon: "🔍", route: "/search" },
  { text: "Contributors", icon: "👥", route: "/contributors" },
  { text: "FAQ", icon: "❓", route: "/faq" },
  { text: "Self Directed Learning", icon: "💡", route: "/self-learning" },
  { text: "Logout", icon: "🚪", route: "/logout" }, // Added Logout link to sidebar links
];

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <nav
    class="bg-gradient-to-b from-[var(--color-purple-light)] to-[var(--color-purple-lighter)] w-full z-20 border-b border-gray-200"
  >
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="@/assets/logo.jpg" class="h-8 rounded-xl" alt="Logo" />
        <span class="text-2xl font-semibold text-white">SHARE2TEACH</span>
      </RouterLink>
      
      
      <!-- profile link (moved to the far right) -->
      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <RouterLink
            to="/profile"
            type="button"
            class="hidden md:block text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-4 py-2 text-center md:ml-4"
        >
            Profile
        </RouterLink>
      </div>

      <!-- Toggle Button for Small Screens -->
      <button
        @click="toggleMenu"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-200 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-sticky"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <!-- Navigation Links (sidebar links) -->
      <div
        :class="{ hidden: !isMenuOpen, block: isMenuOpen }"
        class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent"
        >
            <li v-for="link in links" :key="link.text">
                <RouterLink
                    :to="link.route"
                    class="block py-2 px-4 text-gray-800 rounded-full hover:bg-purple-400 transition-colors duration-300"
                    aria-current="page"
                >
                    <span v-if="isMenuOpen">{{ link.icon }}</span> <!-- Icon only visible in dropdown -->
                    <span v-if="isMenuOpen">{{ link.text }}</span> <!-- Text only visible in dropdown -->
                </RouterLink>
            </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  --color-purple-light: #d5b1e3; /* Lighter purple */
  --color-purple-lighter: #e9d8ef; /* Even lighter purple */
}

nav button {
  transition: transform 0.2s ease-in-out;
}

nav button:hover {
  transform: scale(1.05);
}

/* Hide the logout button on small screens */
@media (max-width: 768px) {
  nav > .hidden {
    display: none;
  }
}
</style>
