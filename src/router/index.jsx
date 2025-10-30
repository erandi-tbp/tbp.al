import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage';
import { MaintenancePage } from '../pages/public/MaintenancePage';
// Services
import { ServicesArchive } from '../pages/public/services/ServicesArchive';
import { SingleService } from '../pages/public/services/SingleService';
// Service Groups
import { ServiceGroupsArchive } from '../pages/public/service-groups/ServiceGroupsArchive';
import { SingleServiceGroup } from '../pages/public/service-groups/SingleServiceGroup';
// Projects
import { ProjectsArchive } from '../pages/public/projects/ProjectsArchive';
import { SingleProject } from '../pages/public/projects/SingleProject';
// Case Studies
import { CaseStudiesArchive } from '../pages/public/case-studies/CaseStudiesArchive';
import { SingleCaseStudy } from '../pages/public/case-studies/SingleCaseStudy';
// Admin
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
// Service Groups
import { ServiceGroupsListPage } from '../pages/admin/service-groups/ServiceGroupsListPage';
import { AddServiceGroupPage } from '../pages/admin/service-groups/AddServiceGroupPage';
import { EditServiceGroupPage } from '../pages/admin/service-groups/EditServiceGroupPage';
import { ViewServiceGroupPage } from '../pages/admin/service-groups/ViewServiceGroupPage';
// Services
import { ServicesListPage } from '../pages/admin/services/ServicesListPage';
import { AddServicePage } from '../pages/admin/services/AddServicePage';
import { EditServicePage } from '../pages/admin/services/EditServicePage';
import { ViewServicePage } from '../pages/admin/services/ViewServicePage';
// Projects
import { ProjectsListPage } from '../pages/admin/projects/ProjectsListPage';
import { AddProjectPage } from '../pages/admin/projects/AddProjectPage';
import { EditProjectPage } from '../pages/admin/projects/EditProjectPage';
import { ViewProjectPage } from '../pages/admin/projects/ViewProjectPage';
// Case Studies
import { CaseStudiesListPage } from '../pages/admin/case-studies/CaseStudiesListPage';
import { AddCaseStudyPage } from '../pages/admin/case-studies/AddCaseStudyPage';
import { EditCaseStudyPage } from '../pages/admin/case-studies/EditCaseStudyPage';
import { ViewCaseStudyPage } from '../pages/admin/case-studies/ViewCaseStudyPage';
// Pages
import { PagesListPage } from '../pages/admin/pages/PagesListPage';
import { AddPagePage } from '../pages/admin/pages/AddPagePage';
import { EditPagePage } from '../pages/admin/pages/EditPagePage';
import { ViewPagePage } from '../pages/admin/pages/ViewPagePage';
// Testimonials
import { TestimonialsListPage } from '../pages/admin/testimonials/TestimonialsListPage';
import { AddTestimonialPage } from '../pages/admin/testimonials/AddTestimonialPage';
import { EditTestimonialPage } from '../pages/admin/testimonials/EditTestimonialPage';
import { ViewTestimonialPage } from '../pages/admin/testimonials/ViewTestimonialPage';
// Media
import { MediaLibraryPage } from '../pages/admin/media/MediaLibraryPage';
// Settings
import { SettingsPage } from '../pages/admin/settings/SettingsPage';
import { GeneralSettingsPage } from '../pages/admin/settings/GeneralSettingsPage';
// Layout & Auth
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/admin/ProtectedRoute';
import { AdminRedirect } from '../components/admin/AdminRedirect';
import { MaintenanceCheck } from '../components/admin/MaintenanceCheck';

export const router = createBrowserRouter([
  // Maintenance page (accessible even during maintenance)
  {
    path: '/maintenance',
    element: <MaintenancePage />
  },

  // Public routes (protected by maintenance check)
  {
    path: '/',
    element: (
      <MaintenanceCheck>
        <HomePage />
      </MaintenanceCheck>
    )
  },

  // Service Groups routes
  {
    path: '/service-groups',
    element: (
      <MaintenanceCheck>
        <ServiceGroupsArchive />
      </MaintenanceCheck>
    )
  },
  {
    path: '/service-groups/:slug',
    element: (
      <MaintenanceCheck>
        <SingleServiceGroup />
      </MaintenanceCheck>
    )
  },

  // Services routes
  {
    path: '/services',
    element: (
      <MaintenanceCheck>
        <ServicesArchive />
      </MaintenanceCheck>
    )
  },
  {
    path: '/services/:slug',
    element: (
      <MaintenanceCheck>
        <SingleService />
      </MaintenanceCheck>
    )
  },

  // Projects routes
  {
    path: '/projects',
    element: (
      <MaintenanceCheck>
        <ProjectsArchive />
      </MaintenanceCheck>
    )
  },
  {
    path: '/projects/:slug',
    element: (
      <MaintenanceCheck>
        <SingleProject />
      </MaintenanceCheck>
    )
  },

  // Case Studies routes
  {
    path: '/case-studies',
    element: (
      <MaintenanceCheck>
        <CaseStudiesArchive />
      </MaintenanceCheck>
    )
  },
  {
    path: '/case-studies/:slug',
    element: (
      <MaintenanceCheck>
        <SingleCaseStudy />
      </MaintenanceCheck>
    )
  },

  // Admin route - redirects based on auth status (not affected by maintenance)
  {
    path: '/admin',
    element: <AdminRedirect />
  },

  // Admin login (public, not affected by maintenance)
  {
    path: '/admin/login',
    element: <AdminLogin />
  },

  // Protected admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      // Services
      {
        path: 'service-groups',
        element: <ServiceGroupsListPage />
      },
      {
        path: 'service-groups/new',
        element: <AddServiceGroupPage />
      },
      {
        path: 'service-groups/:id',
        element: <ViewServiceGroupPage />
      },
      {
        path: 'service-groups/:id/edit',
        element: <EditServiceGroupPage />
      },
      {
        path: 'services',
        element: <ServicesListPage />
      },
      {
        path: 'services/new',
        element: <AddServicePage />
      },
      {
        path: 'services/:id',
        element: <ViewServicePage />
      },
      {
        path: 'services/:id/edit',
        element: <EditServicePage />
      },
      // Projects
      {
        path: 'projects',
        element: <ProjectsListPage />
      },
      {
        path: 'projects/new',
        element: <AddProjectPage />
      },
      {
        path: 'projects/:id',
        element: <ViewProjectPage />
      },
      {
        path: 'projects/:id/edit',
        element: <EditProjectPage />
      },
      // Case Studies
      {
        path: 'case-studies',
        element: <CaseStudiesListPage />
      },
      {
        path: 'case-studies/new',
        element: <AddCaseStudyPage />
      },
      {
        path: 'case-studies/:id',
        element: <ViewCaseStudyPage />
      },
      {
        path: 'case-studies/:id/edit',
        element: <EditCaseStudyPage />
      },
      // Testimonials
      {
        path: 'testimonials',
        element: <TestimonialsListPage />
      },
      {
        path: 'testimonials/new',
        element: <AddTestimonialPage />
      },
      {
        path: 'testimonials/:id',
        element: <ViewTestimonialPage />
      },
      {
        path: 'testimonials/:id/edit',
        element: <EditTestimonialPage />
      },
      // Pages
      {
        path: 'pages',
        element: <PagesListPage />
      },
      {
        path: 'pages/new',
        element: <AddPagePage />
      },
      {
        path: 'pages/:id',
        element: <ViewPagePage />
      },
      {
        path: 'pages/:id/edit',
        element: <EditPagePage />
      },
      // SEO
      {
        path: 'seo',
        element: <div>SEO Manager (Coming Soon)</div>
      },
      // Media Library
      {
        path: 'media-library',
        element: <MediaLibraryPage />
      },
      // Settings
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'settings/general',
        element: <GeneralSettingsPage />
      }
    ]
  }
]);
