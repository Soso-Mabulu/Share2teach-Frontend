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
  </div>
</template>

<script>
import FetchFAQ from '@/components/FetchFAQ.vue';
import EducatorSideBar from '@/components/EducatorSidebar.vue'; // Import EducatorSideBar
import EducatorNavBar from '@/components/EducatorNavbar.vue'; // Import EducatorNavBar

export default {
  name: 'FAQView',
  components: {
    FetchFAQ,
    EducatorSideBar,
    EducatorNavBar,
  },
};
</script>

<style scoped>


</style>
