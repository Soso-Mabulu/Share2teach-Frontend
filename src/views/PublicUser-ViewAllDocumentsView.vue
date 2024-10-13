<script setup>
import Sidebar from '@/components/PublicUserSideBar.vue'; // Adjust the import path as necessary
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import MainNavbar from '@/components/MainNavbar.vue'; // Import the MainNavbar component
import AllDocuments from '@/components/PublicUserAllDocuments.vue';
</script>

<template>
  <div class="public-user-view">
    <MainNavbar />
    <div class="main-content">
      <Sidebar />
      <div class="hero-container">
        <AllDocuments />
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
.public-user-view {
  display: flex;
  flex-direction: column; /* Stack navbar and footer vertically */
  height: 100vh; /* Full viewport height */
}

.main-content {
  display: flex; /* Side by side layout */
  flex-grow: 1; /* Fill the space between navbar and footer */
}

.sidebar {
  width: 30%; /* Sidebar takes 30% of the width */
  flex-shrink: 0; /* Prevent sidebar from shrinking */
  /* Removed background color */
  /* Removed shadow */
}

.hero-container {
  width: 100%; /* Adjust width as necessary */
  padding: 20px; /* Add padding for spacing */
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column; /* Stack on smaller screens */
  }

  .sidebar,
  .hero-container {
    width: 100%; /* Full width on mobile */
  }
}
</style>
