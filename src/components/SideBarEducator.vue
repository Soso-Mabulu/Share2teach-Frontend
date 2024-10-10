<template>
    <div>
      <button class="toggle-btn" @click="toggleSidebar">☰</button>
      <div class="sidebar" v-if="isSidebarVisible">
        <button class="close-btn" @click="toggleSidebar">✖</button>
        <h2>Dashboard</h2>
        <ul>
          <li>
            <RouterLink to="/dashboard" class="dashboard-link">
              <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="icon" />
              Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/subject">
              <font-awesome-icon :icon="['fas', 'book']" class="icon" />
              Subject
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/search">
              <font-awesome-icon :icon="['fas', 'search']" class="icon" />
              Search
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/contributors">
              <font-awesome-icon :icon="['fas', 'users']" class="icon" />
              Contributors
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/faq">
              <font-awesome-icon :icon="['fas', 'question-circle']" class="icon" />
              FAQ
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/self-directed-learning">
              <font-awesome-icon :icon="['fas', 'graduation-cap']" class="icon" />
              Self Directed Learning
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="search-container">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input type="text" placeholder="Search..." class="search-input" v-model="searchQuery" />
        <font-awesome-icon :icon="['fas', 'times']" class="clear-icon" @click="clearSearch" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faTachometerAlt, faBook, faSearch, faUsers, faQuestionCircle, faGraduationCap, faTimes } from '@fortawesome/free-solid-svg-icons';
  
  library.add(faTachometerAlt, faBook, faSearch, faUsers, faQuestionCircle, faGraduationCap, faTimes);
  
  const isSidebarVisible = ref(false);
  const searchQuery = ref('');
  
  function toggleSidebar() {
    isSidebarVisible.value = !isSidebarVisible.value;
  }
  
  function clearSearch() {
    searchQuery.value = '';
  }
  </script>
  
  <style scoped>
  body {
    background-color: #f5f5f5; /* Off-white background */
  }
  
  .sidebar {
    width: 300px; /* Enlarged sidebar */
    height: 100vh; /* Full viewport height */
    background-color: #4a148c; /* Darker purple */
    padding: 20px;
    position: fixed; /* Fix the sidebar position */
    top: 0;
    left: 0; /* Align to the left edge */
    transition: transform 0.3s ease-in-out;
  }
  
  .toggle-btn {
    position: fixed;
    top: 10px;
    left: 10px;
    background: none;
    border: none;
    color: #6e0c8b;
    font-size: 24px;
    cursor: pointer;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  .sidebar h2 {
    color: #ffffff; /* White text */
    margin-bottom: 20px;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar li {
    margin-bottom: 10px;
  }
  
  .sidebar a {
    text-decoration: none;
    color: #ffffff; /* White text */
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 10px; /* Rounded corners */
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .sidebar a:hover {
    background-color: #6a1b9a; /* Slightly lighter purple */
  }
  
  .dashboard-link:hover {
    background-color: #dfcce5; /* Different hover color for Dashboard */
    transform: scale(1.05); /* Slightly enlarge on hover */
  }
  
  .icon {
    margin-right: 10px;
    width: 24px; /* Larger icons */
    height: 24px;
  }
  
  .search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff; /* White background */
    border: 2px solid #4a148c; /* Purple border */
    border-radius: 20px;
    padding: 5px;
    width: 300px; /* Smaller size */
  }
  
  .search-input {
    flex: 1;
    padding: 5px;
    border: none;
    border-radius: 20px;
    outline: none;
  }
  
  .search-icon {
    margin-right: 10px;
    color: #4a148c;
  }
  
  .clear-icon {
    margin-left: 10px;
    cursor: pointer;
    color: #4a148c;
  }
  </style>
  