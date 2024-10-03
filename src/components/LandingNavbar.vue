<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

// State to track the menu's visibility on small screens
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav
    class="bg-gradient-to-b from-[var(--color-purple-light)] to-[var(--color-purple-lighter)] fixed w-full z-20 top-0 start-0 border-b border-gray-200"
  >
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="@/assets/logo.jpg" class="h-8 rounded-xl" alt="Logo" />
        <span class="text-2xl font-semibold text-white">SHARE2TEACH</span>
      </RouterLink>
      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <RouterLink
          to="/login"
          type="button"
          class="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-4 py-2 text-center"
        >
          Get Started
        </RouterLink>
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
      </div>
      <div
        :class="{ hidden: !isMenuOpen, block: isMenuOpen }"
        class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent"
        >
          <li>
            <RouterLink
              to="/"
              class="block py-2 px-4 text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
              aria-current="page"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/about"
              class="block py-2 px-4 text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
              >About</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/services"
              class="block py-2 px-4 text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
              >Services</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/contact"
              class="block py-2 px-4 text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
              >Contact</RouterLink
            >
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
</style>
