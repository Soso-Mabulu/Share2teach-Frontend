import '@/assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleSignInButton from 'vue3-google-oauth2'

const gAuthOptions = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true
}

const app = createApp(App)

app.use(GoogleSignInButton, gAuthOptions)
app.use(router)

app.mount('#app')
