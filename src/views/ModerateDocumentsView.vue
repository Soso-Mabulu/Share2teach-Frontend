<script setup>
import ModaratorSidebar from '@/components/ModaratorSidebar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import ModaratorNavbar from '@/components/ModaratorNavbar.vue';
import ModerateDocuments from '@/components/ModerateDocuments.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <ModaratorNavbar class="z-10" />
    <div class="flex-grow flex">
      <ModaratorSidebar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <ModerateDocuments />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>
