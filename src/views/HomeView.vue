<script setup>
import Navbar from '@/components/LandingNavbar.vue'
import LandingHero from '@/components/LandingHero.vue'
import LandingAboutUs from '@/components/landingAboutUs.vue' // Corrected casing for the import
import LandingFeatures from '@/components/LandingFeatures.vue'
import RecentUploadedDocuments from '@/components/RecentUploadedDocuments.vue'
import LandingFAQ from '@/components/LandingFAQ.vue'
import LandingFooter from '@/components/LandingFooter.vue'
import LandingContactUs from '@/components/LandingContactUs.vue' // Import the LandingContactUs component
import LandingService from '@/components/LandingService.vue' // Import the LandingService component
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
      <LandingService /> <!-- Added LandingService component -->
      <LandingContactUs /> <!-- Added LandingContactUs component -->
    </main>

    <!-- Footer component -->
    <LandingFooter />
  </div>
</template>

<style scoped>

</style>
