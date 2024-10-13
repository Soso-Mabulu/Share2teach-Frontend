<template>
  <div :class="['admin-dashboard', { 'dark-mode': isDarkMode }]">
    <h1 class="dashboard-title">Admin Analytics Dashboard</h1>
    <h1 class="dashboard-title">Admin Analytics Dashboard</h1>

    <div class="filter-options">
      <label class="dark-mode-switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
        <span class="toggle-slider"></span>
        <span class="toggle-label">Dark Mode</span>
      </label>
      <div class="time-frame-picker">
        <label>Time Frame:</label>
        <select v-model="selectedTimeFrame" @change="fetchData">
          <option value="" disabled>--select--</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div class="time-frame-picker">
        <label>Time Frame:</label>
        <select v-model="selectedTimeFrame" @change="fetchData">
          <option value="" disabled>--select--</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div class="date-range-picker">
        <label>Date Range:</label>
        <input type="date" v-model="startDate" @change="fetchData" />
        <input type="date" v-model="endDate" @change="fetchData" />
      </div>
    </div>

    <div class="report-sections">
      <div class="report-section analytics-comparison">
        <h2>Analytics Comparison</h2>
        <div class="chart-container" v-if="!isLoading">
          <BarChart
            v-if="analyticsChartData.datasets.length > 0 && analyticsChartData.labels.length > 0"
            :chart-data="analyticsChartData"
            :options="chartOptions"
            :data="analyticsChartData" 
          />

          <div v-else class="no-data">No Data Available</div>
        </div>
        <div v-else class="loading">Loading...</div>
      </div>

      <div class="report-section analytics-details">
        <h2>Analytics Details</h2>
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(endpoint, index) in analyticsEndpoints" :key="endpoint.key">
              <td>{{ endpoint.name }}</td>
              <td>{{ analyticsData[index]?.[Object.keys(analyticsData[index] || {})[0]] || '0' }}</td>
            </tr>
          </tbody>

        </table>
      </div>

      <!-- Download Button -->
      <button @click="downloadAnalytics" class="download-btn">Download Analytics</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Bar as BarChart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Dark mode
const isDarkMode = ref(false);

// Date range and selected time frame
const selectedTimeFrame = ref('');
const startDate = ref('');
const endDate = ref('');

// Analytics data
const analyticsData = ref([]);
const isLoading = ref(true);

// Analytics endpoints
const analyticsEndpoints = [
  { name: 'Denied Documents', key: 'denied-documents' },
  { name: 'Reported Documents', key: 'reported-documents' },
  { name: 'Pending Documents', key: 'pending-documents' },
  { name: 'Total Users', key: 'total-users' },
  { name: 'Active Users', key: 'active-users' },
  { name: 'User Signups', key: 'user-signups' },
  { name: 'Average Ratings', key: 'ratings-per-time-period' },  // Added new endpoint for ratings
  { name: 'Uploaded Documents', key: 'uploaded-documents' }
];

// Fetch data from API
const fetchData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    // Fetching data from all endpoints
    const promises = analyticsEndpoints.map(endpoint =>
      fetch(`${API_URL}/api/v1/analytics/${endpoint.key}?start_date=${startDate.value}&end_date=${endDate.value}`, { headers })
        .then(response => response.json())
    );

    const results = await Promise.all(promises);

    // Populate analytics data safely
    analyticsData.value = results; // Store the array of data objects directly
  } catch (error) {
    console.error('Error fetching analytics data:', error);
  } finally {
    isLoading.value = false;
  }
};

const analyticsChartData = computed(() => {
  const labels = analyticsEndpoints.map(endpoint => endpoint.name);

  // Ensure data exists and is properly structured
  const dataValues = analyticsEndpoints.map((endpoint, index) => {
    return analyticsData.value[index]?.[Object.keys(analyticsData.value[index] || {})[0]] || 0;
  });

  // Debugging log to ensure dataValues structure
  console.log('Labels:', labels);
  console.log('Data Values:', dataValues);

  // Return empty chart data if no valid data
  if (labels.length === 0 || dataValues.length === 0) {
    return {
      labels: ['No Data'], // Fallback label
      datasets: [] // No dataset if there's no valid data
    };
  }

  const datasets = dataValues.some(val => val !== 0) 
    ? [{
        label: 'Analytics Comparison',
        data: dataValues,
        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'],
      }]
    : []; // Empty dataset if all values are 0

  return {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: datasets
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Download analytics as PDF
const downloadAnalytics = () => {
  const dashboardElement = document.querySelector('.admin-dashboard');
  
  html2canvas(dashboardElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('analytics-report.pdf');
  });
};

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
};

// Fetch data on component mount
onMounted(() => {
  const today = new Date();
  endDate.value = today.toISOString().split('T')[0];
  startDate.value = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0];
  fetchData();
});
</script>




<style scoped>
.admin-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
  z-index: -1;
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
  flex-wrap: wrap;
  flex-wrap: wrap;
}

.dark-mode-switch,
.time-frame-picker,
.date-range-picker {
  margin: 10px;
}

.time-frame-picker select,
.date-range-picker input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.dark-mode .time-frame-picker select,
.dark-mode .date-range-picker input {
  background-color: #2c3e50;
  color: #f5f5f5;
  border-color: #34495e;
.dark-mode-switch,
.time-frame-picker,
.date-range-picker {
  margin: 10px;
}

.time-frame-picker select,
.date-range-picker input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.dark-mode .time-frame-picker select,
.dark-mode .date-range-picker input {
  background-color: #2c3e50;
  color: #f5f5f5;
  border-color: #34495e;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  display: inline-block;
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
  grid-template-columns: 1fr;
  grid-template-columns: 1fr;
  gap: 20px;
}

.report-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .report-section {
  background-color: #2c3e50;
}

.dark-mode .report-section {
  background-color: #2c3e50;
}

.report-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.dark-mode .report-section h2 {
.dark-mode .report-section h2 {
  color: #3498db;
}

.chart-container {
  height: 400px;
  height: 400px;
  margin-top: 20px;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

.analytics-table th,
.analytics-table td {
  padding: 10px;
  text-align: left;
.analytics-table th,
.analytics-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.dark-mode .analytics-table th,
.dark-mode .analytics-table td {
  border-bottom-color: #34495e;
}

.analytics-table th {
  background-color: #f7f9fa;
.dark-mode .analytics-table th,
.dark-mode .analytics-table td {
  border-bottom-color: #34495e;
}

.analytics-table th {
  background-color: #f7f9fa;
  font-weight: bold;
}

.dark-mode .analytics-table th {
  background-color: #d1dfec;
}

.dark-mode .analytics-table th {
  background-color: #d1dfec;
}

.loading {
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2em;
  color: #0d1586;
}

@media (max-width: 768px) {
  .filter-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .report-sections {
    grid-template-columns: 1fr;
  }
}

.no-data {
  text-align: center;
  font-size: 1.5em;
  color: #999;
}
</style>