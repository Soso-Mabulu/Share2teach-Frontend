<template>
    <div class="faq-page"> <!-- Apply the faq-page class here -->
      <MainNavbar /> <!-- Navbar at the top -->
      
      <div class="flex flex-1"> <!-- Main content area -->
        <SideBar class="h-full" /> <!-- Sidebar under the navbar -->
  
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
  import SideBar from '@/components/PublicUserSideBar.vue'; // Import EducatorSideBar
  import MainNavbar from '@/components/MainNavbar.vue'; // Import EducatorNavBar
  import MainFooter from '@/components/MainFooter.vue'; // Import MainFooter
  
  export default {
    name: 'FAQView',
    components: {
      FetchFAQ,
      SideBar,
      MainNavbar,
      MainFooter, // Register the MainFooter component
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styling if needed */
  </style>
  