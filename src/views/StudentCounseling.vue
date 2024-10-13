<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Landing Navbar -->
    <LandingNavbar />

    <!-- Page Title with adjusted spacing -->
    <div class="text-center mt-16 mb-12"> <!-- Added 'mt-16' to move the content down -->
      <h1 class="text-5xl font-bold text-gray-800 mb-4">Student Counseling Services</h1>
      <p class="text-lg text-gray-600">Supporting students for a better academic and personal experience</p>
    </div>

    <!-- Text Section (Centered) -->
    <div class="max-w-3xl mx-auto text-center text-gray-700 px-4 lg:px-20">
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
import LandingNavbar from '@/components/LandingNavbar.vue'; // Import the LandingNavbar

export default {
  name: "StudentCounseling",
  components: {
    LandingNavbar, // Register the LandingNavbar component
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
