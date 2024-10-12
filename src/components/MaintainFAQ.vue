<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const faqs = ref([]);
const searchQuery = ref('');
const isDarkMode = ref(false);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const newFAQ = ref({ question: '', answer: '' });
const editingFAQ = ref(null);
const alert = ref({ show: false, message: '', type: '' });
const isLoading = ref(false);

onMounted(() => {
  fetchFAQs();
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = JSON.parse(savedDarkMode);
    toggleDarkMode();
  }
});

watch(isDarkMode, (newValue) => {
  localStorage.setItem('darkMode', JSON.stringify(newValue));
});

const filteredFAQs = computed(() => {
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function fetchFAQs() {
  isLoading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/faq/`);
    faqs.value = response.data.map(faq => ({ ...faq, isOpen: false }));
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    showAlert('Failed to fetch FAQs. Please try again.', 'error');
  } finally {
    isLoading.value = false;
  }
}

function toggleFAQ(faq) {
  faq.isOpen = !faq.isOpen;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode', isDarkMode.value);
}

function openCreateDialog() {
  showCreateDialog.value = true;
}

function closeCreateDialog() {
  showCreateDialog.value = false;
  newFAQ.value = { question: '', answer: '' };
}

async function createFAQ() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}api/v1/faq/newfaq`, newFAQ.value);
    await fetchFAQs();
    closeCreateDialog();
    showAlert('FAQ created successfully!', 'success');
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    showAlert('Failed to create FAQ. Please try again.', 'error');
  }
}

function openEditDialog(faq) {
  editingFAQ.value = { ...faq };
  showEditDialog.value = true;
}

function closeEditDialog() {
  showEditDialog.value = false;
  editingFAQ.value = null;
}

async function updateFAQ() {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}api/v1/faq/${editingFAQ.value.faqId}`, editingFAQ.value);
    await fetchFAQs();
    closeEditDialog();
    showAlert('FAQ updated successfully!', 'success');
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    showAlert('Failed to update FAQ. Please try again.', 'error');
  }
}

async function deleteFAQ(faqId) {
  if (confirm('Are you sure you want to delete this FAQ?')) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}api/v1/faq/${faqId}`);
      await fetchFAQs();
      showAlert('FAQ deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      showAlert('Failed to delete FAQ. Please try again.', 'error');
    }
  }
}

function showAlert(message, type) {
  alert.value = { show: true, message, type };
  setTimeout(() => {
    alert.value.show = false;
  }, 3000);
}

function navigateToHome() {
  router.push('/');
}
</script>

<template>
  <div :class="['faq-management', { 'dark-mode': isDarkMode }]">
    <h1 class="page-title">FAQ Management</h1>

    <div class="search-filter-container">
      <div class="search-bar-wrapper">
        <input type="text" v-model="searchQuery" placeholder="Search FAQs..." class="search-bar" />
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="filter-options">
        <label class="dark-mode-switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Dark Mode</span>
        </label>
      </div>
    </div>

    <button class="create-faq-btn" @click="openCreateDialog">
      <i class="fas fa-plus"></i> Create New FAQ
    </button>

    <div v-if="isLoading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Loading FAQs...
    </div>

    <div v-else class="faqs-container">
      <transition-group name="slide-fade">
        <div v-for="faq in filteredFAQs" :key="faq.faqId" class="faq-card">
          <div class="faq-header" @click="toggleFAQ(faq)">
            <h3 class="faq-question">{{ faq.question }}</h3>
            <i :class="['fas', faq.isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </div>
          <transition name="fade">
            <div v-if="faq.isOpen" class="faq-answer">
              <p>{{ faq.answer }}</p>
              <div class="faq-actions">
                <button class="edit-btn" @click="openEditDialog(faq)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" @click="deleteFAQ(faq.faqId)">
                  <i class="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition-group>
    </div>

    <button class="back-to-home-btn" @click="navigateToHome">
      <i class="fas fa-home"></i> Back to Home
    </button>

    <!-- Create FAQ Dialog -->
    <transition name="fade">
      <div v-if="showCreateDialog" class="dialog-overlay" @click="closeCreateDialog">
        <div class="dialog-content" @click.stop>
          <h2>Create New FAQ</h2>
          <input v-model="newFAQ.question" placeholder="Enter question" class="dialog-input" />
          <textarea v-model="newFAQ.answer" placeholder="Enter answer" class="dialog-input"></textarea>
          <div class="dialog-actions">
            <button @click="createFAQ" class="create-btn">Create</button>
            <button @click="closeCreateDialog" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit FAQ Dialog -->
    <transition name="fade">
      <div v-if="showEditDialog" class="dialog-overlay" @click="closeEditDialog">
        <div class="dialog-content" @click.stop>
          <h2>Edit FAQ</h2>
          <input v-model="editingFAQ.question" placeholder="Enter question" class="dialog-input" />
          <textarea v-model="editingFAQ.answer" placeholder="Enter answer" class="dialog-input"></textarea>
          <div class="dialog-actions">
            <button @click="updateFAQ" class="update-btn">Update</button>
            <button @click="closeEditDialog" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Alert Component -->
    <transition name="fade">
      <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
        {{ alert.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.faq-management {
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

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  padding-bottom: 10px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: #3498db;
}

.search-filter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 600px;
}

.search-bar-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.search-bar {
  padding: 12px 40px 12px 20px;
  width: 100%;
  border-radius: 25px;
  border: 2px solid #3498db;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3498db;
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

.create-faq-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.create-faq-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(46, 204, 113, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.faqs-container {
  width: 100%;
  max-width: 800px;
}

.faq-card {
  background-color: white;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.faq-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}

.faq-header:hover {
  background-color: #e9ecef;
}

.faq-question {
  margin: 0;
  font-size: 1.1em;
  color: #2c3e50;
}

.faq-answer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.faq-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  margin-left: 10px;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
}

.dialog-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
}

.create-btn, .update-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  margin-left: 10px;
}

.create-btn, .update-btn {
  background-color: #2ecc71;
  color: white;
}

.create-btn:hover, .update-btn:hover {
  background-color: #27ae60;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

/* Dark mode styles */
.dark-mode .page-title {
  color: #ecf0f1;
}

.dark-mode .search-bar {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #3498db;
}

.dark-mode .faq-card {
  background-color: #34495e;
}

.dark-mode .faq-header {
  background-color: #2c3e50;
}

.dark-mode .faq-header:hover {
  background-color: #243342;
}

.dark-mode .faq-question {
  color: #ecf0f1;
}

.dark-mode .faq-answer {
  border-top-color: #2c3e50;
}

.dark-mode .dialog-content {
  background-color: #34495e;
  color: #ecf0f1;
}


.dark-mode .dialog-content {
  background-color: #34495e;
  color: #ecf0f1;
}

.dark-mode .dialog-input {
  background-color: #2c3e50;
  color: #ecf0f1;
  border-color: #3498db;
}

.dark-mode .create-btn,
.dark-mode .update-btn {
  background-color: #27ae60;
}

.dark-mode .create-btn:hover,
.dark-mode .update-btn:hover {
  background-color: #2ecc71;
}

.dark-mode .cancel-btn {
  background-color: #7f8c8d;
}

.dark-mode .cancel-btn:hover {
  background-color: #95a5a6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  z-index: 1000;
}

.alert-success {
  background-color: #2ecc71;
}

.alert-error {
  background-color: #e74c3c;
}
</style>