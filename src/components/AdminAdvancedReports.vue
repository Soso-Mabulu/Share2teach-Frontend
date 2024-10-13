<template>
  <div :class="['admin-dashboard', { 'dark-mode': isDarkMode }]">
    <h1 class="dashboard-title">Advanced Admin Report</h1>

    <div class="filter-options">
      <label class="dark-mode-switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
        <span class="toggle-slider"></span>
        <span class="toggle-label">Dark Mode</span>
      </label>
      <div class="date-range-picker">
        <label>Date Range:</label>
        <input type="date" v-model="startDate" @change="fetchData" />
        <input type="date" v-model="endDate" @change="fetchData" />
      </div>
    </div>

    <div class="report-sections">
      <div class="report-section user-stats">
        <h2>User Statistics</h2>
        <div v-for="(value, key) in userStats" :key="key" class="stat-item">
          <span class="stat-label">{{ formatLabel(key) }}:</span>
          <span class="stat-value">{{ value }}</span>
        </div>
        <div class="chart-container">
          <LineChart :chart-data="userSignupChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="report-section document-stats">
        <h2>Document Statistics</h2>
        <div v-for="(value, key) in documentStats" :key="key" class="stat-item">
          <span class="stat-label">{{ formatLabel(key) }}:</span>
          <span class="stat-value">{{ value }}</span>
        </div>
        <div class="chart-container">
          <DoughnutChart :chart-data="documentStatusChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="report-section rating-stats">
        <h2>Rating Statistics</h2>
        <div class="stat-item">
          <span class="stat-label">Average Rating:</span>
          <span class="stat-value">{{ ratingStats.averageRating.toFixed(2) }}</span>
        </div>
        <div class="chart-container">
          <LineChart :chart-data="ratingChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="report-section top-documents">
        <h2>Top Rated Documents</h2>
        <ul class="document-list">
          <li v-for="doc in topRatedDocuments" :key="doc.id" class="document-item">
            <span class="document-title">{{ doc.title }}</span>
            <span class="document-rating">
              <i class="fas fa-star"></i> {{ doc.rating.toFixed(1) }}
            </span>
          </li>
        </ul>
      </div>

      <div class="report-section user-activity">
        <h2>User Activity Heatmap</h2>
        <div class="heatmap-container">
          <!-- Placeholder for heatmap visualization -->
          <div class="heatmap-placeholder">User Activity Heatmap Visualization</div>
        </div>
      </div>

      <div class="report-section recent-actions">
        <h2>Recent Admin Actions</h2>
        <ul class="action-list">
          <li v-for="action in recentAdminActions" :key="action.id" class="action-item">
            <span class="action-type">{{ action.type }}</span>
            <span class="action-details">{{ action.details }}</span>
            <span class="action-time">{{ formatDate(action.timestamp) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement);

export default {
  components: {
    LineChart,
    DoughnutChart
  },
  setup() {
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const isDarkMode = ref(false);
    const startDate = ref('');
    const endDate = ref('');

    const userStats = ref({
      totalUsers: 0,
      activeUsers: 0,
      newSignups: 0,
    });

    const documentStats = ref({
      pendingDocuments: 0,
      approvedDocuments: 0,
      deniedDocuments: 0,
      reportedDocuments: 0,
      uploadedDocuments: 0,
    });

    const ratingStats = ref({
      averageRating: 0,
      ratingsOverTime: [],
    });

    const topRatedDocuments = ref([]);
    const recentAdminActions = ref([]);

    const userSignupChartData = computed(() => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'User Signups',
        data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 60, 70, 75],
        borderColor: '#3498db',
        fill: false
      }]
    }));

    const documentStatusChartData = computed(() => ({
      labels: ['Pending', 'Approved', 'Denied', 'Reported'],
      datasets: [{
        data: [
          documentStats.value.pendingDocuments,
          documentStats.value.approvedDocuments,
          documentStats.value.deniedDocuments,
          documentStats.value.reportedDocuments
        ],
        backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c', '#9b59b6']
      }]
    }));

    const ratingChartData = computed(() => ({
      labels: ratingStats.value.ratingsOverTime.map(r => r.date),
      datasets: [{
        label: 'Average Rating',
        data: ratingStats.value.ratingsOverTime.map(r => r.averageRating),
        borderColor: '#3498db',
        fill: false
      }]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    onMounted(() => {
      startDate.value = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate.value = new Date().toISOString().split('T')[0];
      fetchData();
    });

    const fetchData = async () => {
      // Simulated API calls
      userStats.value = {
        totalUsers: 10000,
        activeUsers: 7500,
        newSignups: 500,
      };

      documentStats.value = {
        pendingDocuments: 150,
        approvedDocuments: 8000,
        deniedDocuments: 200,
        reportedDocuments: 50,
        uploadedDocuments: 9000,
      };

      ratingStats.value = {
        averageRating: 4.2,
        ratingsOverTime: [
          { date: '2023-01-01', averageRating: 4.0 },
          { date: '2023-02-01', averageRating: 4.1 },
          { date: '2023-03-01', averageRating: 4.3 },
          { date: '2023-04-01', averageRating: 4.2 },
        ],
      };

      topRatedDocuments.value = [
        { id: 1, title: 'Advanced Mathematics', rating: 4.9 },
        { id: 2, title: 'Introduction to AI', rating: 4.8 },
        { id: 3, title: 'Web Development Basics', rating: 4.7 },
      ];

      recentAdminActions.value = [
        { id: 1, type: 'Document Approval', details: 'Approved "Machine Learning Fundamentals"', timestamp: new Date() },
        { id: 2, type: 'User Ban', details: 'Banned user for violation of terms', timestamp: new Date(Date.now() - 86400000) },
        { id: 3, type: 'Report Resolution', details: 'Resolved copyright infringement report', timestamp: new Date(Date.now() - 172800000) },
      ];
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark-mode', isDarkMode.value);
    };

    const formatLabel = (key) => {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return {
      isDarkMode,
      startDate,
      endDate,
      userStats,
      documentStats,
      ratingStats,
      topRatedDocuments,
      recentAdminActions,
      userSignupChartData,
      documentStatusChartData,
      ratingChartData,
      chartOptions,
      toggleDarkMode,
      fetchData,
      formatLabel,
      formatDate
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dashboard-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dark-mode-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

input:checked + .toggle-slider {
  background-color: #3498db;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.report-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.report-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stat-label {
  font-weight: bold;
}

.stat-value {
  color: #3498db;
}

.chart-container {
  height: 300px;
  margin-top: 20px;
}

.document-list, .action-list {
  list-style-type: none;
  padding: 0;
}

.document-item, .action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;
}

.document-rating, .action-type {
  font-weight: bold;
  color: #3498db;
}

.heatmap-container {
  height: 300px;
  background-color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #7f8c8d;
}

/* Dark mode styles */
.dark-mode .report-section {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.dark-mode .report-section h2 {
  color: #3498db;
}

.dark-mode .stat-value {
  color: #2ecc71;
}

.dark-mode .heatmap-container {
  background-color: #34495e;
  color: #bdc3c7;
}

.dark-mode .document-item, .dark-mode .action-item {
  border-bottom-color: #34495e;
}
</style>