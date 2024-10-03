<template>
    <div class="hero-container">
      <!-- Search Bar Section -->
      <div class="search-bar-section">
        <input type="text" placeholder="Search..." class="search-bar" />
      </div>
  
      <!-- Document Grid Section -->
      <div class="document-grid-section">
        <div class="document-item">DOCUMENT</div>
        <div class="document-item">DOCUMENT</div>
        <div class="document-item">DOCUMENT</div>
      </div>
  
      <!-- Trending Documents Section -->
      <div class="trending-section">
        <h2 class="section-title">TRENDING DOCUMENTS</h2>
        <div class="trending-docs">
          <div class="document-item">TRENDING DOCUMENT</div>
          <div class="document-item">TRENDING DOCUMENT</div>
          <div class="document-item">TRENDING DOCUMENT</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PublicHero',
  };
  </script>
  
  <style scoped>
  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    margin: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar-section {
    margin-bottom: 30px;
  }
  
  .search-bar {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    max-width: 400px;
  }
  
  .document-grid-section {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 40px;
  }
  
  .document-item {
    background-color: #eef1f3;
    padding: 20px;
    border-radius: 5px;
    min-width: 150px;
    text-align: center;
  }
  
  .trending-section {
    width: 100%;
    text-align: left;
  }
  
  .section-title {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #343a40;
  }
  
  .trending-docs {
    display: flex;
    gap: 10px;
  }
  </style>
  