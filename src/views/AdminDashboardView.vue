<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import DocumentGrid from '@/components/DocumentGrid.vue';  
import DocumentList from '@/components/DocumentList.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import MainFooter from '@/components/MainFooter.vue'; 
</script>


<template>
    <div class="flex flex-col min-h-screen">
      <AdminNavbar class="z-10" />
      <div class="flex-grow flex">
        <AdminSidebar class="hidden lg:block flex-shrink-0" />
        <main class="flex-grow overflow-auto">
            <AdminDashboard />
            <DocumentGrid />  <!-- Use the DocumentGrid component -->
            <DocumentList />  <!-- Use the DocumentList component -->
        </main>
      </div>
      <MainFooter />
    </div>
</template>