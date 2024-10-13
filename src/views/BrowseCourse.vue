<template>
    <div class="min-h-screen bg-purple-50">
      <!-- Header Section -->
      <LandingNavbar /> <!-- Added the LandingNavbar component -->
  
      <!-- Main Content Section -->
      <div class="bg-purple-50 text-gray-800 py-16 px-8 text-center mt-10">
        <h1 class="text-5xl font-bold">Browse Courses</h1>
        <p class="mt-4 text-lg">Explore our wide range of online courses tailored for your learning needs.</p>
      </div>
  
      <div class="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard
            title="Introduction to Programming"
            description="Learn the basics of programming using Python."
            imageSrc="@/assets/programming.jpeg"
          />
          <CourseCard
            title="Digital Marketing"
            description="Understand the fundamentals of digital marketing."
            imageSrc="@/assets/marketing.jpeg"
          />
          <CourseCard
            title="Graphic Design Basics"
            description="Discover the principles of graphic design."
            imageSrc="@/assets/design.jpg"
          />
          <CourseCard
            title="Data Science Essentials"
            description="Dive into data analysis and visualization."
            imageSrc="@/assets/data-science.jpg"
          />
          <CourseCard
            title="Web Development Bootcamp"
            description="Build and launch your own website from scratch."
            imageSrc="@/assets/web-development.jpg"
          />
          <CourseCard
            title="Project Management"
            description="Learn how to manage projects effectively."
            imageSrc="@/assets/project-management.jpg"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import LandingNavbar from '@/components/LandingNavbar.vue'; // Import LandingNavbar
  import CourseCard from '@/components/CourseCard.vue'; // Import CourseCard
  
  export default {
    components: {
      LandingNavbar, // Register LandingNavbar
      CourseCard, // Register CourseCard
    },
  };
  </script>
  
  <style scoped>
  /* Add additional custom styling if necessary */
  </style>
  