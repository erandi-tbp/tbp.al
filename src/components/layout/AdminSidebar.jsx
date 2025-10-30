import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChartBarIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  StarIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  WrenchScrewdriverIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track which menus are open (all collapsed by default)
  const [openMenus, setOpenMenus] = useState({
    content: false,
    services: false,
    projects: false,
    testimonials: false,
    pages: false
  });

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      Icon: ChartBarIcon
    },
    {
      label: 'Content',
      Icon: FolderOpenIcon,
      key: 'content',
      children: [
        {
          label: 'Services',
          Icon: Cog6ToothIcon,
          key: 'services',
          children: [
            { path: '/admin/service-groups', label: 'All Service Groups' },
            { path: '/admin/service-groups/new', label: 'Add New Service Group' },
            { path: '/admin/services', label: 'All Services' },
            { path: '/admin/services/new', label: 'Add New Service' }
          ]
        },
        {
          label: 'Projects',
          Icon: BriefcaseIcon,
          key: 'projects',
          children: [
            { path: '/admin/projects', label: 'All Projects' },
            { path: '/admin/projects/new', label: 'Add New Project' },
            { path: '/admin/case-studies', label: 'All Case Studies' },
            { path: '/admin/case-studies/new', label: 'Add New Case Study' }
          ]
        },
        {
          label: 'Testimonials',
          Icon: StarIcon,
          key: 'testimonials',
          children: [
            { path: '/admin/testimonials', label: 'All Testimonials' },
            { path: '/admin/testimonials/new', label: 'Add New Testimonial' }
          ]
        },
        {
          label: 'Pages',
          Icon: DocumentIcon,
          key: 'pages',
          children: [
            { path: '/admin/pages', label: 'All Pages' },
            { path: '/admin/pages/new', label: 'Add New Page' }
          ]
        },
        {
          path: '/admin/seo',
          label: 'SEO',
          Icon: MagnifyingGlassIcon
        }
      ]
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      Icon: WrenchScrewdriverIcon
    }
  ];

  return (
    <aside className="w-64 bg-bg-secondary border-r border-text-primary/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-text-primary/10">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          TBP.AL
        </h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.Icon;

            // Parent item with children (collapsible)
            if (item.children) {
              const isOpen = openMenus[item.key];
              const ChevronIcon = isOpen ? ChevronDownIcon : ChevronRightIcon;

              // Check if any nested child is active
              const isAnyChildActive = item.children.some(child => {
                if (child.path) {
                  return location.pathname.startsWith(child.path);
                }
                // Check nested children (3rd level)
                if (child.children) {
                  return child.children.some(nested =>
                    location.pathname.startsWith(nested.path)
                  );
                }
                return false;
              });

              return (
                <li key={item.key}>
                  {/* Parent Button */}
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-body transition-colors ${
                      isAnyChildActive
                        ? 'text-accent font-bold'
                        : 'text-text-primary hover:bg-bg-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronIcon className="w-4 h-4" />
                  </button>

                  {/* Children (Level 2) */}
                  {isOpen && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.Icon;

                        // Level 2 with Level 3 children
                        if (child.children) {
                          const isChildOpen = openMenus[child.key];
                          const ChildChevronIcon = isChildOpen ? ChevronDownIcon : ChevronRightIcon;
                          const isAnyGrandchildActive = child.children.some(nested =>
                            location.pathname.startsWith(nested.path)
                          );

                          return (
                            <li key={child.key}>
                              {/* Level 2 Button */}
                              <button
                                onClick={() => toggleMenu(child.key)}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-body transition-colors ${
                                  isAnyGrandchildActive
                                    ? 'text-accent font-bold'
                                    : 'text-text-primary hover:bg-bg-primary'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {ChildIcon && <ChildIcon className="w-4 h-4" />}
                                  <span>{child.label}</span>
                                </div>
                                <ChildChevronIcon className="w-3 h-3" />
                              </button>

                              {/* Level 3 Children */}
                              {isChildOpen && (
                                <ul className="ml-6 mt-1 space-y-1">
                                  {child.children.map((nested) => (
                                    <li key={nested.path}>
                                      <NavLink
                                        to={nested.path}
                                        className={({ isActive }) =>
                                          `flex items-center gap-2 px-3 py-2 rounded-lg font-body transition-colors ${
                                            isActive
                                              ? 'bg-accent text-white font-bold'
                                              : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                                          }`
                                        }
                                      >
                                        <span className="w-1 h-1 rounded-full bg-current"></span>
                                        <span>{nested.label}</span>
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        }

                        // Level 2 single item (like SEO under Content)
                        return (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg font-body transition-colors ${
                                  isActive
                                    ? 'bg-accent text-white font-bold'
                                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                                }`
                              }
                            >
                              {ChildIcon && <ChildIcon className="w-4 h-4" />}
                              <span>{child.label}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Single item (no children) - Dashboard & Settings
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-body transition-colors ${
                      isActive
                        ? 'bg-accent text-white font-bold'
                        : 'text-text-primary hover:bg-bg-primary'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-text-primary/10">
        <div className="mb-3 pb-3 border-b border-text-primary/10">
          <p className="text-sm font-body font-bold text-text-primary truncate">
            {user?.name || user?.email}
          </p>
          <p className="text-xs text-text-secondary font-body truncate">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 bg-red-500/10 text-red-500 font-body font-bold rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
