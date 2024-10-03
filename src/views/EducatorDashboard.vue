<template>
    <div class="dashboard-layout">
      <SideBarEducator />
      <div class="main-content">
        <!-- Your main content goes here -->
      </div>
    </div>
  </template>
  
  <script setup>
  import SideBarEducator from '../components/SideBarEducator.vue';
  </script>
  
  <style scoped>
  .dashboard-layout {
    display: flex;
    margin-left: 250px; /* Adjust for the fixed sidebar width */
  }
  
  .main-content {
    flex-grow: 1;
    padding: 20px;
  }
  </style>
  