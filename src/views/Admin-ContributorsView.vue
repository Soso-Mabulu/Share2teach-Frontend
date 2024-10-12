<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue';
import MainFooter from '@/components/MainFooter.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';
import ContributorsComponent from '@/components/ContributorsComponent.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AdminNavbar class="z-10" />
    <div class="flex-grow flex">
      <AdminSidebar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <ContributorsComponent />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* You can add any additional styles here if needed */
</style>