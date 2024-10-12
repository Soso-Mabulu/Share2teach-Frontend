<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import AdminNavbar from '@/components/AdminNavbar.vue';
import MaintainDocuments from '@/components/MaintainDocuments.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AdminNavbar class="z-10" />
    <div class="flex-grow flex">
      <AdminSidebar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <MaintainDocuments />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>