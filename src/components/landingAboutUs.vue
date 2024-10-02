<template>
  <section class="bg-gradient-to-b from-blue-50 to-white">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
          <img
            alt="About Us"
            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div class="lg:py-24">
          <h2 class="text-3xl font-bold sm:text-4xl">About Share to Teach</h2>

          <p class="mt-4 text-gray-600">
            At Share to Teach, we believe in the power of collaborative learning. Our platform
            connects educators and students to share resources and teaching strategies, fostering an
            engaging environment for all. We aim to empower individuals to learn effectively and
            become better educators.
          </p>
          <p class="mt-4 text-gray-600">
            Join us in transforming the educational experience by sharing knowledge, resources, and
            insights. Together, we can create a community where everyone can thrive and succeed in
            their learning journey.
          </p>

          <RouterLink
            to="/learn-more"
            class="mt-8 inline-block rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-yellow-400"
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
  color: #2563eb; /* Matching color with the gradient */
}
</style>
