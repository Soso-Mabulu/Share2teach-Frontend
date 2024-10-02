<script setup>
import Navbar from '@/components/LandingNavbar.vue'
import LandingHero from '@/components/LandingHero.vue'
import LandingAboutUs from '@/components/landingAboutUs.vue' // Corrected casing for the import
import LandingFeatures from '@/components/LandingFeatures.vue'
import RecentUploadedDocuments from '@/components/RecentUploadedDocuments.vue'
import LandingFAQ from '@/components/LandingFAQ.vue'
import LandingFooter from '@/components/LandingFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar component -->
    <Navbar class="mb-8" />

    <!-- Main content with padding and spacing -->
    <main class="flex-1">
      <LandingHero />
      <LandingAboutUs />
      <RecentUploadedDocuments />
      <LandingFeatures />
      <LandingFAQ />
    </main>

    <!-- Footer component -->
    <LandingFooter />
  </div>
</template>

<style scoped>
/* Add additional global styles here if needed */
</style>
