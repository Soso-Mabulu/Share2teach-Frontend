<template>
  <div class="document-grid">
    <h1>Document Management</h1>
    <div class="grid-container">
      <div class="grid-item" v-for="(docType, index) in documentTypes" :key="index">
        <img :src="docType.icon" alt="Document Icon" class="doc-icon" />
        <h3>{{ docType.label }}</h3>
        <button @click="viewDocuments(docType.endpoint, docType.label)">View All</button>
      </div>
    </div>

    <detailed-view
      v-if="activeEndpoint"
      :activeEndpoint="activeEndpoint"
      :activeEndpointLabel="activeEndpointLabel"
      @close-detailed-view="closeDetailedView"
    />
  </div>
</template>

<script>
import DetailedView from '@/views/DetailedView.vue';
import documentIcon from '@/assets/documentIcon.png'; // Update with the correct icon path

export default {
  components: {
    DetailedView,
  },
  data() {
    return {
      documentTypes: [
        {
          label: 'All Documents',
          icon: documentIcon,
          endpoint: '/api/v1/documents/all',
        },
        {
          label: 'Approved Documents',
          icon: documentIcon,
          endpoint: '/api/v1/documents/approved',
        },
        {
          label: 'Pending Documents',
          icon: documentIcon,
          endpoint: '/api/v1/documents/pending',
        },
        {
          label: 'Reported Documents',
          icon: documentIcon,
          endpoint: '/api/v1/documents/reported',
        },
        {
          label: 'Denied Documents',
          icon: documentIcon,
          endpoint: '/api/v1/documents/denied',
        },
      ],
      activeEndpoint: '',
      activeEndpointLabel: '',
    };
  },
  methods: {
    viewDocuments(endpoint, label) {
      this.activeEndpoint = endpoint;
      this.activeEndpointLabel = label;
    },
    closeDetailedView() {
      this.activeEndpoint = '';
    },
  },
};
</script>

<style scoped>
.document-grid {
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.grid-item {
  border: 1px solid #d0b7df;
  border-radius: 8px;
  padding: 10px;
  transition: box-shadow 0.3s;
}

.grid-item:hover {
  box-shadow: 0 4px 10px rgb(202, 185, 212);
}

.doc-icon {
  width: 70px;
  height: 80px;
}

button {
  background: linear-gradient(to right, #739ea9, #f6f2f8, #2c4475);
  border: none;
  border-radius: 9999px;
  padding: 7px 20px;
  cursor: pointer;
  font-weight: bold;
  color: rgb(44, 25, 46);
  width: 150px;
  transition: transform 0.3s ease-in-out, background 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #c2b2c7, #f8f1fa, #e4e3e4);
}
</style>
