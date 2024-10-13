<template>
  <div>
    <!-- Heading Section -->
    <div class="flex flex-col items-center justify-center p-12">
      <h1 class="text-3xl font-bold text-black mb-8">Our Educational Services</h1>
    </div>

    <!-- Educational Services Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 pb-12 mt-12">
      <!-- Tutoring Services Card -->
      <div class="bg-white shadow-2xl border border-gray-200 rounded-lg p-8 text-center hover:shadow-purple-600 transition-shadow duration-300 transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#F3E9AE" />
          <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">📚</text>
        </svg>
        <h2 class="text-2xl font-bold mb-4">Tutoring Services</h2>
        <button @click="learnMore('TutoringServices')" class="bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition">Learn More</button>
      </div>

      <!-- Online Courses Card -->
      <div class="bg-white shadow-2xl border border-gray-200 rounded-lg p-8 text-center hover:shadow-purple-600 transition-shadow duration-300 transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
          <rect x="10" y="10" width="44" height="44" fill="#F4A261" />
          <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">📝</text>
        </svg>
        <h2 class="text-2xl font-bold mb-4">Online Courses</h2>
        <button @click="learnMore('OnlineCourses')" class="bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition">Learn More</button>
      </div>

      <!-- Student Counseling Card -->
      <div class="bg-white shadow-2xl border border-gray-200 rounded-lg p-8 text-center hover:shadow-purple-600 transition-shadow duration-300 transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#F1FAEE" />
          <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">🗣️</text>
        </svg>
        <h2 class="text-2xl font-bold mb-4">Student Counseling</h2>
        <button @click="learnMore('StudentCounseling')" class="bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition">Learn More</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    learnMore(service) {
      this.$router.push({ name: service });
    },
  },
};
</script>

<style scoped>
/* Optional: Add additional styles */
</style>
