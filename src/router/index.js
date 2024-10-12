import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import PublicUserView from '@/views/PublicUserView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import DetailedView from '@/views/DetailedView.vue';
import SearchResultsView from '@/views/SearchResultsView.vue'; // Import the new view
import ModeratorDashboardView from '@/views/ModeratorDashboardView.vue'
import UploadDocuments from '@/components/UploadDocuments.vue';
import ViewAllDocumentsView from '@/views/ViewAllDocumentsView.vue';
import ModerateDocumentsView from '@/views/ModerateDocumentsView.vue'
import SubjectView from '@/views/SubjectView.vue'
import SelfDirectedlearningView from '@/views/SelfDirectedlearningView.vue';
import AllDocuments from '@/views/AllDocuments.vue'; // Adjust the path as necessary
import FAQView from '@/views/FAQView.vue';
import ViewReportedView from '@/views/ViewReportedView.vue';
import ContributorsView from '@/views/ContributorsView.vue';
import EducatorDashboardView from '@/views/EducatorDashboardView.vue';
import AllApprovedDocumentsView from '@/views/AllApprovedDocumentsView.vue';
import EducatorSubjectView from '@/views/EducatorSubjectView.vue';
import EducatorContributorView from '@/views/EducatorContributorView.vue';
import EducatorSelfDirectedView from '@/views/EducatorSelfDirectedView.vue';
import EducatorUpload from '@/components/EducatorUpload.vue';

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
      path: '/admin-dashboard',
      name: 'AdminDashboardView',
      component: AdminDashboardView,
    },
    {
      path: '/detailed-view',
      name: 'DetailedView',
      component: DetailedView,
      props: route => ({ activeEndpoint: route.params.endpoint }),
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
      path: '/educator-dashboard',
      name: 'EducatorDashboardView',
      component: EducatorDashboardView,
    },
    {
      path: '/approved-documents',
      name: 'AllApprovedDocumentsView',
      component: AllApprovedDocumentsView
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
      path: '/self-learning',
      name: 'SelfDirectedlearningView',
      component: SelfDirectedlearningView
    },
    {
      path: '/view-reported-documents',
      name: 'ViewReportedView',
      component: ViewReportedView
    },
    {
      path: '/contributors',
      name: 'ContributorsView',
      component: ContributorsView
    },
    {
      path: '/all-documents',
      name: 'AllDocuments',
      component: AllDocuments,
    },  
    {
      path: '/faq',
      name: 'FAQView',
      component: FAQView,
    },
  ],
});

export default router;
