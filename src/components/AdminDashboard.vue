<template>  
  <div class="admin-dashboard">  
    <h1 class="admin-title">Admin Dashboard</h1>  
    <div class="analytics">  
      <div class="card">  
        <h2 class="counts-title">Documents</h2>  
        <p>Denied: {{ deniedDocuments }}</p>  
        <button @click="goToAnalytics('denied-documents')">View Denied Documents</button>  
        <p>Pending: {{ pendingDocuments }}</p>  
        <button @click="goToAnalytics('pending-documents')">View Pending Documents</button>  
        <p>Reported: {{ reportedDocuments }}</p>  
        <button @click="goToAnalytics('reported-documents')">View Reported Documents</button>  
      </div>  
      <div class="card">  
        <h2 class="counts-title">Users</h2>  
        <p>Total: {{ totalUsers }}</p>  
        <button @click="goToAnalytics('total-users')">View Total Users</button>  
        <p>Active: {{ activeUsers }}</p>  
        <button @click="goToAnalytics('active-users')">View Active Users</button>  
      </div>  
      <div class="card">  
        <h2 class="counts-title">Ratings</h2>  
        <p>Average: {{ averageRatings }}</p>  
        <button @click="goToAnalytics('ratings-per-time-period')">View Ratings Analytics</button>  
      </div>  
      <div class="card">  
        <h2 class="counts-title">Uploads</h2>  
        <p>Total: {{ totalUploads }}</p>  
        <button @click="goToAnalytics('uploaded-documents')">View Uploads Analytics</button>  
      </div>  
    </div>  
  </div>  
</template>  
  
<script>  
import axios from 'axios';  
  
export default {  
  data() {  
    return {  
      deniedDocuments: 0,  
      pendingDocuments: 0,  
      reportedDocuments: 0,  
      totalUsers: 0,  
      activeUsers: 0,  
      averageRatings: 0,  
      totalUploads: 0,  
    };  
  },  
  mounted() {  
    this.fetchData();  
  },  
  methods: {  
    async fetchData() {  
      try {  
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);  
        let token = urlParams.get('token');  
        const headers = { Authorization: `Bearer ${token}` };  
        
        const deniedDocumentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/denied-documents`, { headers });  
        const pendingDocumentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/pending-documents`, { headers });  
        const reportedDocumentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/reported-documents`, { headers });  
        const totalUsersResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/total-users`, { headers });  
        const activeUsersResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/active-users`, { headers });  
        const averageRatingsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/ratings-per-time-period`, { headers });  
        const totalUploadsResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/analytics/uploaded-documents`, { headers });  
        
        this.deniedDocuments = deniedDocumentsResponse.data.denied_count;  
        this.pendingDocuments = pendingDocumentsResponse.data.pending_count;  
        this.reportedDocuments = reportedDocumentsResponse.data.reported_count;  
        this.totalUsers = totalUsersResponse.data.user_count;  
        this.activeUsers = activeUsersResponse.data.active_users;  
        this.averageRatings = averageRatingsResponse.data.average_rating;  
        this.totalUploads = totalUploadsResponse.data.uploaded_docs;  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    },  
    goToAnalytics(endpoint) {  
      // Construct the analytics URL for the endpoint
      const urlParams = new URLSearchParams(window.location.search);  
      let token = urlParams.get('token');  
      const analyticsUrl = `${import.meta.env.VITE_API_URL}api/v1/analytics/${endpoint}?token=${token}`;
      
      // Redirect to the analytics endpoint
      window.location.href = analyticsUrl;
    },  
  },  
};  
</script>  
  
<style>  
.admin-dashboard {  
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  
  padding: 20px;  
  color: #333;  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  background-color: #f5f5f5;
  z-index: -1;  
}  
  
.admin-title {  
  text-align: center;  
  margin-bottom: 30px;  
  font-size: 2.5em;  
  color: #2c3e50;  
  text-transform: uppercase;  
  letter-spacing: 2px;  
  position: relative;  
  padding-bottom: 10px;  
}  
  
.admin-title::after {  
  content: '';  
  position: absolute;  
  bottom: 0;  
  left: 50%;  
  transform: translateX(-50%);  
  width: 60px;  
  height: 4px;  
  background-color: #3498db;  
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
  
button {  
  background: linear-gradient(to right, #739ea9, #f6f2f8, #2c4475);
  border: none;  
  color: rgb(44, 25, 46);
  padding: 8px 12px;  
  text-align: center;  
  text-decoration:solid;  
  display: inline-block;  
  font-weight: bold;
  font-size: 14px;  
  margin: 2px 1px;  
  cursor: pointer;  
  border-radius: 4px;  
  
}  
  
button:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #c2b2c7, #f8f1fa, #e4e3e4);
} 
</style>

