<script setup>
import PublicUserSideBar from '@/components/PublicUserSideBar.vue';
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import PublicUserNavbar from '@/components/PublicUserNavbar.vue'; // Import the MainNavbar component
import FetchFAQ from '@/components/FetchFAQ.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <PublicUserNavbar class="z-10" />
    <div class="flex-grow flex">
      <PublicUserSideBar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <FetchFAQ />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* No changes to styles or colors; focus only on layout */
</style>
