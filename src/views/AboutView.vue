<script setup>
import Navbar from '@/components/LandingNavbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHomepage() {
  router.push('/')
}
</script>

<template>
  <Navbar />
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
      <h1 class="text-3xl font-bold mb-4">About Us</h1>
      <p class="text-gray-700 mb-4">
        Welcome to Share2Teach! We are dedicated to providing the best educational resources for
        students and teachers alike. Our mission is to make learning accessible and enjoyable for
        everyone.
      </p>
      <p class="text-gray-700">
        Our team is passionate about education and technology, and we strive to bring you the most
        up-to-date and effective tools for your learning journey.
      </p>
      <button
        @click="goToHomepage"
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Homepage
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
