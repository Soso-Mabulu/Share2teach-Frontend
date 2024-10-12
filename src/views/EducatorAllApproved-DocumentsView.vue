<script setup>
import EducatorSidebar from '@/components/EducatorSidebar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import EducatorNavbar from '@/components/EducatorNavbar.vue';
import FetchAllDocuments from '@/components/FetchAllDocuments.vue';



</script>

<template>
  <EducatorNavbar />
  <div>
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <EducatorSidebar />
      
      <!-- Main Content (PublicHero) -->
      <div class="flex-grow flex flex-col">
        <FetchAllDocuments />
      </div>
    </div>
  </div>
  
  <MainFooter />
</template>

<style scoped>
</style>
