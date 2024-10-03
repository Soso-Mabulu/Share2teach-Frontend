<script setup>
import Sidebar from '@/components/Sidebar.vue'; // Adjust the import path as necessary
import PublicHero from '@/components/PublicHero.vue'; // Import the PublicHero component
import LandingFooter from '@/components/LandingFooter.vue'; // Import the Footer
import MainNavbar from '@/components/MainNavbar.vue';
</script>

<template>
  <MainNavbar />
  <div>
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content (PublicHero) -->
      <div class="flex-grow flex flex-col">
        <PublicHero /> <!-- Ensure PublicHero takes up available space -->
        
        <!-- Footer -->
        <LandingFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>
