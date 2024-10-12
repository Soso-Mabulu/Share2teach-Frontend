<template>
  <div class="faq-page"> <!-- Apply the faq-page class here -->
    <EducatorNavBar /> <!-- Navbar at the top -->
    
    <div class="flex flex-1"> <!-- Main content area -->
      <EducatorSideBar class="h-full" /> <!-- Sidebar under the navbar -->

      <div class="flex-1 flex flex-col items-center justify-start"> <!-- Center content -->
        <div class="w-full max-w-4xl px-4 py-4"> <!-- Center the content and add some padding -->
          <div class="relative w-full"> <!-- Added w-full for the content area -->
            <div class="flex flex-col"> <!-- Flexbox for the main content -->
              <FetchFAQ /> <!-- FetchFAQ component here -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <MainFooter /> <!-- Footer at the bottom -->
  </div>
</template>

<script>
import FetchFAQ from '@/components/FetchFAQ.vue';
import EducatorSideBar from '@/components/EducatorSidebar.vue'; // Import EducatorSideBar
import EducatorNavBar from '@/components/EducatorNavbar.vue'; // Import EducatorNavBar
import MainFooter from '@/components/MainFooter.vue'; // Import MainFooter

export default {
  name: 'FAQView',
  components: {
    FetchFAQ,
    EducatorSideBar,
    EducatorNavBar,
    MainFooter, // Register the MainFooter component
  },
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
