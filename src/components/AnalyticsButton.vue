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
    background: linear-gradient(to right, #739ea9, #f7f5f8, #2c4475); /* Similar gradient */
    border: none;
    border-radius: 9999px; /* Rounded full to match 'View' button */
    padding: 7px 20px;
    cursor: pointer;
    font-weight: bold;
    color: rgb(44, 25, 46); /* Adjusted for better contrast */
    width: 150px;
    transition: transform 0.3s ease-in-out, background 0.3s ease-in-out;
  }
  
  .view-all:hover {
    transform: scale(1.05); /* Slight scale on hover */
    background: linear-gradient(to right, #c2b2c7, #f8f1fa, #e4e3e4); /* Darker gradient on hover */
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
  