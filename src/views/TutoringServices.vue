<template>
    <div>
      <!-- Hero Section -->
      <div class="relative bg-gray-900 text-white">
        <img
          class="absolute  bg-gray-900 inset-0 h-full w-full object-cover opacity-60"
          
        />
        <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <h1 class="text-4xl font-bold mb-4">Personalized Tutoring Services</h1>
          <p class="text-lg mb-8 max-w-2xl text-center">
            We provide one-on-one tutoring tailored to your needs, helping students achieve their full academic potential.
          </p>
          <button class="bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-700 transition">
            Get Started
          </button>
        </div>
      </div>
  
      <!-- Benefits Section -->
      <div class="py-16 bg-white">
        <h2 class="text-3xl font-bold text-center mb-8">Why Choose Our Tutoring Services?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-12">
          <div class="bg-gray-100 p-10 rounded-lg text-center shadow-md flex flex-col justify-between">
            <div class="flex justify-center mb-4">
              <i class="fas fa-user-graduate text-purple-600 text-5xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Expert Tutors</h3>
            <p>Our tutors are highly qualified professionals dedicated to helping you succeed.</p>
          </div>
          <div class="bg-gray-100 p-10 rounded-lg text-center shadow-md flex flex-col justify-between">
            <div class="flex justify-center mb-4">
              <i class="fas fa-clock text-purple-600 text-5xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Flexible Scheduling</h3>
            <p>We offer convenient tutoring times to fit your busy schedule.</p>
          </div>
          <div class="bg-gray-100 p-10 rounded-lg text-center shadow-md flex flex-col justify-between">
            <div class="flex justify-center mb-4">
              <i class="fas fa-chalkboard-teacher text-purple-600 text-5xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Personalized Approach</h3>
            <p>Each session is customized to target your specific needs and learning style.</p>
          </div>
        </div>
      </div>
  
      <!-- Testimonials Section -->
      <div class="py-16 bg-gray-50">
        <h2 class="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
        <div class="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"The tutoring sessions helped me understand complex topics better and improved my grades significantly. The tutor was patient and knowledgeable!"</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Kamogelo Molefe</h4>
                <p class="text-sm">High School Student</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"I felt much more confident after a few sessions. The personalized approach made a huge difference for me."</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Lesego Smith</h4>
                <p class="text-sm">College Student</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"The tutors helped me not just to pass my exams, but to truly understand the material. I couldn't be more grateful!"</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Thabo Nkosi</h4>
                <p class="text-sm">University Student</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"I appreciate how my tutor adapted to my learning style. I feel much more confident in my studies now!"</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Sipho Mokoena</h4>
                <p class="text-sm">High School Student</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"The tutoring sessions were very helpful, and I learned a lot in a short amount of time!"</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Ayanda Mthethwa</h4>
                <p class="text-sm">College Student</p>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg p-10">
            <p class="text-lg italic mb-4">"My grades improved significantly after working with my tutor. I highly recommend their services!"</p>
            <div class="flex items-center">
              <div>
                <h4 class="text-lg font-bold">Mpho Letsoalo</h4>
                <p class="text-sm">High School Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TutoringServices",
  };
  </script>
  
  <style scoped>
  /* You can add additional styles here */
  </style>
  