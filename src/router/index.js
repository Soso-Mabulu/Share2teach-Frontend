import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import PublicUserView from '@/views/PublicUserView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import DetailedView from '@/views/DetailedView.vue';
import SearchResultsView from '@/views/SearchResultsView.vue';
import AllDocuments from '@/views/AllDocuments.vue';
import FAQView from '@/views/FAQView.vue';

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
import EducatorDashboardView from '@/views/EducatorDashboardView.vue';
import EducatorSubjectView from '@/views/EducatorSubjectView.vue';
import EducatorContributorView from '@/views/EducatorContributorView.vue';
import EducatorSelfDirectedView from '@/views/EducatorSelfDirectedView.vue';
import EducatorUpload from '@/components/EducatorUpload.vue';
import AllApprovedDocumentsView from '@/views/AllApprovedDocumentsView.vue';

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
import AdminMaintainFAQ from '@/views/Admin-MaintainFAQ.vue';
import AdminMaintainDocuments from '@/views/Admin-MaintainDocuments.vue';

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
      path: '/detailed-view',
      name: 'DetailedView',
      component: DetailedView,
      props: route => ({ activeEndpoint: route.params.endpoint }),
    },
    {
      path: '/search-results',
      name: 'search-results',
      component: SearchResultsView,
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
    {
      path: '/update-profile',
      name: 'UpdateProfile',
      component: () => import('@/components/UpdateProfilePage.vue')
    },

    // Moderator routes
    {
      path: '/moderator-dashboard',
      name: 'ModeratorDashboardView',
      component: ModeratorDashboardView
    },
    {
      path: '/moderator-approved-documents',
      name: 'AllApprovedDocumentsView',
      component: ModeratorAllApprovedDocumentsView
    },
    {
      path: '/moderator-pending-documents',
      name: 'PendingDocuments',
      component: ModeratorViewAllDocumentsView
    },
    {
      path: '/moderator-approved-documents',
      name: 'ApprovedDocuments',
      component: ModeratorViewAllDocumentsView
    },
    {
      path: '/moderator-moderate-documents',
      name: 'ModerateDocumentsView',
      component: ModeratorModerateDocumentsView
    },
    {
      path: '/moderator-self-learning',
      name: 'SelfDirectedlearningView',
      component: ModeratorSelfDirectedlearningView
    },
    {
      path: '/moderator-view-reported-documents',
      name: 'ViewReportedView',
      component: ModeratorViewReportedView
    },
    {
      path: '/moderator-contributors',
      name: 'ContributorsView',
      component: ModeratorContributorsView
    },
    {
      path: '/moderator-search-results',
      name: 'ModeratorSearchResultsView',
      component: ModeratorSearchResultsView,
    },
    {
      path: '/moderator-upload-documents',
      name: 'ModeratorUploadDocuments',
      component: ModeratorUploadDocuments
    },
    {
      path: '/moderator-subject',
      name: 'ModeratorSubjectView',
      component: ModeratorSubjectView
    },
    {
      path: '/moderator-self-learning',
      name: 'ModeratorSelfDirectedlearningView',
      component: ModeratorSelfDirectedlearningView
    },

    // Admin routes
    {
      path: '/admin-dashboard',
      name: 'AdminDashboardView',
      component: AdminPanelView,
    },
    {
      path: '/admin-upload-documents',
      name: 'AdminUploadDocuments',
      component: AdminUploadDocuments,
    },
    {
      path: '/admin-pending-documents',
      name: 'AdminPendingDocuments',
      component: AdminViewAllDocumentsView,
    },
    {
      path: '/admin-approved-documents',
      name: 'AdminApprovedDocuments',
      component: AdminViewAllDocumentsView,
    },
    {
      path: '/admin-moderate-documents',
      name: 'AdminModerateDocumentsView',
      component: AdminModerateDocumentsView,
    },
    {
      path: '/admin-subject',
      name: 'AdminSubjectView',
      component: AdminSubjectView,
    },
    {
      path: '/admin-self-learning',
      name: 'AdminSelfDirectedlearningView',
      component: AdminSelfDirectedlearningView,
    },
    {
      path: '/admin-view-reported-documents',
      name: 'AdminViewReportedView',
      component: AdminViewReportedView,
    },
    {
      path: '/admin-contributors',
      name: 'AdminContributorsView',
      component: AdminContributorsView,
    },
    {
      path: '/admin-search-results',
      name: 'AdminSearchResultsView',
      component: AdminSearchResultsView,
    },
    {
      path: '/admin-maintain-users',
      name: 'AdminMaintainUsersView',
      component: AdminMaintainUsersView,
    },
    {
      path: '/admin-maintain-faq',
      name: 'AdminMaintainFAQ',
      component: AdminMaintainFAQ,
    },
    {
      path: '/admin-maintain-documents',
      name: 'AdminMaintainDocuments',
      component: AdminMaintainDocuments
    },

    // Educator routes
    {
      path: '/educator-dashboard',
      name: 'EducatorDashboardView',
      component: EducatorDashboardView,
    },
    {
      path: '/educator-subject',
      name: 'EducatorSubjectView',
      component: EducatorSubjectView,
    },
    {
      path: '/educator-contributor',
      name: 'EducatorContributorView',
      component: EducatorContributorView,
    },
    {
      path: '/educator-self-learning',
      name: 'EducatorSelfDirectedView',
      component: EducatorSelfDirectedView,
    },
    {
      path: '/educator-upload',
      name: 'EducatorUpload',
      component: EducatorUpload,
    },
    {
      path: '/educator-approved-documents',
      name: 'AllApprovedDocumentsView',
      component: AllApprovedDocumentsView,
    },
  ],
});

export default router;
