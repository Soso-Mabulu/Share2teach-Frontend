<script setup>
import MainFooter from '@/components/MainFooter.vue';
import PublicUserNavbar from '@/components/PublicUserNavbar.vue';
import SelfDirectedLeaning from '@/components/SelfDirectedLearning.vue';
import PublicUserSideBar from '@/components/PublicUserSideBar.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <PublicUserNavbar class="z-10" />
    <div class="flex-grow flex">
      <PublicUserSideBar class="hidden lg:block flex-shrink-0" />
      <main class="flex-grow overflow-auto">
        <SelfDirectedLeaning />
      </main>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
/* You can add any additional styles here if needed */
</style>