<template>
    <div class="button-container">
      <button class="view-all" @click="toggleResults">
        {{ buttonLabel }}
      </button>
      <div v-if="showResults" class="results-layout">
        <pre>{{ results }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      endpoint: {
        type: String,
        required: true,
      },
      buttonLabel: {
        type: String,
        default: "View Data",
      },
    },
    data() {
      return {
        results: null,
        showResults: false,
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get(this.endpoint);
          this.results = JSON.stringify(response.data, null, 2); // Formatted JSON
        } catch (error) {
          console.error("Error fetching data:", error);
          this.results = "Error fetching data. Please check the console for details.";
        }
      },
      toggleResults() {
        this.showResults = !this.showResults;
        if (this.showResults) {
          this.fetchData();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .button-container {
    display: flex;
    flex-direction: column; /* Stack the button and results vertically */
    align-items: center;
    margin-top: 10px;
  }
  
  .view-all {
    background-color: #f8ecfb;
    border: none;
    border-radius: 2px;
    padding: 7px;
    cursor: pointer;
    font-weight: bold;
    color: rgb(4, 0, 5);
    width: 150px;
    transition: background 0.3s ease;
  }
  
  .view-all:hover {
    background-color: rgba(80, 77, 126, 0.438);
  }
  
  /* Style for the results layout */
  .results-layout {
    margin-top: 10px; /* Space between the button and the results */
    background-color: #f3f3f3; /* Light gray background for readability */
    padding: 15px;
    border-radius: 5px;
    max-width: 80%; /* Limit width so it doesn't stretch across the whole page */
    max-height: 300px; /* Set a max height with scroll */
    overflow-y: auto;
    white-space: pre-wrap; /* Keeps formatting for long texts */
    color: #333; /* Darker text color for better contrast */
    font-family: 'Courier New', Courier, monospace; /* Monospace font for code display */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  