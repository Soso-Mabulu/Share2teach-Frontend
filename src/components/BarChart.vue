<template>
    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    chartData: {
      type: Object,
      required: true
    }
  });
  
  const chartRef = ref(null);
  let chart = null;
  
  onMounted(() => {
    createChart();
  });
  
  watch(() => props.chartData, (newData) => {
    if (chart) {
      chart.data = newData;
      chart.update();
    }
  }, { deep: true });
  
  const createChart = () => {
    const ctx = chartRef.value.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 300px;
    width: 100%;
  }
  </style>