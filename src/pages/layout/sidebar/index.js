import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

const menuItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'people', label: 'Users', path: '/users' },
  { icon: 'business', label: 'Employers', path: '/companies' },
  { icon: 'work_outline', label: 'Jobs', path: '/jobs' },
  { icon: 'analytics', label: 'Analytics', path: '/analytics' },
];

const generalItems = [
  { icon: 'settings', label: 'Settings', path: '/settings' },
  { icon: 'help_outline', label: 'Help Center', path: '/help' },
];

const Sidebar = ({ collapsed = false, onToggle, onMobileClose, isMobile = false }) => {
  return (
    <aside className={`bg-card-light dark:bg-card-dark ${!isMobile ? 'border-r border-gray-200 dark:border-gray-800' : ''} flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative ${collapsed && !isMobile ? 'w-20' : 'w-64'}`}>
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-9 z-50 w-6 h-6 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-icons-outlined text-sm">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      <div className={`p-6 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <Logo collapsed={collapsed && !isMobile} />
      </div>

      <div className={`flex-1 px-4 overflow-y-auto ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="mb-6">
          {(!collapsed || isMobile) && (
            <p className="px-4 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2">
              Menu
            </p>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${collapsed && !isMobile ? 'justify-center px-2' : ''} ${isActive
                    ? 'bg-orange-50 dark:bg-primary/20 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white group'
                  }`
                }
                title={collapsed && !isMobile ? item.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-icons-outlined ${!isActive ? 'group-hover:text-primary transition-colors' : ''}`}>
                      {item.icon}
                    </span>
                    {(!collapsed || isMobile) && item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* General Section */}
        <div className="mb-6">
          {(!collapsed || isMobile) && (
            <p className="px-4 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2">
              General
            </p>
          )}
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${collapsed && !isMobile ? 'justify-center px-2' : ''} ${isActive
                    ? 'bg-orange-50 dark:bg-primary/20 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white group'
                  }`
                }
                title={collapsed && !isMobile ? item.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-icons-outlined ${!isActive ? 'group-hover:text-primary transition-colors' : ''}`}>
                      {item.icon}
                    </span>
                    {(!collapsed || isMobile) && item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        {collapsed && !isMobile ? (
          <Button
            btnIcon
            mode="ghost"
            shape="rounded"
            title="Logout"
          >
            <span className="material-icons-outlined">logout</span>
          </Button>
        ) : (
          <Button
            fullWidth
            mode="ghost"
            shape="rounded"
            iconLeft={<span className="material-icons-outlined">logout</span>}
          >
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
