<template>
    <div class="min-h-screen bg-gray-100">
      <div class="flex">
        <div class="w-64">
          <FAQSideBar /> <!-- Sidebar positioned here -->
        </div>
        <div class="flex-grow flex flex-col items-center"> <!-- Added flex and items-center to center the content -->
          <div class="relative w-full"> <!-- Added w-full for the navbar and content area -->
            <FAQNavBar />
            <div class="flex flex-col px-4 pt-16"> <!-- Added padding-top to avoid overlap with the NavBar -->              <FetchFAQ />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FetchFAQ from '@/components/FetchFAQ.vue';
  import FAQNavBar from '@/components/FAQNavBar.vue';
  import FAQSideBar from '@/components/FAQSideBar.vue'; // Import the FAQSideBar component
  
  export default {
    name: 'FAQView',
    components: {
      FetchFAQ,
      FAQNavBar,
      FAQSideBar, // Register the FAQSideBar component
    },
  };
  </script>
  
  <style scoped>
  /* Ensure the navbar takes the full width of the screen */
  nav {
    width: 100%; /* Ensure navbar takes full width */
    position: sticky; /* Change to sticky for better behavior on scroll */
    top: 0; /* Position at the top */
    left: 0; /* Align to the left */
    background-color: white; /* Optional: Add background for contrast */
    z-index: 100; /* Ensure it is above other content */
  }
  
  /* Optional: Adjust the sidebar style */
  .sidebar {
    background: #f7fafc; /* Example background color */
  }
  
  /* Additional styling for content spacing */
  .pt-16 { /* Padding-top for the main content to avoid overlap with the navbar */
    padding-top: 4rem; /* Adjust as necessary based on the navbar height */
  }
  
  /* Centering adjustments */
  .flex-grow {
    display: flex;
    justify-content: center; /* Center the content horizontally */
    align-items: flex-start; /* Align the content at the start vertically */
  }
  </style>
  