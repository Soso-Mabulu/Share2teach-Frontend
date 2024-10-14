<script setup>
import ModaratorSidebar from '@/components/ModaratorSidebar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import ModaratorNavbar from '@/components/ModaratorNavbar.vue';
import ModaratorHome from '@/components/ModaratorHome.vue';

</script>

<template>
  <ModaratorNavbar style="position: fixed; top: 0; width: 100%; z-index: 1000;" />
  <div>
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <ModaratorSidebar />
      
      <!-- Main Content (PublicHero) -->
      <div class="flex-grow flex flex-col">
        <ModaratorHome />
      </div>
    </div>
  </div>
  
  <MainFooter />
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>
