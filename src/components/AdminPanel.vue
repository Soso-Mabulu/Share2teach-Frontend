<template>
    <div class="admin-dashboard">
      <h1 class="page-title">Admin Dashboard</h1>
  
      <!-- Analytics Cards -->
      <div class="analytics-grid">
        <div v-for="(value, key) in analytics" :key="key" class="analytics-card">
          <h3>{{ formatTitle(key) }}</h3>
          <p>{{ formatValue(value) }}</p>
        </div>
      </div>
  
      <!-- System Metrics -->
      <div class="system-metrics">
        <h2 class="section-title">System Metrics</h2>
        <div class="metrics-grid">
          <div v-for="(value, key) in systemMetrics" :key="key" class="metric-card">
            <h3>{{ formatTitle(key) }}</h3>
            <div class="progress-bar">
              <div :style="{ width: `${value}%` }" :class="getProgressBarColor(value)"></div>
            </div>
            <p>{{ value }}%</p>
          </div>
        </div>
      </div>
  
      <!-- Quick Links -->
      <div class="quick-links">
        <h2 class="section-title">Quick Links</h2>
        <div class="links-grid">
          <button @click="navigateTo('faqs')" class="quick-link-btn">Maintain FAQs</button>
          <button @click="navigateTo('upload')" class="quick-link-btn">Upload Documents</button>
          <button @click="navigateTo('users')" class="quick-link-btn">Maintain Users</button>
        </div>
      </div>
  
      <!-- Document Analytics Chart -->
      <div class="document-analytics">
        <h2 class="section-title">Document Analytics</h2>
        <div class="chart-container">
          <bar-chart :chart-data="documentChartData" />
        </div>
      </div>
  
      <!-- Logs Summary -->
      <div class="logs-summary">
        <h2 class="section-title">Recent Logs</h2>
        <ul class="logs-list">
          <li v-for="log in logs" :key="log.timestamp" class="log-item">
            <span class="log-timestamp">{{ log.timestamp }}</span>
            <span class="log-message">{{ log.message }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import BarChart from './BarChart.vue';
  import { useRouter } from 'vue-router';
  
  // API base URL and token
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const token = localStorage.getItem('token');
  
  // Axios instance with token for authentication
  const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const router = useRouter();
  
  const analytics = ref({
    totalDocuments: 0,
    approvedDocuments: 0,
    deniedDocuments: 0,
    reportedComments: 0,
    avgDocumentRating: 0,
    avgFaqRating: 0,
  });
  
  const systemMetrics = ref({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0,
  });
  
  const logs = ref([]);
  
  const documentChartData = computed(() => ({
    labels: ['Total', 'Approved', 'Denied', 'Reported'],
    datasets: [{
      label: 'Document Count',
      data: [
        analytics.value.totalDocuments,
        analytics.value.approvedDocuments,
        analytics.value.deniedDocuments,
        analytics.value.reportedComments,
      ],
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
    }]
  }));
  
  const getLastSixMonths = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);
    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };
  
  onMounted(async () => {
    const { start_date, end_date } = getLastSixMonths();

    try {
      // Fetch denied documents
      const deniedResponse = await axiosInstance.get(`${apiBaseUrl}api/v1/analytics/denied-documents`, {
        params: { start_date, end_date }
      });
      analytics.value.deniedDocuments = deniedResponse.data.denied_count;

      // Fetch reported documents
      const reportedResponse = await axiosInstance.get(`${apiBaseUrl}api/v1/analytics/reported-documents`, {
        params: { start_date, end_date }
      });
      analytics.value.reportedComments = reportedResponse.data.reported_count;

      // Fetch pending documents
      const pendingResponse = await axiosInstance.get(`${apiBaseUrl}api/v1/analytics/pending-documents`, {
        params: { start_date, end_date }
      });
      analytics.value.totalDocuments = pendingResponse.data.pending_count;

      // Mock system metrics and logs
      systemMetrics.value = {
        cpuUsage: 65,
        memoryUsage: 70,
        diskUsage: 55,
        networkTraffic: 80,
      };

      logs.value = [
        { timestamp: '2024-10-01 10:30:15', message: 'User authentication failed' },
        { timestamp: '2024-10-01 10:31:22', message: 'Document upload successful' },
        { timestamp: '2024-10-01 10:32:45', message: 'System backup completed' },
      ];

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  });

  
  const formatTitle = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const formatValue = (value) => typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value;
  
  const getProgressBarColor = (value) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const navigateTo = (route) => {
    router.push(`/admin-${route}`);
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .page-title {
    text-align: center;
    margin: 20px 0 30px;
    font-size: 2.5em;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .section-title {
    font-size: 1.8em;
    color: #34495e;
    margin-bottom: 20px;
  }
  
  .analytics-grid,
  .metrics-grid,
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .analytics-card,
  .metric-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .analytics-card:hover,
  .metric-card:hover {
    transform: translateY(-5px);
  }
  
  .analytics-card h3,
  .metric-card h3 {
    font-size: 1.2em;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .analytics-card p,
  .metric-card p {
    font-size: 1.5em;
    font-weight: bold;
    color: #3498db;
  }
  
  .progress-bar {
    height: 10px;
    background-color: #ecf0f1;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  
  .progress-bar > div {
    height: 100%;
    border-radius: 5px;
  }
  
  .quick-link-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .quick-link-btn:hover {
    background-color: #2980b9;
  }
  
  .chart-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
  }
  
  .logs-list {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .log-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .log-timestamp {
    color: #7f8c8d;
    font-size: 0.9em;
  }
  
  .log-message {
    color: #34495e;
  }
  
  @media (max-width: 768px) {
    .analytics-grid,
    .metrics-grid,
    .links-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>