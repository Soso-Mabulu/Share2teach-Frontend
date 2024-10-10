<template>
    <div>
      <h1>Admin Dashboard</h1>
      <div class="analytics">
        <div class="card">
          <h2>Document Counts</h2>
          <p>Approved: {{ data.approved }}</p>
          <p>Denied: {{ data.denied }}</p>
          <p>Reported: {{ data.reported }}</p>
          <p>Pending: {{ data.pending }}</p>
        </div>
        <div class="card">
          <h2>User Counts</h2>
          <p>Total Users: {{ data.totalUsers }}</p>
          <p>Active Users (Last 30 Days): {{ data.activeUsers }}</p>
        </div>
        <!-- Additional analytics sections can be added here -->
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: {
          approved: 0,
          denied: 0,
          reported: 0,
          pending: 0,
          totalUsers: 0,
          activeUsers: 0,
        },
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const [
            approvedRes,
            deniedRes,
            reportedRes,
            pendingRes,
            totalUsersRes,
            activeUsersRes,
          ] = await Promise.all([
            axios.get('/api/admin/approved-documents'),
            axios.get('/api/admin/denied-documents'),
            axios.get('/api/admin/reported-documents'),
            axios.get('/api/admin/pending-documents'),
            axios.get('/api/admin/total-users'),
            axios.get('/api/admin/active-users'),
          ]);
  
          this.data.approved = approvedRes.data.approved_count;
          this.data.denied = deniedRes.data.denied_count;
          this.data.reported = reportedRes.data.reported_count;
          this.data.pending = pendingRes.data.pending_count;
          this.data.totalUsers = totalUsersRes.data.user_count;
          this.data.activeUsers = activeUsersRes.data.active_users;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .analytics {
    display: flex;
    gap: 20px;
  }
  .card {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
  }
  </style>
  