import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import PublicUserView from '@/views/PublicUserView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import SearchResultsView from '@/views/SearchResultsView.vue'; // Import the new view
import ModeratorDashboardView from '@/views/ModeratorDashboardView.vue'
import UploadDocuments from '@/components/UploadDocuments.vue';
import ViewAllDocumentsView from '@/views/ViewAllDocumentsView.vue';
import ModerateDocumentsView from '@/views/ModerateDocumentsView.vue'
import SubjectView from '@/views/SubjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/user-dashboard',
      name: 'PublicUserView',
      component: PublicUserView,
    },
    {
      path: '/forgot-password',
      name: 'ForgotPasswordView',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'ResetPasswordView',
      component: ResetPasswordView,
    },
    {
      path: '/search-results', // New route for search results
      name: 'search-results',
      component: SearchResultsView,
    },
    {
      path: '/moderator-dashboard',
      name: 'ModeratorDashboardView',
      component: ModeratorDashboardView
    },
    {
      path: '/upload-documents',
      name: 'UploadDocuments',
      component: UploadDocuments,
    },
    {
      path: '/update-profile',
      name: 'UpdateProfile',
      component: () => import('@/components/UpdateProfilePage.vue')
    },
    { 
      path: '/pending-documents', 
      name: 'PendingDocuments', 
      component: ViewAllDocumentsView 
    },
    { 
      path: '/approved-documents', 
      name: 'ApprovedDocuments', 
      component: ViewAllDocumentsView 
    },
    {
      path: '/moderate-documents',
      name: 'ModerateDocumentsView',
      component: ModerateDocumentsView
    },
    {
      path: '/subject',
      name: 'SubjectView',
      component: SubjectView
    }

  ],
});

export default router;
