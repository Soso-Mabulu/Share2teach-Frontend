<template>
  <div>
    <div class="dashboard">
      <h1 class="admin-title">Admin Dashboard</h1>
      <div class="analytics">
        <div class="card" v-for="(cardData, index) in cardDataOptions" :key="index">
          <img :src="cardData.icon" class="card-icon" alt="Icon" />
          <h2 class="counts-title">{{ cardData.title }}</h2>
          <p>{{ cardData.value }}</p>
          <AnalyticsButton
            :endpoint="cardData.endpoint"
            :buttonLabel="cardData.buttonLabel"
            class="results-button"
            @show-detailed-view="showDetailedView"
          />
        </div>
      </div>
    </div>
    <DetailedView v-if="activeEndpoint" :active-endpoint="activeEndpoint" @close-detailed-view="activeEndpoint = null" />
  </div>
</template>

<script>
import AnalyticsButton from './AnalyticsButton.vue';
import axios from 'axios';
import DetailedView from '../views/DetailedView.vue'; // Updated import path

export default {
  components: {
    AnalyticsButton,
    DetailedView,
  },
  data() {
    return {
      cardDataOptions: [
        {
          title: 'DOCUMENTS',
          icon: new URL('@/assets/documentIcon.png', import.meta.url).href,
          value: 0,
          endpoint: '/api/v1/analytics/approved-documents',
          buttonLabel: 'View Documents',
        },
        {
          title: 'USERS',
          icon: new URL('@/assets/UserIcon.png', import.meta.url).href,
          value: 0,
          endpoint: '/api/v1/analytics/total-users',
          buttonLabel: 'View All Users',
        },
        {
          title: 'USER SIGNUPS',
          icon: new URL('@/assets/SignUpIcon.png', import.meta.url).href,
          value: 0,
          endpoint: '/api/v1/analytics/user-signups',
          buttonLabel: 'View All Signups',
        },
        {
          title: 'UPLOADED DOCUMENTS',
          icon: new URL('@/assets/uploadIcon.png', import.meta.url).href,
          value: 0,
          endpoint: '/api/v1/analytics/uploaded-documents',
          buttonLabel: 'View Uploaded Documents',
        },
        {
          title: 'AVERAGE RATINGS',
          icon: new URL('@/assets/RatingsIcon.png', import.meta.url).href,
          value: 0,
          endpoint: '/api/v1/analytics/ratings-per-time-period',
          buttonLabel: 'View All Ratings',
        },
      ],
      activeEndpoint: null, // Track the selected endpoint for detailed view
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const allResults = await Promise.all(
          this.cardDataOptions.map((card) => axios.get(card.endpoint))
        );

        // Update the values for each card based on the fetched data
        for (let i = 0; i < allResults.length; i++) {
          const data = allResults[i].data;
          this.cardDataOptions[i].value = data.count || data.some_value || 0; // Update with a fallback value
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    showDetailedView(endpoint) {
      this.activeEndpoint = endpoint;
    },
  },
};
</script>

<style scoped>
.detailed-view {
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

<style>
.dashboard {
  background: #f7f7f7; 
  padding: 20px;
  color: #333;
  font-weight: bold;
}

.admin-title {
  text-align: center;
  font-size: 2.2rem;
  color: #333;
}

.analytics {
  display: flex;
  justify-content: space-between; 
  gap: 10px; /* Reduce gap to fit more cards in a row */
  flex-wrap: wrap; /* Still allows wrapping for smaller screens */
}

.card {
  background-color: #fff; /* White background for cards */
  border-radius: 8px; /* Slightly smaller rounded corners */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  padding: 15px; /* Reduced padding */
  text-align: center;
  flex: 1 1 calc(20% - 10px); /* Make cards narrower and responsive */
  min-width: 200px; /* Smaller minimum width */
  position: relative;
}

.card h2 {
  color: #290429; /* Purple text to match the theme */
}

.card p {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #444; /* Slightly darker text color */
}

.card-icon {
  width: 35px; /* Adjust the icon size */
  height: 35px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.results-button {
  background: #f9f9f9; /* Button color */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px; /* Adjust padding for smaller size */
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  margin-top: 10px;
}

.results-button:hover {
  background: #f1f0f3; /* Darker shade on hover */
}
</style>
