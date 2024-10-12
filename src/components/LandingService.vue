<template>
    <div>
      <div class="flex flex-col items-center justify-center p-12">
        <h1 class="text-5xl font-bold text-black mb-8">Our Educational Services</h1>
      </div>
  
      <!-- Educational Services Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-12">
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#F3E9AE" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">📚</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Tutoring Services</h2>
          <button @click="learnMore('Tutoring Services')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
  
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <rect x="10" y="10" width="44" height="44" fill="#F4A261" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">📝</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Curriculum Development</h2>
          <button @click="learnMore('Curriculum Development')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
  
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <polygon points="32,10 42,54 22,54" fill="#2A9D8F" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">💻</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Online Courses</h2>
          <button @click="learnMore('Online Courses')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-12">
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <ellipse cx="32" cy="32" rx="30" ry="15" fill="#E76F51" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">👩‍🏫</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Teacher Training</h2>
          <button @click="learnMore('Teacher Training')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
  
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <path d="M10 10 H54 V54 H10 Z" fill="#264653" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">📝</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Assessment Services</h2>
          <button @click="learnMore('Assessment Services')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
  
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-600" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#F1FAEE" />
            <text x="32" y="40" font-size="18" text-anchor="middle" fill="#5A5A5A">🗣️</text>
          </svg>
          <h2 class="text-2xl font-bold mb-4">Student Counseling</h2>
          <button @click="learnMore('Student Counseling')" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">Learn More</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    components: {},
    methods: {
      learnMore(service) {
        console.log(`More information about ${service}`);
        // You can navigate to a service detail page or trigger a modal with more details.
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add additional styles here if needed */
  </style>
  