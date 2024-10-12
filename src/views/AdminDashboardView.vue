<script setup>
import LandingFooter from '@/components/LandingFooter.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import DocumentGrid from '@/components/DocumentGrid.vue';  
import DocumentList from '@/components/DocumentList.vue'; 
</script>

<template>
    <AdminDashboard />
    <DocumentGrid />  <!-- Use the DocumentGrid component -->
    <DocumentList />  <!-- Use the DocumentList component -->
    <LandingFooter />
</template>
