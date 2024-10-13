<template>
  <div :class="['admin-dashboard', { 'dark-mode': isDarkMode }]">
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
          <BarChart :chart-data="analyticsChartData" :options="chartOptions" />
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
            <tr v-for="endpoint in analyticsEndpoints" :key="endpoint.endpoint">
              <td>{{ endpoint.name }}</td>
              <td>{{ analyticsData[endpoint.endpoint] || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { Bar as BarChart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    BarChart
  },
  setup() {
    const API_URL = 'http://localhost:3000/api/v1/analytics';
    const isDarkMode = ref(false);
    const selectedTimeFrame = ref(''); // Default value is an empty string
    const startDate = ref('');
    const endDate = ref('');
    const analyticsData = ref({});
    const isLoading = ref(true);

    const analyticsEndpoints = [
      { name: 'Denied Documents', endpoint: 'denied-documents' },
      { name: 'Reported Documents', endpoint: 'reported-documents' },
      { name: 'Pending Documents', endpoint: 'pending-documents' },
      { name: 'Total Users', endpoint: 'total-users' },
      { name: 'Active Users', endpoint: 'active-users' },
      { name: 'User Signups', endpoint: 'user-signups' },
      { name: 'Uploaded Documents', endpoint: 'uploaded-documents' },
    ];

    const analyticsChartData = computed(() => ({
      labels: analyticsEndpoints.map(endpoint => endpoint.name),
      datasets: [{
        label: 'Analytics Comparison',
        data: analyticsEndpoints.map(endpoint => analyticsData.value[endpoint.endpoint] || 0),
        backgroundColor: [
          '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'
        ],
      }]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    onMounted(() => {
      const today = new Date();
      endDate.value = today.toISOString().split('T')[0];
      startDate.value = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0];
      fetchData();
    });

    const fetchData = async () => {
      isLoading.value = true;
      try {
        if (!selectedTimeFrame.value) {
          return; // Do not fetch data if no time frame is selected
        }

        const promises = analyticsEndpoints.map(endpoint =>
          fetch(`${API_URL}/${endpoint.endpoint}?startDate=${startDate.value}&endDate=${endDate.value}&timeFrame=${selectedTimeFrame.value}`)
            .then(response => response.json())
        );

        const results = await Promise.all(promises);

        analyticsData.value = results.reduce((acc, result, index) => {
          acc[analyticsEndpoints[index].endpoint] = result.value;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark-mode', isDarkMode.value);
    };

    return {
      isDarkMode,
      selectedTimeFrame,
      startDate,
      endDate,
      analyticsData,
      analyticsChartData,
      chartOptions,
      toggleDarkMode,
      fetchData,
      analyticsEndpoints,
      isLoading
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
}

.toggle-slider {
  position: relative;
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

.report-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.dark-mode .report-section h2 {
  color: #3498db;
}

.chart-container {
  height: 400px;
  margin-top: 20px;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

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
  font-weight: bold;
}

.dark-mode .analytics-table th {
  background-color: #d1dfec;
}

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
</style>