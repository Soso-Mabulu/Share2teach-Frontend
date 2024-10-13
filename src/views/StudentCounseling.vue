<template>
    <div class="bg-gray-100 min-h-screen py-12">
      <!-- Page Title -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Student Counseling Services</h1>
        <p class="text-lg text-gray-600">Supporting students for a better academic and personal experience</p>
      </div>
  
      <!-- Content Section -->
      <div class="flex flex-col lg:flex-row lg:space-x-12 items-center px-4 lg:px-20">
        <!-- Image Section -->
        <div class="lg:w-1/2 mb-8 lg:mb-0">
          <img src="https://example.com/student-counseling.jpg" alt="Student Counseling" class="w-full rounded-lg shadow-lg">
        </div>
  
        <!-- Text Section -->
        <div class="lg:w-1/2 text-gray-700">
          <h2 class="text-3xl font-bold mb-4">We're Here to Help You</h2>
          <p class="mb-6">
            Our student counseling services aim to provide the support students need to overcome challenges 
            and thrive academically, socially, and emotionally. Whether you’re struggling with coursework, 
            personal issues, or just need someone to talk to, we're here for you.
          </p>
          <p class="mb-6">
            Our experienced counselors are trained to help you navigate any difficulty with confidentiality and care. 
            Schedule a session today, and let's work through it together.
          </p>
          <button class="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition">
            Book a Counseling Session
          </button>
        </div>
      </div>
  
      <!-- Icons Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-20">
        <div class="text-center">
          <div class="text-purple-600 text-6xl mb-4">🧠</div>
          <h3 class="text-xl font-bold">Mental Wellness</h3>
          <p class="text-gray-600 mt-2">We focus on your mental health and emotional well-being.</p>
        </div>
  
        <div class="text-center">
          <div class="text-purple-600 text-6xl mb-4">📖</div>
          <h3 class="text-xl font-bold">Academic Support</h3>
          <p class="text-gray-600 mt-2">Get the academic guidance you need to excel in your studies.</p>
        </div>
  
        <div class="text-center">
          <div class="text-purple-600 text-6xl mb-4">💬</div>
          <h3 class="text-xl font-bold">Confidential Counseling</h3>
          <p class="text-gray-600 mt-2">Talk to a counselor in complete confidence and trust.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentCounseling",
  };
  </script>
  
  <style scoped>
  /* You can add custom styles here if needed */
  </style>
  