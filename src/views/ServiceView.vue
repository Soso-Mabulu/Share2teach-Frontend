<template>
  <div class="bg-gradient-to-b from-purple-50 to-purple-200 text-gray-800 min-h-screen">
    <LandingNavbar /> <!-- Navigation component -->

    <div class="max-w-6xl mx-auto text-center py-24"> <!-- Added more padding at the top -->
      <h1 class="text-5xl font-bold mb-24">Our Services</h1>

      <!-- Services Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Tutoring Service -->
        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <i class="fas fa-chalkboard-teacher text-purple-600 text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-2">Tutoring Services</h2>
          <p class="text-gray-700 mb-4">
            We provide personalized one-on-one tutoring sessions that are tailored to help students excel in their academics.
          </p>
          <button @click="goToPage('/tutoring-services')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            Learn More
          </button>
        </div>

        <!-- Online Courses -->
        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <i class="fas fa-laptop text-purple-600 text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-2">Online Courses</h2>
          <p class="text-gray-700 mb-4">
            Our platform offers a wide variety of online courses, allowing students to learn at their own pace from the comfort of their homes.
          </p>
          <button @click="goToPage('/online-courses')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            Learn More
          </button>
        </div>

        <!-- Student Counseling -->
        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <i class="fas fa-user-friends text-purple-600 text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-2">Student Counseling</h2>
          <p class="text-gray-700 mb-4">
            We offer counseling services to support students in overcoming academic, emotional, and personal challenges.
          </p>
          <button @click="goToPage('/student-counseling')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            Learn More
          </button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import LandingNavbar from '@/components/LandingNavbar.vue'; // Import the navbar component

export default {
  name: 'ServicesPage',
  components: {
    LandingNavbar, // Register the navbar component
  },
  methods: {
    goToPage(route) {
      this.$router.push(route); // Redirect to the specified route
    },
  },
};
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
