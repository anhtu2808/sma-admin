import React from 'react';

const Header = ({ onMobileMenuClick }) => {
  return (
    <header className="bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between transition-colors duration-200">
      {/* Left Section - Mobile Menu + Search */}
      <div className="flex-1 flex items-center gap-2 sm:gap-4 max-w-xl">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-icons-outlined">menu</span>
        </button>
        
        <div className="relative flex-1">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
        {/* UI Kit Quick Access */}
        <a
          href="/ui-kit"
          className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
          title="UI Kit"
        >
          <span className="material-icons-outlined">palette</span>
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <span className="material-icons-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-800">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=FF6B2C&color=fff"
            alt="Admin User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
