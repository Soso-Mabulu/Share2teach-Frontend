<template>
  <div class="min-h-screen bg-purple-50">
    <!-- Header Section -->
    <LandingNavbar /> <!-- Added the LandingNavbar component -->
    
    <!-- Main Content Section -->
    <div class="bg-purple-50 text-gray-800 py-16 px-8 text-center mt-10"> <!-- Added mt-10 for spacing -->
      <h1 class="text-5xl font-bold">Online Courses</h1>
      <p class="mt-4 text-lg">Flexible learning, at your own pace, anytime, anywhere.</p>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Image Section -->
        <div class="flex justify-start lg:justify-start"> 
          <img src="@/assets/logo.jpg" alt="Online Learning" class="rounded-lg shadow-lg max-w-[300px] h-auto -mt-10 -mr-10" /> <!-- Adjusted margins here -->
        </div>

        <!-- Course Overview Text -->
        <div class="space-y-6">
          <h2 class="text-4xl font-bold text-gray-800">Why Choose Our Online Courses?</h2>
          <p class="text-lg text-gray-700">
            Our online courses offer flexible schedules, expert instruction, and the ability to learn from anywhere. Gain valuable skills across a wide range of subjects tailored to your needs.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1 4h1m1 4h-1v-4h1m0-4h-1V6h1m-1 4h-1V6h1m-4 8H9m1-4H9V6h1" />
              </svg>
              Access to over 100+ courses
            </li>
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405M15 17v5m0-5l-4.405-4.405m0 0L9 12m0 0L7 10M7 10H5m4 2l-1 1m0-1l-2 2M11 7l1 1m0-1l-4 4m-1-1h5" />
              </svg>
              Learn at your own pace
            </li>
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zM6 21a5 5 0 0110 0H6z" />
              </svg>
              Expert instructors
            </li>
            <li class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h1v1H9v1h1v1H9v1h6v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1H9v1z" />
              </svg>
              Affordable pricing plans
            </li>
          </ul>

          <!-- Call to Action Button -->
          <div class="text-center">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LandingNavbar from '@/components/LandingNavbar.vue'; // Import LandingNavbar

export default {
  components: {
    LandingNavbar // Register LandingNavbar
  }
};
</script>

<style scoped>
/* Add additional custom styling if necessary */
</style>
