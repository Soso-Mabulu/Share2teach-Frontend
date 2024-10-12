import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import PublicUserView from '@/views/PublicUserView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import SearchResultsView from '@/views/SearchResultsView.vue';
import AllDocuments from '@/views/AllDocuments.vue';



// Moderator views  
import ModeratorDashboardView from '@/views/ModeratorDashboardView.vue';
import ModeratorViewReportedView from '@/views/Moderator-ViewReportedView.vue';
import ModeratorContributorsView from '@/views/Moderator-ContributorsView.vue';
import ModeratorSearchResultsView from '@/views/Moderator-SearchResultsView.vue';
import ModeratorUploadDocuments from '@/views/Moderator-UploadDocumentsView.vue';
import ModeratorViewAllDocumentsView from '@/views/Moderator-ViewAllDocumentsView.vue';
import ModeratorModerateDocumentsView from '@/views/Moderator-ModerateDocumentsView.vue';
import ModeratorSubjectView from '@/views/Moderator-SubjectView.vue';
import ModeratorSelfDirectedlearningView from '@/views/Moderator-SelfDirectedlearningView.vue';
import ModeratorAllApprovedDocumentsView from '@/views/Moderator-ViewAllDocumentsView.vue';

// Educator views
import EducatorDashboardView from '@/views/Educator-DashboardView.vue';
import EducatorSubjectView from '@/views/Educator-SubjectView.vue';
import EducatorContributorView from '@/views/Educator-ContributorView.vue';
import EducatorSelfDirectedView from '@/views/Educator-SelfDirectedLearningView.vue';
import EducatorUpload from '@/views/Educator-Upload.vue';
import EducatorFAQView from '@/views/Educator-FAQView.vue';
import EducatorAllApprovedDocumentsView from '@/views/EducatorAllApproved-DocumentsView.vue';


// Admin views
import AdminViewReportedView from '@/views/Admin-ViewReportedView.vue';
import AdminContributorsView from '@/views/Admin-ContributorsView.vue';
import AdminSearchResultsView from '@/views/Admin-SearchResultsView.vue';
import AdminUploadDocuments from '@/views/Admin-UploadDocumentsView.vue';
import AdminViewAllDocumentsView from '@/views/Admin-ViewAllDocumentsView.vue';
import AdminModerateDocumentsView from '@/views/Admin-ModerateDocumentsView.vue';
import AdminSubjectView from '@/views/Admin-SubjectView.vue';
import AdminSelfDirectedlearningView from '@/views/Admin-SelfDirectedlearningView.vue';
import AdminPanelView from '@/views/AdminPanelView.vue';
import AdminMaintainUsersView from '@/views/Admin-MaintainUsersView.vue';
import AdminAdvancedReportsView from '@/views/Admin-AdvancedReportsView.vue';
import AdminMaintainFAQ from '@/views/Admin-MaintainFAQ.vue';
import AdminMaintainDocuments from '@/views/Admin-MaintainDocuments.vue';
import AdminProfile from '@/views/Admin-ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
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
      meta: { requiresAuth: true }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPasswordView',
      component: ForgotPasswordView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reset-password',
      name: 'ResetPasswordView',
      component: ResetPasswordView,
      meta: { requiresAuth: true }
    },
    {
      path: '/search-results',
      name: 'search-results',
      component: SearchResultsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/all-documents',
      name: 'AllDocuments',
      component: AllDocuments,
      meta: { requiresAuth: true },
    },
    {
      path: '/update-profile',
      name: 'UpdateProfile',
      component: () => import('@/components/UpdateProfilePage.vue'),
      meta: { requiresAuth: true },

    },

    // Moderator routes
    {
      path: '/moderator-dashboard',
      name: 'ModeratorDashboardView',
      component: ModeratorDashboardView,
      meta: { requiresAuth: true },

    },
    {
      path: '/moderator-approved-documents',
      name: 'AllApprovedDocumentsView',
      component: ModeratorAllApprovedDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-pending-documents',
      name: 'PendingDocuments',
      component: ModeratorViewAllDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-approved-documents',
      name: 'ApprovedDocuments',
      component: ModeratorViewAllDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-moderate-documents',
      name: 'ModerateDocumentsView',
      component: ModeratorModerateDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-self-learning',
      name: 'SelfDirectedlearningView',
      component: ModeratorSelfDirectedlearningView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-view-reported-documents',
      name: 'ViewReportedView',
      component: ModeratorViewReportedView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-contributors',
      name: 'ContributorsView',
      component: ModeratorContributorsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-search-results',
      name: 'ModeratorSearchResultsView',
      component: ModeratorSearchResultsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-upload-documents',
      name: 'ModeratorUploadDocuments',
      component: ModeratorUploadDocuments,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-subject',
      name: 'ModeratorSubjectView',
      component: ModeratorSubjectView,
      meta: { requiresAuth: true },
    },
    {
      path: '/moderator-self-learning',
      name: 'ModeratorSelfDirectedlearningView',
      component: ModeratorSelfDirectedlearningView,
      meta: { requiresAuth: true },
    },

    // Admin routes
    {
      path: '/admin-dashboard',
      name: 'AdminDashboardView',
      component: AdminPanelView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-upload-documents',
      name: 'AdminUploadDocuments',
      component: AdminUploadDocuments,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-pending-documents',
      name: 'AdminPendingDocuments',
      component: AdminViewAllDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-approved-documents',
      name: 'AdminApprovedDocuments',
      component: AdminViewAllDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-moderate-documents',
      name: 'AdminModerateDocumentsView',
      component: AdminModerateDocumentsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-subject',
      name: 'AdminSubjectView',
      component: AdminSubjectView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-self-learning',
      name: 'AdminSelfDirectedlearningView',
      component: AdminSelfDirectedlearningView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-view-reported-documents',
      name: 'AdminViewReportedView',
      component: AdminViewReportedView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-contributors',
      name: 'AdminContributorsView',
      component: AdminContributorsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-search-results',
      name: 'AdminSearchResultsView',
      component: AdminSearchResultsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-maintain-users',
      name: 'AdminMaintainUsersView',
      component: AdminMaintainUsersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-advanced-reports',
      name: 'AdminAdvancedReportsView',
      component: AdminAdvancedReportsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-maintain-faq',
      name: 'AdminMaintainFAQ',
      component: AdminMaintainFAQ,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-maintain-documents',
      name: 'AdminMaintainDocuments',
      component: AdminMaintainDocuments,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin-profile',
      name: 'AdminProfile',
      component: AdminProfile,
      meta: { requiresAuth: true },
    },


    // Educator routes
    {
      path: '/educator-dashboard',
      name: 'EducatorDashboardView',
      component: EducatorDashboardView,
      meta: { requiresAuth: true },
    },
    
    
    {
      path: '/educator-subject',
      name: 'EducatorSubjectView',
      component: EducatorSubjectView,
      meta: { requiresAuth: true },
    },
    {
      path: '/educator-contributors',
      name: 'EducatorContributorView',
      component: EducatorContributorView,
      meta: { requiresAuth: true },
    },
    {
      path: '/educator-self-learning',
      name: 'EducatorSelfDirectedView',
      component: EducatorSelfDirectedView,
      meta: { requiresAuth: true },
    },
    {
      path: '/educator-faq',
      name: 'EducatorFAQView',
      component: EducatorFAQView,
    },
    {
      path: '/educator-faq',
      name: 'EducatorFAQView',
      component: EducatorFAQView,
    },
    {
      path: '/educator-upload',
      name: 'EducatorUpload',
      component: EducatorUpload,
      meta: { requiresAuth: true },
    },
    {
      path: '/approved-documents',
      name: 'EducatorAllApprovedDocumentsView',
      component: EducatorAllApprovedDocumentsView,
      meta: { requiresAuth: true },
    },
  ],
});


// Global before guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // If no token, redirect to login
      next({ path: '/login' });
    } else {
      // If token exists, allow access
      next();
    }
  } else {
    // If route doesn't require auth, allow access
    next();
  }
});


export default router;
