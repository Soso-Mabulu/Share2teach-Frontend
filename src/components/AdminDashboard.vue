<template>
  <div class="dashboard">
    <h1 class="admin-title">Admin Dashboard</h1>
    <div class="analytics">
      <div class="card document-counts">
        <h2 class="counts-title">DOCUMENTS</h2>
        <p><i class="fas fa-file-alt"></i> Approved: {{ data.approved }}</p>
        <p><i class="fas fa-file-times"></i> Denied: {{ data.denied }}</p>
        <p><i class="fas fa-file-report"></i> Reported: {{ data.reported }}</p>
        <p><i class="fas fa-file-invoice"></i> Pending: {{ data.pending }}</p>
        <div class="button-container">
          <button class="view-all" @click="viewAllDocuments">View All Documents</button>
        </div>
      </div>
      <div class="card user-counts">
        <h2 class="counts-title">USERS</h2>
        <p><i class="fas fa-users"></i> Total Users: {{ data.totalUsers }}</p>
        <p><i class="fas fa-user-check"></i> Active Users (Last 30 Days): {{ data.activeUsers }}</p>
        <div class="button-container">
          <button class="view-all" @click="viewAllUsers">View All Users</button>
        </div>
      </div>
      <div class="card signup-counts">
        <h2 class="counts-title">USER SIGNUPS</h2>
        <p><i class="fas fa-user-plus"></i> Signups (Last 30 Days): {{ data.userSignups }}</p>
        <div class="button-container">
          <button class="view-all" @click="viewAllSignups">View All Signups</button>
        </div>
      </div>
      <div class="card uploaded-docs">
        <h2 class="counts-title">UPLOADED DOCUMENTS</h2>
        <p><i class="fas fa-upload"></i> Uploaded Docs (Last 30 Days): {{ data.uploadedDocs }}</p>
        <div class="button-container">
          <button class="view-all" @click="viewAllUploadedDocs">View All Uploaded Docs</button>
        </div>
      </div>
      <div class="card ratings">
        <h2 class="counts-title">AVERAGE RATINGS</h2>
        <p><i class="fas fa-star"></i> Average Rating (Last 30 Days): {{ data.averageRating }}</p>
        <div class="button-container">
          <button class="view-all" @click="viewAllRatings">View All Ratings</button>
        </div>
      </div>
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
        userSignups: 0,
        uploadedDocs: 0,
        averageRating: 0,
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
          userSignupsRes,
          uploadedDocsRes,
          averageRatingRes,
        ] = await Promise.all([
          axios.get('/api/admin/approved-documents'),
          axios.get('/api/admin/denied-documents'),
          axios.get('/api/admin/reported-documents'),
          axios.get('/api/admin/pending-documents'),
          axios.get('/api/admin/total-users'),
          axios.get('/api/admin/active-users'),
          axios.get('/api/admin/user-signups?start_date=2024-01-01&end_date=2024-12-31'), // Adjust dates as needed
          axios.get('/api/admin/uploaded-documents?start_date=2024-01-01&end_date=2024-12-31'), // Adjust dates as needed
          axios.get('/api/admin/ratings?start_date=2024-01-01&end_date=2024-12-31'), // Adjust dates as needed
        ]);

        this.data.approved = approvedRes.data.approved_count;
        this.data.denied = deniedRes.data.denied_count;
        this.data.reported = reportedRes.data.reported_count;
        this.data.pending = pendingRes.data.pending_count;
        this.data.totalUsers = totalUsersRes.data.user_count;
        this.data.activeUsers = activeUsersRes.data.active_users;
        this.data.userSignups = userSignupsRes.data.signups;
        this.data.uploadedDocs = uploadedDocsRes.data.uploaded_docs;
        this.data.averageRating = averageRatingRes.data.average_rating;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async viewAllDocuments() {
      try {
        const response = await axios.get('/api/admin/all-documents'); // Fetch all documents
        console.log('All Documents:', response.data);
        // Handle displaying all documents (you might want to update a modal or another section)
      } catch (error) {
        console.error('Error fetching all documents:', error);
      }
    },
    async viewAllUsers() {
      try {
        const response = await axios.get('/api/admin/all-users'); // Fetch all users
        console.log('All Users:', response.data);
        // Handle displaying all users
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    },
    async viewAllSignups() {
      try {
        const response = await axios.get('/api/admin/all-signups'); // Fetch all signups
        console.log('All Signups:', response.data);
        // Handle displaying all signups
      } catch (error) {
        console.error('Error fetching all signups:', error);
      }
    },
    async viewAllUploadedDocs() {
      try {
        const response = await axios.get('/api/admin/all-uploaded-docs'); // Fetch all uploaded documents
        console.log('All Uploaded Docs:', response.data);
        // Handle displaying all uploaded documents
      } catch (error) {
        console.error('Error fetching all uploaded documents:', error);
      }
    },
    async viewAllRatings() {
      try {
        const response = await axios.get('/api/admin/all-ratings'); // Fetch all ratings
        console.log('All Ratings:', response.data);
        // Handle displaying all ratings
      } catch (error) {
        console.error('Error fetching all ratings:', error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  background: #e1c3e1; /* Light dusty purple background */
  color: rgb(29, 96, 96); /* Default text color */
  padding: 30px; /* Add some padding */
  font-family: 'Amasis MT Pro Black', sans-serif; /* Set font for all text */
}

.admin-title {
  text-align: center;
  font-weight: bold;
  font-size: 2.5em; /* Adjust the size as needed */
  color: rgb(29, 6, 25); /* Admin title in white */
}

.analytics {
  display: flex;
  gap: 15px;
}

.card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 132, 145, 0.991);
  flex: 1;
  background: rgba(176, 120, 185, 0.1); /* Semi-transparent white for cards */
}

.counts-title {
  font-family: 'Amasis MT Pro Black', sans-serif; /* Remove italic and set font */
  color: #2e0c2b; /* Blue-black color for titles */
  font-weight: normal; /* Normal font weight */
}

/* Button container styling */
.button-container {
  display: flex;
  justify-content: center; /* Center align buttons */
  margin-top: 5px; /* Space between content and button */
}

/* Button styling */
.view-all {
  background: rgb(248, 236, 251); /* Grey background */
  border: none;
  border-radius: 2px; /* Slightly rounded corners */
  padding: 7px; /* Uniform padding */
  cursor: pointer;
  font-weight: bold;
  color: rgb(4, 0, 5); /* White text */
  width: 150px; /* Fixed width for uniformity */
  transition: background 0.3s ease; /* Transition for hover effect */
}

.view-all:hover {
  background: rgba(80, 77, 126, 0.438); /* Darker grey on hover */
}

/* Optional: Styling for icons */
.card i {
  margin-right: 10px;
}
</style>

<!-- Add this link in the <head> of your index.html or main component -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
