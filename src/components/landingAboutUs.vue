<template>
  <section class="bg-gradient-to-b from-[var(--color-purple-light)] to-white">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div
          class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full transition-transform duration-500 ease-in-out transform hover:scale-105"
        >
          <img
            alt="About Us"
            src="@/assets/favicon.png"
            class="absolute inset-0 h-full w-full object-cover opacity-0 animate-fadeIn"
          />
        </div>

        <div class="lg:py-24">
          <h2 class="text-3xl font-bold sm:text-4xl text-purple-800 animate-slideIn">
            About Share to Teach
          </h2>

          <p class="mt-4 text-gray-600 animate-slideIn delay-200">
            At Share to Teach, we believe in the power of collaborative learning. Our platform
            connects educators and students to share resources and teaching strategies, fostering an
            engaging environment for all. We aim to empower individuals to learn effectively and
            become better educators.
          </p>
          <p class="mt-4 text-gray-600 animate-slideIn delay-400">
            Join us in transforming the educational experience by sharing knowledge, resources, and
            insights. Together, we can create a community where everyone can thrive and succeed in
            their learning journey.
          </p>

          <RouterLink
            to="/learn-more"
            class="mt-8 inline-block rounded-full bg-purple-600 px-12 py-3 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300 animate-slideIn delay-600"
          >
            View More
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Additional styling for consistent spacing and aesthetics */
section {
  overflow: hidden;
}

h2 {
  color: #5b21b6; /* Darker purple for the heading */
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide-in animation */
@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Applying animations */
.animate-fadeIn {
  animation: fadeIn 1s forwards;
}

.animate-slideIn {
  animation: slideIn 1s forwards;
}
</style>
