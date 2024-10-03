<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isSidebarVisible = ref(true)

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div :class="{'flex': isSidebarVisible, 'w-16': !isSidebarVisible, 'w-64': isSidebarVisible}" 
         class="flex-col h-screen border-r bg-gradient-to-b from-purple-600 to-purple-800 shadow-lg transition-all duration-300">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-purple-900 bg-purple-700">
        <span v-if="isSidebarVisible" class="text-lg font-semibold text-white">Dashboard</span>
        <!-- Toggle Sidebar Button -->
        <button @click="toggleSidebar" class="text-white hover:text-gray-200 transition duration-150 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isSidebarVisible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Links -->
      <div class="p-4 flex-grow">
        <ul class="space-y-2">
          <li>
            <RouterLink to="/dashboard" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 00-10 10 9.96 9.96 0 003.52 7.85c.17.14.37.26.58.37l.26.1.26-.1c.21-.11.41-.23.58-.37A9.96 9.96 0 0022 12 10 10 0 0012 2zm0 18a7.991 7.991 0 01-7-4.5A8.007 8.007 0 0012 4a8.007 8.007 0 007 7.5A7.991 7.991 0 0112 20zm0-14h-2v4H9v2h4a1 1 0 001-1V6zm0 8H9v2h4a1 1 0 001-1v-2z"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Dashboard</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/subjects" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9-4.48-9-10-9zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Subjects</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/search" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 2a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 100-14 7 7 0 000 14z"/>
                <path d="M19 19l-4-4"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Search</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/contributors" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C8.69 3 5.55 4.56 3.65 7.35 2.48 9.16 2 11.54 2 12s.48 2.84 1.65 4.65C5.55 19.44 8.69 21 12 21s6.45-1.56 8.35-3.35C21.52 14.84 22 12.46 22 12s-.48-2.84-1.65-4.65C18.45 4.56 15.31 3 12 3zM12 19c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Contributors</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/faq" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">FAQ</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/self-directed-learning" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 12h3v8h6v-6h3l-9-10zm0 0h6v8h3l-9-10z"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Self-Directed Learning</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/logout" class="flex items-center text-white hover:text-gray-200 hover:bg-purple-600 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v9.586l-4-4L6 11l6 6 6-6-2-2-4 4V3z"/>
              </svg>
              <span :class="{'hidden': !isSidebarVisible, 'ml-2': isSidebarVisible}">Logout</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow p-4">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(to bottom, #5e4b8c, #2c2c54);
  color: white;
}

.sidebar a {
  transition: background-color 0.3s, color 0.3s;
}

.sidebar a:hover {
  background-color: #7b5e8c;
  color: white;
}
</style>
