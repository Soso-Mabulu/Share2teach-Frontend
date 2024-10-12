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
        Total number of users: {{ data.user_count }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/active-users'">
        Number of active users in the last 30 days: {{ data.active_users }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/user-signups'">
        Number of user signups: {{ data.signups }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/ratings-per-time-period'">
        Average ratings: {{ data.average_rating }}
        <br />
        Total ratings: {{ data.total_ratings }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/uploaded-documents'">
        Number of uploaded documents: {{ data.uploaded_docs }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/approved-documents-per-period'">
        Number of approved documents per period: {{ data.approved_docs }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/denied-documents-per-period'">
        Number of denied documents per period: {{ data.denied_docs }}
      </p>
      <p v-if="activeEndpoint === '/api/v1/analytics/reported-documents-per-period'">
        Number of reported documents per period: {{ data.reported_docs }}
      </p>
  
      <!-- List of documents if available -->
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
    props: {
      activeEndpoint: {
        type: String,
        required: true,
      },
      activeEndpointLabel: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        data: null, // To store the analytics data
        documents: [], // To store the fetched documents
      };
    },
    watch: {
      activeEndpoint: {
        immediate: true,
        handler(newEndpoint) {
          if (newEndpoint) {
            this.fetchData(newEndpoint);
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
      closeDetailedView() {
        this.$emit('close-detailed-view');
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
  