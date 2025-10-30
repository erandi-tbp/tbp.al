import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/admin/ProtectedRoute';
import { AdminRedirect } from '../components/admin/AdminRedirect';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomePage />
  },

  // Admin route - redirects based on auth status
  {
    path: '/admin',
    element: <AdminRedirect />
  },

  // Admin login (public)
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
        element: <div>All Service Groups (Coming Soon)</div>
      },
      {
        path: 'service-groups/new',
        element: <div>Add New Service Group (Coming Soon)</div>
      },
      {
        path: 'service-groups/edit/:id',
        element: <div>Edit Service Group (Coming Soon)</div>
      },
      {
        path: 'services',
        element: <div>All Services (Coming Soon)</div>
      },
      {
        path: 'services/new',
        element: <div>Add New Service (Coming Soon)</div>
      },
      {
        path: 'services/edit/:id',
        element: <div>Edit Service (Coming Soon)</div>
      },
      // Projects
      {
        path: 'projects',
        element: <div>All Projects (Coming Soon)</div>
      },
      {
        path: 'projects/new',
        element: <div>Add New Project (Coming Soon)</div>
      },
      {
        path: 'projects/edit/:id',
        element: <div>Edit Project (Coming Soon)</div>
      },
      // Case Studies
      {
        path: 'case-studies',
        element: <div>All Case Studies (Coming Soon)</div>
      },
      {
        path: 'case-studies/new',
        element: <div>Add New Case Study (Coming Soon)</div>
      },
      {
        path: 'case-studies/edit/:id',
        element: <div>Edit Case Study (Coming Soon)</div>
      },
      // Testimonials
      {
        path: 'testimonials',
        element: <div>All Testimonials (Coming Soon)</div>
      },
      {
        path: 'testimonials/new',
        element: <div>Add New Testimonial (Coming Soon)</div>
      },
      {
        path: 'testimonials/edit/:id',
        element: <div>Edit Testimonial (Coming Soon)</div>
      },
      // Pages
      {
        path: 'pages',
        element: <div>All Pages (Coming Soon)</div>
      },
      {
        path: 'pages/new',
        element: <div>Add New Page (Coming Soon)</div>
      },
      {
        path: 'pages/edit/:id',
        element: <div>Edit Page (Coming Soon)</div>
      },
      // SEO
      {
        path: 'seo',
        element: <div>SEO Manager (Coming Soon)</div>
      },
      // Settings
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
]);
