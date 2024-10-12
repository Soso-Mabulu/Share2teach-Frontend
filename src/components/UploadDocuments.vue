Improved Document Upload Component

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import ModaratorSidebar from '@/components/ModaratorSidebar.vue'; 
import MainFooter from '@/components/MainFooter.vue'; 
import ModaratorNavbar from '@/components/ModaratorNavbar.vue';

const router = useRouter();

// Form state
const title = ref('');
const module = ref('');
const description = ref('');
const university = ref('');
const category = ref('');
const academicYear = ref('');
const files = ref(null);
const isDragging = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref(''); // 'success' or 'error'
const isUploading = ref(false);


// Suggestions data
const allModules = ['Module A', 'Module B', 'Module C', 'Module D'];
const allUniversities = [
  'University of Cape Town',
  'University of the Witwatersrand',
  'Stellenbosch University',
  'University of Pretoria',
  'University of KwaZulu-Natal',
  'North-West University',
  'University of Johannesburg',
  'University of the Free State',
  'Nelson Mandela University',
  'Cape Peninsula University of Technology',
];
const allCategories = ['Research Paper', 'Thesis', 'Project Report', 'Assignment', 'Case Study', 'Presentation'];

const moduleSuggestions = ref([]);
const universitySuggestions = ref([]);
const categorySuggestions = ref([]);
const academicYearSuggestions = ref([]);

// Generate academic year suggestions
const currentYear = new Date().getFullYear();
const startYear = currentYear - 5; // Starting from 5 years ago
const endYear = currentYear + 5; // Up to 5 years in the future
academicYearSuggestions.value = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());

// Function to filter suggestions based on input
const filterModuleSuggestions = computed(() => {
  if (!module.value) return [];
  return allModules.filter(item => item.toLowerCase().includes(module.value.toLowerCase()));
});

const filterUniversitySuggestions = computed(() => {
  if (!university.value) return [];
  return allUniversities.filter(item => item.toLowerCase().includes(university.value.toLowerCase()));
});

const filterCategorySuggestions = computed(() => {
  if (!category.value) return [];
  return allCategories.filter(item => item.toLowerCase().includes(category.value.toLowerCase()));
});

const filterAcademicYearSuggestions = computed(() => {
  if (!academicYear.value) return [];
  return academicYearSuggestions.value.filter(item => item.includes(academicYear.value));
});

// Function to handle file selection via drag-and-drop
const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer.files.length > 0) {
    files.value = event.dataTransfer.files;
  } else {
    console.error('No files dropped');
  }
};

// Function to handle clicking the drop zone
const handleDropZoneClick = () => {
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.click();
  } else {
    console.error('File input element not found');
  }
};

// Function to validate the academic year
const isValidAcademicYear = (year) => {
  return /^\d{4}$/.test(year) && year >= startYear && year <= endYear;
};

const uploadDocuments = async () => {
  // Validate all required fields
  if (!title.value || !module.value || !description.value || !university.value || !category.value || !academicYear.value) {
    showToast.value = true;
    toastMessage.value = 'Please fill in all required fields.';
    toastType.value = 'error';
    return;
  }

  if (!isValidAcademicYear(academicYear.value)) {
    showToast.value = true;
    toastMessage.value = 'Please enter a valid academic year (YYYY).';
    toastType.value = 'error';
    return;
  }

  if (!files.value || files.value.length === 0) {
    showToast.value = true;
    toastMessage.value = 'Please select files to upload.';
    toastType.value = 'error';
    return;
  }

  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  for (let i = 0; i < files.value.length; i++) {
    if (!allowedFileTypes.includes(files.value[i].type)) {
      showToast.value = true;
      toastMessage.value = 'Unsupported file type. Only PDF, DOCX, XLSX, and PPTX are allowed.';
      toastType.value = 'error';
      return;
    }
  }

  const formData = new FormData();

  for (let i = 0; i < files.value.length; i++) {
    formData.append('files', files.value[i]);
  }

  formData.append('title', title.value);
  formData.append('module', module.value);
  formData.append('description', description.value);
  formData.append('university', university.value);
  formData.append('category', category.value);
  formData.append('academicYear', academicYear.value);

  try {
    isUploading.value = true;

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    // Add token to form data to send to the backend
    formData.append('token', token);

    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.post(`${import.meta.env.VITE_API_URL}api/v1/upload`, formData, { headers });

    if (response.status === 200) {
      const uploadedUrls = response.data.results.map(result => result.url);
      showToast.value = true;
      toastMessage.value = `Documents uploaded successfully! ${uploadedUrls.join(', ')}`;
      toastType.value = 'success';
      resetForm();
      router.push('/dashboard');
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload failed:', error);
    showToast.value = true;
    toastMessage.value = error.message || 'Failed to upload documents. Please try again.';
    toastType.value = 'error';
  } finally {
    isUploading.value = false;
  }
};




// Function to reset form fields after successful upload
const resetForm = () => {
  title.value = '';
  module.value = '';
  description.value = '';
  university.value = '';
  category.value = '';
  academicYear.value = '';
  files.value = null;
};

// Function to select a suggestion
const selectModuleSuggestion = (suggestion) => {
  module.value = suggestion;
  moduleSuggestions.value = [];
};

const selectUniversitySuggestion = (suggestion) => {
  university.value = suggestion;
  universitySuggestions.value = [];
};

const selectCategorySuggestion = (suggestion) => {
  category.value = suggestion;
  categorySuggestions.value = [];
};

const selectAcademicYearSuggestion = (suggestion) => {
  academicYear.value = suggestion;
  academicYearSuggestions.value = [];
};

</script>

<template>
  <ModaratorNavbar />
  <div class="min-h-screen flex flex-col lg:flex-row bg-gray-50">
    <ModaratorSidebar />
  
    <div class="flex-grow p-8 bg-white shadow-lg rounded-lg lg:m-8">
      <h2 class="text-4xl font-extrabold text-gray-800 mb-8">Upload Documents</h2>

      <form @submit.prevent="uploadDocuments" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 ">Title</label>
          <input
            v-model="title"
            type="text"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter Document Title"
            required
          />
        </div>
        <!-- Module -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">Module</label>
          <input
            v-model="module"
            @input="moduleSuggestions.value = filterModuleSuggestions"
            @focus="moduleSuggestions.value = filterModuleSuggestions"
            type="text"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter Module Name"
            required
          />
          <ul v-if="module && moduleSuggestions.length > 0" class="mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
            <li 
              v-for="(suggestion, index) in moduleSuggestions" 
              :key="index" 
              @click="selectModuleSuggestion(suggestion)"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
  
        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            v-model="description"
            rows="4"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter a brief description"
            required
          ></textarea>
        </div>
  
        <!-- University -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">University</label>
          <input
            v-model="university"
            @input="universitySuggestions.value = filterUniversitySuggestions"
            @focus="universitySuggestions.value = filterUniversitySuggestions"
            type="text"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter University Name"
            required
          />
          <ul v-if="university && universitySuggestions.length > 0" class="mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
            <li 
              v-for="(suggestion, index) in universitySuggestions" 
              :key="index" 
              @click="selectUniversitySuggestion(suggestion)"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
  
        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">Category</label>
          <input
            v-model="category"
            @input="categorySuggestions.value = filterCategorySuggestions"
            @focus="categorySuggestions.value = filterCategorySuggestions"
            type="text"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter Category"
            required
          />
          <ul v-if="category && categorySuggestions.length > 0" class="mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
            <li 
              v-for="(suggestion, index) in categorySuggestions" 
              :key="index" 
              @click="selectCategorySuggestion(suggestion)"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- Academic Year -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">Academic Year</label>
          <input
            v-model="academicYear"
            @input="academicYearSuggestions.value = filterAcademicYearSuggestions"
            @focus="academicYearSuggestions.value = filterAcademicYearSuggestions"
            type="text"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter Academic Year (YYYY)"
            required
          />
          <ul v-if="academicYear && academicYearSuggestions.length > 0" class="mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
            <li 
              v-for="(suggestion, index) in academicYearSuggestions" 
              :key="index" 
              @click="selectAcademicYearSuggestion(suggestion)"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>


        <!-- File Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700">Upload Files</label>
          <div 
            @drop="handleDrop" 
            @dragover.prevent 
            @dragenter="isDragging = true" 
            @dragleave="isDragging = false" 
            @click="handleDropZoneClick"
            class="mt-2 border-dashed border-2 border-gray-300 rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out hover:border-indigo-400"
            :class="{ 'bg-indigo-100': isDragging }"
          >
            <p class="text-gray-600">
              {{ files && files.length > 0 ? `${files.length} file(s) selected` : 'Drag and drop files here, or click to select files' }}
            </p>
            <input 
              id="file-input" 
              type="file" 
              multiple 
              @change="files = $event.target.files" 
              class="hidden"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500">Supported file types: PDF, DOCX, XLSX, PPTX, and more.</p>
        </div>

        <button 
          type="submit" 
          class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isUploading"
        >
          <span v-if="!isUploading">Upload Documents</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        </button>
      </form>

      <!-- Toast Notification -->
      <transition name="fade">
        <div 
          v-if="showToast" 
          :class="`fixed top-4 right-4 bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ${toastType === 'success' ? 'border-green-400 bg-green-100 text-green-800' : 'border-red-400 bg-red-100 text-red-800'}`"
        >
          <p>{{ toastMessage }}</p>
          <button @click="showToast = false" class="absolute top-1 right-1 text-sm text-gray-500 hover:text-gray-700">✖</button>
        </div>
      </transition>
    </div>
  </div>

  <MainFooter />
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
