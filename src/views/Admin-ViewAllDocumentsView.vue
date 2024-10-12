<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import AdminNavbar from '@/components/AdminNavbar.vue';
import ViewAllDocuments from '@/components/ViewAllDocuments.vue'

</script>

<template>
  <AdminNavbar />
  <div>
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <AdminSidebar />
      
      <!-- Main Content (PublicHero) -->
      <div class="flex-grow flex flex-col">
        <ViewAllDocuments />
      </div>
    </div>
  </div>
  
  <MainFooter />
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>
