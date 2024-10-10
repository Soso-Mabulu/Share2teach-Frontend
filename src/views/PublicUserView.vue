<script setup>
import Sidebar from '@/components/SideBar.vue'; // Adjust the import path as necessary
import PublicHero from '@/components/PublicHero.vue'; // Import the PublicHero component
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import MainNavbar from '@/components/MainNavbar.vue';
import PublicDocumentSearch from '@/components/PublicDocumentSearch.vue'; // Import the PublicDocumentSearch component
</script>

<template>
  <MainNavbar />
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-grow flex flex-col">
      <!-- Search bar component (always on top) -->
      <PublicDocumentSearch /> <!-- Search input component that navigates to results -->
      
      <!-- Hero Section -->
      <PublicHero /> <!-- Ensure PublicHero takes up available space -->

      <!-- Footer -->
      <MainFooter />
    </div>
  </div>
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
.min-h-screen {
  min-height: 100vh; /* Full screen height */
}

.flex-grow {
  flex-grow: 1; /* Ensure the main content takes up available space */
}

.flex-col {
  display: flex;
  flex-direction: column; /* Stacks items vertically */
}

.lg\\:flex-row {
  flex-direction: row; /* On larger screens, layout in rows */
}

@media (min-width: 1024px) {
  .lg\\:flex-row {
    flex-direction: row; /* On large screens, apply row layout */
  }
}
</style>
