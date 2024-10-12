<template>
  <div v-if="activeEndpoint && data" class="detailed-view">
    <h2>Detailed Analytics for {{ activeEndpointLabel }}</h2>

    <!-- Display analytics based on the active endpoint -->
    <p v-if="activeEndpoint === '/api/v1/analytics/approved-documents'">
      Number of approved documents: {{ data.approved_count }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/denied-documents'">
      Number of denied documents: {{ data.denied_count }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/reported-documents'">
      Number of reported documents: {{ data.reported_count }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/pending-documents'">
      Number of pending documents: {{ data.pending_count }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/total-users'">
      Total users: {{ data.user_count }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/active-users'">
      Active users in the last 30 days: {{ data.active_users }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/user-signups'">
      User signups during the selected period: {{ data.signups }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/ratings'">
      Average rating: {{ data.average_rating }} (Total ratings: {{ data.total_ratings }})
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/uploaded-documents'">
      Uploaded documents during the selected period: {{ data.uploaded_docs }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/approved-docs-period'">
      Approved documents during the selected period: {{ data.approved_docs }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/denied-docs-period'">
      Denied documents during the selected period: {{ data.denied_docs }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/reported-docs-period'">
      Reported documents during the selected period: {{ data.reported_docs }}
    </p>
    <p v-if="activeEndpoint === '/api/v1/analytics/document-counts'">
      Document counts by status and date:
      <ul>
        <li v-for="item in data" :key="item.date">
          Date: {{ item.date }} - Status: {{ item.status }} - Count: {{ item.count }}
        </li>
      </ul>
    </p>

    <!-- Handle document list if applicable -->
    <ul v-if="documents.length">
      <li v-for="document in documents" :key="document.Id">
        {{ document.description }} - {{ document.module }}
      </li>
    </ul>
    <p v-if="!documents.length">No documents found.</p>

    <button @click="closeDetailedView">Close</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: null,
      documents: [],
      activeEndpoint: this.$route.query.endpoint, // Fetch the endpoint from query params
      activeEndpointLabel: ''
    };
  },
  watch: {
    activeEndpoint: {
      immediate: true,
      handler(newEndpoint) {
        if (newEndpoint) {
          this.fetchData(newEndpoint);
          this.setActiveEndpointLabel(newEndpoint);
        }
      },
    },
  },
  methods: {
    async fetchData(endpoint) {
      try {
        const response = await axios.get(endpoint);
        if (endpoint.includes('analytics')) {
          this.data = response.data;
        } else {
          this.documents = response.data.documents;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    setActiveEndpointLabel(endpoint) {
      switch (endpoint) {
        case '/api/v1/analytics/approved-documents':
          this.activeEndpointLabel = 'Approved Documents';
          break;
        case '/api/v1/analytics/denied-documents':
          this.activeEndpointLabel = 'Denied Documents';
          break;
        case '/api/v1/analytics/reported-documents':
          this.activeEndpointLabel = 'Reported Documents';
          break;
        case '/api/v1/analytics/pending-documents':
          this.activeEndpointLabel = 'Pending Documents';
          break;
        case '/api/v1/analytics/total-users':
          this.activeEndpointLabel = 'Total Users';
          break;
        case '/api/v1/analytics/active-users':
          this.activeEndpointLabel = 'Active Users';
          break;
        case '/api/v1/analytics/user-signups':
          this.activeEndpointLabel = 'User Signups';
          break;
        case '/api/v1/analytics/ratings':
          this.activeEndpointLabel = 'Ratings';
          break;
        case '/api/v1/analytics/uploaded-documents':
          this.activeEndpointLabel = 'Uploaded Documents';
          break;
        case '/api/v1/analytics/approved-docs-period':
          this.activeEndpointLabel = 'Approved Documents (Period)';
          break;
        case '/api/v1/analytics/denied-docs-period':
          this.activeEndpointLabel = 'Denied Documents (Period)';
          break;
        case '/api/v1/analytics/reported-docs-period':
          this.activeEndpointLabel = 'Reported Documents (Period)';
          break;
        case '/api/v1/analytics/document-counts':
          this.activeEndpointLabel = 'Document Counts by Status and Date';
          break;
        default:
          this.activeEndpointLabel = 'Detailed Analytics';
      }
    },
    closeDetailedView() {
      this.$router.push({ name: 'Home' }); // Navigate back to home or other view
    },
  },
};
</script>

<style scoped>
.detailed-view {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
