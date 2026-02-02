import React from 'react';
import Button from '@/components/Button';

const StatsCard = ({ icon, iconBg, iconColor, trend, trendUp, label, value }) => (
  <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-icons-outlined">{icon}</span>
      </div>
      <span className={`text-xs font-medium ${trendUp ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'} py-1 px-2 rounded-lg flex items-center`}>
        <span className="material-icons-outlined text-xs mr-1">{trendUp ? 'trending_up' : 'trending_down'}</span>
        {trend}
      </span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
  </div>
);

const Dashboard = () => {
  const statsData = [
    {
      icon: 'people',
      iconBg: 'bg-orange-50 dark:bg-primary/10',
      iconColor: 'text-primary',
      trend: '12%',
      trendUp: true,
      label: 'Total Users',
      value: '2,543'
    },
    {
      icon: 'business',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '8%',
      trendUp: true,
      label: 'Active Employers',
      value: '142'
    },
    {
      icon: 'work',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: '15%',
      trendUp: true,
      label: 'Total Jobs',
      value: '1,286'
    },
    {
      icon: 'trending_up',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      trend: '24%',
      trendUp: true,
      label: 'Revenue',
      value: '$45.2K'
    }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Overview of system metrics and activities
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {/* Mobile: Icon only buttons */}
            <div className="flex gap-2 sm:hidden">
              <Button 
                btnIcon
                mode="secondary"
                shape="rounded"
                size="sm"
                className="bg-white dark:bg-gray-800"
                title="Filter"
              >
                <span className="material-icons-outlined text-base">filter_list</span>
              </Button>
              <Button 
                btnIcon
                mode="primary"
                shape="rounded"
                size="sm"
                title="Export Report"
              >
                <span className="material-icons-outlined text-base">download</span>
              </Button>
            </div>
            
            {/* Desktop: Buttons with text */}
            <div className="hidden sm:flex gap-3">
              <Button 
                mode="secondary"
                shape="rounded"
                size="sm"
                className="bg-white dark:bg-gray-800"
                iconLeft={<span className="material-icons-outlined text-base">filter_list</span>}
              >
                Filter
              </Button>
              <Button 
                mode="primary"
                shape="rounded"
                size="sm"
                iconLeft={<span className="material-icons-outlined text-base">download</span>}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Placeholder for more content */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
        <span className="material-icons-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
          analytics
        </span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          More Analytics Coming Soon
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Additional charts and reports will be added here
        </p>
      </div>
    </>
  );
};

export default Dashboard;
