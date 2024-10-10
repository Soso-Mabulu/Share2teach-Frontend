<template>
  <div class="dashboard">
    <h1 class="admin-title">Admin Dashboard</h1>
    <div class="analytics">
      <!-- Loop over cardDataOptions to dynamically generate cards -->
      <div class="card" v-for="(cardData, index) in cardDataOptions" :key="index">
        <h2 class="counts-title">{{ cardData.title }}</h2>
        <p><i class="fas" :class="cardData.icon"></i> {{ cardData.value }}</p>

        <!-- AnalyticsButton integrated here -->
        <AnalyticsButton
          :endpoint="cardData.endpoint"
          :buttonLabel="cardData.buttonLabel"
          class="results-button"
        />

        <!-- Display results below each card -->
        <div v-if="showResults[index]" class="results-layout">
          <pre>{{ results[index] }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnalyticsButton from './AnalyticsButton.vue';
import axios from 'axios';

export default {
  components: {
    AnalyticsButton,
  },
  data() {
    return {
      // Array of data objects for each card in the dashboard
      cardDataOptions: [
        {
          title: 'DOCUMENTS',
          icon: 'fa-file-alt',
          value: 0, // Placeholder, will be updated
          endpoint: '/api/admin/all-documents',
          buttonLabel: 'View All Documents',
        },
        {
          title: 'USERS',
          icon: 'fa-users',
          value: 0, // Placeholder, will be updated
          endpoint: '/api/admin/all-users',
          buttonLabel: 'View All Users',
        },
        {
          title: 'USER SIGNUPS',
          icon: 'fa-user-plus',
          value: 0, // Placeholder, will be updated
          endpoint: '/api/admin/all-signups',
          buttonLabel: 'View All Signups',
        },
        {
          title: 'UPLOADED DOCUMENTS',
          icon: 'fa-upload',
          value: 0, // Placeholder, will be updated
          endpoint: '/api/admin/all-uploaded-docs',
          buttonLabel: 'View All Uploaded Docs',
        },
        {
          title: 'AVERAGE RATINGS',
          icon: 'fa-star',
          value: 0, // Placeholder, will be updated
          endpoint: '/api/admin/all-ratings',
          buttonLabel: 'View All Ratings',
        },
      ],
      // Track which card results are being displayed
      showResults: [],
      // Store the fetched results for each card
      results: [],
    };
  },
  mounted() {
    // Initialize the dashboard by fetching data for each card
    this.fetchData();
    // Initialize showResults to be false for each card
    this.showResults = new Array(this.cardDataOptions.length).fill(false);
  },
  methods: {
    // Fetch data for each card from the corresponding API endpoints
    async fetchData() {
      try {
        const allResults = await Promise.all(
          this.cardDataOptions.map((card) =>
            axios.get(card.endpoint) // Fetch data from each endpoint
          )
        );

        // Update the card values and results with the fetched data
        for (let i = 0; i < allResults.length; i++) {
          const data = allResults[i].data;
          this.cardDataOptions[i].value = data.count || data.some_value; // Adjust as needed
          this.results[i] = JSON.stringify(data, null, 2); // Format the JSON results
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    // Toggle the display of results for a particular card
    toggleResults(index) {
      this.showResults[index] = !this.showResults[index];
      if (this.showResults[index] && !this.results[index]) {
        axios
          .get(this.cardDataOptions[index].endpoint)
          .then((response) => {
            this.results[index] = JSON.stringify(response.data, null, 2);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            this.results[index] = 'Error fetching data.';
          });
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  background: linear-gradient(to right, #8E2DE2, #4A00E0); /* Gradient background */
  padding: 20px;
  color: #fff;
}

.admin-title {
  text-align: center;
  font-size: 2.5rem;
  color: #fff;
}

.analytics {
  display: flex;
  flex-wrap: wrap; /* Wrap cards on smaller screens */
  gap: 20px;
  justify-content: space-between;
}

.card {
  background-color: #fff; /* White background for cards */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center; /* Center align content */
  flex: 1; /* Cards take equal width */
  min-width: 250px; /* Ensure a reasonable minimum width */
}

.card h2 {
  color: #4A00E0; /* Match gradient color */
}

.card p {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333; /* Text color */
}

.card i {
  margin-right: 10px; /* Increased space between icon and text */
  font-size: 20px;
  color: #4A00E0; /* Match card title color */
}

.results-layout {
  margin-top: 10px;
  background-color: #f3f3f3; /* Light gray background for readability */
  padding: 15px;
  border-radius: 5px;
  max-width: 80%;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  color: #333;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.view-all {
  background: #4A00E0; /* Button color */
  color: #fff; /* White text */
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.view-all:hover {
  background: #3A00C0; /* Darker shade on hover */
}
</style>
