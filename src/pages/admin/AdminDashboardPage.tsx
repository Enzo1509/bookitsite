import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, CalendarCheck, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        totalBusinesses: 156,
        totalUsers: 2489,
        totalBookings: 1876,
        monthlyGrowth: '12%',
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t.admin.dashboard.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.admin.dashboard.businesses}
          value={stats?.totalBusinesses.toString() || '0'}
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
          trend="+5% vs last month"
        />
        <StatCard
          title={t.admin.dashboard.users}
          value={stats?.totalUsers.toString() || '0'}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          trend="+12% vs last month"
        />
        <StatCard
          title={t.admin.dashboard.bookings}
          value={stats?.totalBookings.toString() || '0'}
          icon={<CalendarCheck className="h-6 w-6 text-blue-600" />}
          trend="+8% vs last month"
        />
        <StatCard
          title={t.admin.dashboard.revenue}
          value={`${stats?.monthlyGrowth || '0%'}`}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          trend={t.admin.dashboard.monthlyGrowth}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;