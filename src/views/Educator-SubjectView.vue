<script setup>
import EducatorSidebar from '@/components/EducatorSidebar.vue';
import MainFooter from '@/components/MainFooter.vue';
import EducatorNavbar from '@/components/EducatorNavbar.vue';
import EducatorSubject from '@/components/EducatorSubject.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <EducatorNavbar class="z-10" />
    <div class="flex-grow flex">
      <EducatorSidebar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <EducatorSubject />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* You can add any additional styles here if needed */
</style>