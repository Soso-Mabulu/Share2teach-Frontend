<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isSidebarVisible = ref(true)

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <div v-bind:class="{'hidden': !isSidebarVisible, 'flex': isSidebarVisible}" class="flex-col w-64 h-screen border-r bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg transition-transform duration-300">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-blue-800 bg-blue-500">
        <span class="text-lg font-semibold text-white">Dashboard</span>
        <!-- Toggle Sidebar Button -->
        <button @click="toggleSidebar" class="text-white hover:text-gray-200 transition duration-150 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Links -->
      <div class="p-4 flex-grow">
        <ul class="space-y-2">
          <li>
            <RouterLink to="/publicuser" class="flex items-center text-white hover:text-gray-200 hover:bg-blue-700 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <span>General</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/about" class="flex items-center text-white hover:text-gray-200 hover:bg-blue-700 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <span>About</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/services" class="flex items-center text-white hover:text-gray-200 hover:bg-blue-700 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
              <span>Services</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Sidebar Footer -->
      <div class="mt-auto p-4 border-t border-blue-800">
        <form action="#">
          <button type="submit" class="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out px-4 py-2 rounded-lg">
            Sign Out
          </button>
        </form>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow">
      <div class="flex">
        <nav class="flex h-16 items-center bg-white shadow">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="p-4 text-gray-600 hover:bg-gray-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div class="ml-auto mr-4">
            <ul class="flex space-x-4">
              <li>
                <RouterLink to="/publicuser" class="text-gray-600 hover:text-blue-700">
                  General
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/about" class="text-gray-600 hover:text-blue-700">
                  About
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/services" class="text-gray-600 hover:text-blue-700">
                  Services
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Dashboard Content -->
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <div class="grid grid-cols-3 gap-4">
          <!-- Card 1: User Stats -->
          <div class="bg-white shadow rounded-lg p-4 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">Total Users</h2>
              <p class="text-3xl">1,250</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4l3 7h6l3-7h4" />
            </svg>
          </div>

          <!-- Card 2: Revenue -->
          <div class="bg-white shadow rounded-lg p-4 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">Total Revenue</h2>
              <p class="text-3xl">$25,000</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l5-2v15l5-2v-15" />
            </svg>
          </div>

          <!-- Card 3: New Signups -->
          <div class="bg-white shadow rounded-lg p-4 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">New Signups</h2>
              <p class="text-3xl">150</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z" />
            </svg>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-6 bg-white shadow rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="flex space-x-4">
            <RouterLink to="/create" class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition">Create New</RouterLink>
            <RouterLink to="/manage" class="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition">Manage Users</RouterLink>
            <RouterLink to="/reports" class="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600 transition">View Reports</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styling to match the hero section */
.bg-blue-600 {
  background-color: #2563eb; /* Customize if needed */
}

.bg-blue-500 {
  background-color: #3b82f6; /* Customize if needed */
}

.bg-blue-700 {
  background-color: #1d4ed8; /* Customize if needed */
}

/* Add any additional styles here */
</style>
