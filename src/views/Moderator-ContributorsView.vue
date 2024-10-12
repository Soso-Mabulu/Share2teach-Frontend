<script setup>
import ModaratorSidebar from '@/components/ModaratorSidebar.vue';
import MainFooter from '@/components/MainFooter.vue';
import ModaratorNavbar from '@/components/ModaratorNavbar.vue';
import ContributorsComponent from '@/components/ContributorsComponent.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <ModaratorNavbar class="z-10" />
    <div class="flex-grow flex">
      <ModaratorSidebar class="hidden lg:block flex-shrink-0" />
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