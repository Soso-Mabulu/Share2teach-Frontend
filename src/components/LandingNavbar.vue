<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-purple-100 fixed w-full z-20 top-0 start-0 shadow-md">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex items-center px-2 lg:px-0">
          <RouterLink to="/" class="flex-shrink-0">
            <img src="@/assets/logo.jpg" class="h-8 w-8 rounded-full" alt="Logo" />
          </RouterLink>
          <span class="text-xl font-semibold text-purple-800 ml-2">SHARE2TEACH</span>
        </div>
        <div class="flex-1 flex justify-center lg:ml-6 lg:justify-center">
          <div class="hidden lg:ml-6 lg:flex lg:space-x-8">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
            <RouterLink to="/about" class="nav-link">About</RouterLink>
            <RouterLink to="/services" class="nav-link">Services</RouterLink>
            <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
          </div>
        </div>
        <div class="flex lg:hidden">
          <button @click="toggleMenu" class="mobile-menu-button">
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path :class="{'hidden': isMenuOpen, 'inline-flex': !isMenuOpen }" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path :class="{'hidden': !isMenuOpen, 'inline-flex': isMenuOpen }" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="hidden lg:flex lg:items-center">
          <RouterLink to="/login" class="get-started-btn">
            Get Started
          </RouterLink>
        </div>
      </div>
    </div>
    <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <RouterLink to="/" class="mobile-nav-link">Home</RouterLink>
        <RouterLink to="/about" class="mobile-nav-link">About</RouterLink>
        <RouterLink to="/services" class="mobile-nav-link">Services</RouterLink>
        <RouterLink to="/contact" class="mobile-nav-link">Contact</RouterLink>
        <RouterLink to="/login" class="mobile-get-started-btn">
          Get Started
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-purple-800 hover:bg-purple-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300;
}

.get-started-btn {
  @apply text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all duration-300 shadow-md hover:shadow-lg;
}

.mobile-menu-button {
  @apply inline-flex items-center justify-center p-2 rounded-md text-purple-800 hover:text-purple-900 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-300 transition-colors duration-300;
}

.mobile-nav-link {
  @apply text-purple-800 hover:bg-purple-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300;
}

.mobile-get-started-btn {
  @apply text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-base px-5 py-2.5 text-center block transition-all duration-300 shadow-md hover:shadow-lg mt-4;
}
</style>