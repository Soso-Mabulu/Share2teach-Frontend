<script setup>
import Sidebar from '@/components/SideBar.vue'; // Adjust the import path as necessary
import PublicHero from '@/components/PublicHero.vue'; // Import the PublicHero component
import MainFooter from '@/components/MainFooter.vue'; // Import the Footer
import MainNavbar from '@/components/MainNavbar.vue'; // Import the MainNavbar component
import PublicDocumentSearch from '@/components/PublicDocumentSearch.vue'; // Import the PublicDocumentSearch component
</script>

<template>
  <div class="layout">
    <MainNavbar />
    <div class="main-content">
      <Sidebar />
      <div class="hero-search-container">
        <PublicDocumentSearch class="search-container" />
        <PublicHero />
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

.main-content {
  display: flex; /* Side by side layout */
  flex-grow: 1; /* Fill the space between navbar and footer */
}

.sidebar {
  width: 30%; /* Sidebar takes 30% of the width */
  flex-shrink: 0; /* Prevent sidebar from shrinking */
}

.hero-search-container {
  width: 70%; /* Hero and search container take 70% of the width */
  display: flex;
  flex-direction: column;
  height: 100%; /* Fill available height */
  justify-content: space-between; /* Distribute space evenly */
  padding: 20px; /* Add padding to create equal space around components */
}

.search-container {
  margin-top: 0; /* No additional margin */
}

.public-document-search {
  flex: 0 0 auto; /* Keep the document search to its content size */
}

.public-hero {
  flex: 1; /* Fill the remaining space */
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column; /* Stack on smaller screens */
  }

  .main-content {
    flex-direction: column; /* Stack sidebar and content */
  }

  .sidebar {
    width: 100%; /* Full width on mobile */
    order: -1; /* Move sidebar above main content */
  }

  .hero-search-container {
    width: 100%; /* Full width on mobile */
  }
}
</style>
