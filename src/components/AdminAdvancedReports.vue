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
          <div class="stat-item">
            <span class="stat-label">Total Users:</span>
            <span class="stat-value">{{ userStats.totalUsers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Users:</span>
            <span class="stat-value">{{ userStats.activeUsers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">New Signups:</span>
            <span class="stat-value">{{ userStats.newSignups }}</span>
          </div>
        </div>
  
        <div class="report-section document-stats">
          <h2>Document Statistics</h2>
          <div class="stat-item">
            <span class="stat-label">Pending Documents:</span>
            <span class="stat-value">{{ documentStats.pendingDocuments }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Approved Documents:</span>
            <span class="stat-value">{{ documentStats.approvedDocuments }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Denied Documents:</span>
            <span class="stat-value">{{ documentStats.deniedDocuments }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Reported Documents:</span>
            <span class="stat-value">{{ documentStats.reportedDocuments }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Uploaded Documents:</span>
            <span class="stat-value">{{ documentStats.uploadedDocuments }}</span>
          </div>
        </div>
  
        <div class="report-section rating-stats">
          <h2>Rating Statistics</h2>
          <div class="stat-item">
            <span class="stat-label">Average Rating:</span>
            <span class="stat-value">{{ ratingStats.averageRating.toFixed(2) }}</span>
          </div>
          <div class="rating-chart">
            <LineChart :chart-data="ratingChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ChartData, ChartOptions } from 'chart.js';
  
  // Register the components from Chart.js
  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
  
  // Type declaration for import.meta.env
  declare global {
    interface ImportMeta {
      env: Record<string, string>;
    }
  }
  
  // Fallback API URL if VITE_API_URL is not defined
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const isDarkMode = ref(false);
  const startDate = ref('');
  const endDate = ref('');
  const chartReady = ref(false);
  
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
    ratingsOverTime: [] as { date: string; averageRating: number }[],
  });
  
  const ratingChartData = computed<ChartData<'line'>>(() => ({
    labels: ratingStats.value.ratingsOverTime.map(r => r.date),
    datasets: [
      {
        label: 'Average Rating',
        data: ratingStats.value.ratingsOverTime.map(r => r.averageRating),
        borderColor: '#3498db',
        fill: false,
      },
    ],
  }));
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  
  onMounted(() => {
    startDate.value = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    endDate.value = new Date().toISOString().split('T')[0];
    fetchData();
  });
  
  async function fetchData() {
    try {
      const [
        totalUsersResponse,
        activeUsersResponse,
        newSignupsResponse,
        pendingDocumentsResponse,
        approvedDocumentsResponse,
        deniedDocumentsResponse,
        reportedDocumentsResponse,
        uploadedDocumentsResponse,
        ratingsResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/v1/analytics/total-users`),
        axios.get(`${API_URL}/api/v1/analytics/active-users`),
        axios.get(`${API_URL}/api/v1/analytics/user-signups`, {
          params: { startDate: startDate.value, endDate: endDate.value },
        }),
        axios.get(`${API_URL}/api/v1/analytics/pending-documents`),
        axios.get(`${API_URL}/api/v1/documents/approved`),
        axios.get(`${API_URL}/api/v1/analytics/denied-documents`),
        axios.get(`${API_URL}/api/v1/analytics/reported-documents`),
        axios.get(`${API_URL}/api/v1/analytics/uploaded-documents`, {
          params: { startDate: startDate.value, endDate: endDate.value },
        }),
        axios.get(`${API_URL}/api/v1/analytics/ratings-per-time-period`, {
          params: { startDate: startDate.value, endDate: endDate.value },
        }),
      ]);
  
      userStats.value = {
        totalUsers: totalUsersResponse.data.totalUsers,
        activeUsers: activeUsersResponse.data.activeUsers,
        newSignups: newSignupsResponse.data.newSignups,
      };
  
      documentStats.value = {
        pendingDocuments: pendingDocumentsResponse.data.pendingDocuments,
        approvedDocuments: approvedDocumentsResponse.data.approvedDocuments,
        deniedDocuments: deniedDocumentsResponse.data.deniedDocuments,
        reportedDocuments: reportedDocumentsResponse.data.reportedDocuments,
        uploadedDocuments: uploadedDocumentsResponse.data.uploadedDocuments,
      };
  
      ratingStats.value = {
        averageRating: ratingsResponse.data.averageRating,
        ratingsOverTime: ratingsResponse.data.ratingsOverTime,
      };
  
      chartReady.value = true;
    } catch (error) {
      console.error('Error fetching data:', error);
      // You might want to add error handling here, such as setting an error state
      // or showing a notification to the user
    }
  }
  
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
    document.body.classList.toggle('dark-mode', isDarkMode.value);
  }
  
  // Watch for changes in start and end dates
  watch([startDate, endDate], () => {
    fetchData();
  });
  </script>
  
  <style scoped>
  .admin-dashboard {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
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
    position: relative;
    padding-bottom: 10px;
  }
  
  .dashboard-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #3498db;
  }
  
  .filter-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 30px;
  }
  
  .dark-mode-switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  
  .dark-mode-switch input {
    display: none;
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
  
  .toggle-label {
    margin-left: 10px;
    font-weight: 500;
  }
  
  .date-range-picker {
    display: flex;
    align-items: center;
  }
  
  .date-range-picker label {
    margin-right: 10px;
  }
  
  .date-range-picker input {
    margin-right: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .report-sections {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  
  .report-section {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: calc(33.33% - 20px);
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
  
  .rating-chart {
    height: 300px;
    margin-top: 20px;
  }
  
  /* Dark mode styles */
  .dark-mode .dashboard-title {
    color: #ecf0f1;
  }
  
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
  
  .dark-mode .date-range-picker input {
    background-color: #34495e;
    color: #ecf0f1;
    border-color: #3498db;
  }
  </style>