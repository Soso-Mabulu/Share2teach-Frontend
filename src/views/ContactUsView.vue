<template>
    <div class="min-h-screen bg-gradient-to-r">
      <!-- LandingNavbar component added here -->
      <LandingNavbar />
  
      <!-- Get in Touch section with adjusted spacing -->
      <div class="flex flex-col lg:flex-row items-center justify-between p-12 relative mt-12"> 
        <div class="w-full lg:w-1/2 p-6">
          <h1 class="text-5xl font-bold text-black animate-vibrate">Get in Touch</h1>
          <p class="mt-4 text-lg text-black">
            Have any questions or need further assistance? We’re here to help! Whether you’re curious about our services or have suggestions for improvement, don’t hesitate to reach out. Our team is always ready to listen and offer the support you need to make your experience with us exceptional. Let's start a conversation!
          </p>
  
          <!-- Success message moved here below the paragraph -->
          <div v-if="messageSent" class="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Your message has been sent successfully! We'll get back to you shortly.
          </div>
        </div>
  
        <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow-lg p-8 w-full lg:w-1/2 mt-6 lg:mt-0">
          <h2 class="text-xl font-bold mb-4">Drop a Message</h2>
  
          <!-- Full Name Input -->
          <div class="mb-4">
            <label for="full-name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              v-model="formData.fullName"
              type="text"
              id="full-name"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            />
          </div>
  
          <!-- Phone Input -->
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              v-model="formData.phone"
              type="tel"
              id="phone"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            />
          </div>
  
          <!-- Email Input -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            />
          </div>
  
          <!-- Subject Input -->
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input
              v-model="formData.subject"
              type="text"
              id="subject"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            />
          </div>
  
          <!-- Message Input -->
          <div class="mb-4">
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              v-model="formData.message"
              id="message"
              rows="4"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-purple-300"
            ></textarea>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import LandingNavbar from '@/components/LandingNavbar.vue'; // Import the LandingNavbar component
  
  export default {
    components: {
      LandingNavbar, // Register the LandingNavbar component
    },
    data() {
      return {
        formData: {
          fullName: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        },
        messageSent: false // Add a property to track form submission
      };
    },
    methods: {
      submitForm() {
        console.log('Form submitted:', this.formData);
        // Handle form submission, e.g., send data to an API
  
        // Show success message
        this.messageSent = true;
  
        // Reset the form
        this.formData = { fullName: '', phone: '', email: '', subject: '', message: '' };
  
        // Optionally, hide the success message after a longer duration
        setTimeout(() => {
          this.messageSent = false;
        }, 1000); // Hide message after 10 seconds
      }
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient-to-r {
    background: #f6e4fd; /* Dark purple at the right, light purple at the left */
  }
  
  .min-h-screen {
    min-height: 100vh; /* Ensure the background covers the entire height of the page */
  }
  
  .mt-12 {
    margin-top: 3rem; /* Adjust this value to increase or decrease the space */
  }
  </style>
  