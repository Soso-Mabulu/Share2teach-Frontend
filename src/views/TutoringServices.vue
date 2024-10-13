<template>
  <div class="bg-gradient-to-l from-purple-300 to-purple-50 text-gray-800"> <!-- Gradient background for the entire page -->
    <!-- Header Section -->
    <LandingNavbar /> <!-- Added the LandingNavbar component -->

    <!-- Hero Section -->
    <div class="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center"> <!-- Centered text -->
      <div class="relative z-10">
        <h1 class="text-5xl font-bold mb-4">Personalized Tutoring Services</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          We provide one-on-one tutoring tailored to your needs, helping students achieve their full academic potential.
        </p>
      </div>
      <!-- Optional Image -->
      <div class="hidden lg:block lg:w-1/2">
        <!--<img src="@/assets/tutoring.jpg" alt="Tutoring Image" class="rounded-lg shadow-lg max-w-xs mx-auto lg:max-w-full lg:h-auto" />-->
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="py-16 bg-gray-100">
      <h2 class="text-4xl font-bold text-center mb-8">Why Choose Our Tutoring Services?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-12">
        <div class="bg-purple-100 p-8 rounded-lg text-center shadow-md flex flex-col justify-between">
          <div class="flex justify-center mb-4">
            <i class="fas fa-user-graduate text-purple-600 text-5xl"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">Expert Tutors</h3>
          <p class="text-gray-700">Our tutors are highly qualified professionals dedicated to helping you succeed.</p>
        </div>
        <div class="bg-purple-100 p-8 rounded-lg text-center shadow-md flex flex-col justify-between">
          <div class="flex justify-center mb-4">
            <i class="fas fa-clock text-purple-600 text-5xl"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">Flexible Scheduling</h3>
          <p class="text-gray-700">We offer convenient tutoring times to fit your busy schedule.</p>
        </div>
        <div class="bg-purple-100 p-8 rounded-lg text-center shadow-md flex flex-col justify-between">
          <div class="flex justify-center mb-4">
            <i class="fas fa-chalkboard-teacher text-purple-600 text-5xl"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">Personalized Approach</h3>
          <p class="text-gray-700">Each session is customized to target your specific needs and learning style.</p>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-16 bg-gray-100">
      <h2 class="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
      <div class="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"The tutoring sessions helped me understand complex topics better and improved my grades significantly. The tutor was patient and knowledgeable!"</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Kamogelo Molefe</h4>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"I felt much more confident after a few sessions. The personalized approach made a huge difference for me."</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Lesego Smith</h4>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"The tutors helped me not just to pass my exams, but to truly understand the material. I couldn't be more grateful!"</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Thabo Nkosi</h4>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"I appreciate how my tutor adapted to my learning style. I feel much more confident in my studies now!"</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Sipho Mokoena</h4>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"The tutoring sessions were very helpful, and I learned a lot in a short amount of time!"</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Ayanda Mthethwa</h4>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-10">
          <p class="text-lg italic mb-4">"My grades improved significantly after working with my tutor. I highly recommend their services!"</p>
          <div class="flex items-center">
            <div>
              <h4 class="text-lg font-bold">Mpho Letsoalo</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LandingNavbar from '@/components/LandingNavbar.vue'; // Import LandingNavbar

export default {
  name: "TutoringServices",
  components: {
    LandingNavbar, // Register LandingNavbar
  },
};
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>
