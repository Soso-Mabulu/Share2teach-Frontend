<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Updated Hero Section with top-to-bottom gradient -->
    <section
      class="bg-gradient-to-b from-purple-100 via-white to-white flex-grow flex items-center justify-center px-4 py-32"
    >
      <div
        class="container mx-auto flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0"
      >
        <!-- Hero Text Section -->
        <div class="max-w-lg text-center lg:text-left lg:w-1/2 lg:ml-4">
          <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-800 mb-6">
            Learn Efficiently. <br />
            <span class="text-purple-600">Share Knowledge.</span>
          </h1>
          <p class="text-lg text-gray-700 mb-8">
            Join our platform and start your journey towards effective learning and teaching, with
            resources designed for every student and teacher.
          </p>

          <!-- Call-to-action buttons with updated styles -->
          <div class="flex flex-col lg:flex-row gap-4">
            <RouterLink
              to="/login"
              class="block w-full lg:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
            >
              Get Started
            </RouterLink>

            <RouterLink
              to="/learn-more"
              class="block w-full lg:w-auto border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition duration-300"
            >
              Learn More
            </RouterLink>
          </div>
        </div>

        <!-- Educational Image Section -->
        <div class="hidden lg:block lg:max-w-2xl lg:max-h-[600px] mt-12 lg:mt-0 lg:ml-16">
          <img
            src="@/assets/landinghero.jpg"
            alt="Educational"
            class="rounded-full shadow-lg animate-bounce w-full h-auto"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Additional styling to match navbar flow */
h1 span {
  color: #9333ea; /* Purple text to match the gradient */
}

nav button {
  transition: transform 0.2s ease-in-out;
}

nav button:hover {
  transform: scale(1.05);
}
</style>
