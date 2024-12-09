import React, { useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp, ChevronRight, Star, Building2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useBusinessStore } from '@/store/businessStore';
import { format, isToday, parseISO } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${
                trend.isPositive ? '' : 'transform rotate-180'
              }`} />
              {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AppointmentCard: React.FC<{
  time: string;
  customerName: string;
  serviceName: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  isNext?: boolean;
}> = ({ time, customerName, serviceName, duration, price, status, isNext }) => {
  const { t } = useTranslation();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`p-4 rounded-lg ${isNext ? 'bg-blue-50 border-blue-100' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className={`text-lg font-semibold ${isNext ? 'text-blue-600' : 'text-gray-900'}`}>
            {time}
          </span>
          {isNext && (
            <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
              {t.professional.dashboard.nextAppointment}
            </span>
          )}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {t.professional.bookings.status[status]}
        </span>
      </div>
      <p className="font-medium text-gray-900">{customerName}</p>
      <div className="flex items-center justify-between text-gray-500 text-sm mt-1">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{serviceName} • {duration} {t.common.duration}</span>
        </div>
        <span className="font-medium text-gray-900">{formatPrice(price)}</span>
      </div>
    </div>
  );
};

const ProfessionalDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, loadBusinessBookings } = useBookingStore();
  const { businesses } = useBusinessStore();
  const { t, currentLanguage } = useTranslation();
  
  const business = businesses.find(b => b.id === user?.businessId);
  const dateLocale = currentLanguage === 'fr' ? fr : enUS;

  useEffect(() => {
    if (user?.businessId) {
      loadBusinessBookings(user.businessId);
    }
  }, [user?.businessId, loadBusinessBookings]);

  const todayBookings = bookings.filter(
    booking => isToday(parseISO(booking.date))
  ).sort((a, b) => a.time.localeCompare(b.time));

  const nextBooking = todayBookings.find(booking => {
    const [hours, minutes] = booking.time.split(':').map(Number);
    const bookingTime = new Date();
    bookingTime.setHours(hours, minutes);
    return bookingTime > new Date() && booking.status !== 'cancelled';
  });

  const totalRevenue = todayBookings
    .filter(booking => booking.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.service.price, 0);

  const confirmedBookings = todayBookings.filter(b => b.status === 'confirmed').length;
  const attendanceRate = todayBookings.length > 0
    ? Math.round((confirmedBookings / todayBookings.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.professional.dashboard.title}</h1>
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-5 w-5" />
          <span>{format(new Date(), 'EEEE d MMMM yyyy', { locale: dateLocale })}</span>
        </div>
      </div>

      {business && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-gray-400" />
                <h2 className="text-xl font-bold">{business.name}</h2>
              </div>
              <p className="text-gray-500 mt-1">{business.address}, {business.city}</p>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-medium">{business.rating.toFixed(1)}</span>
              <span className="text-gray-400">({business.totalReviews})</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.professional.dashboard.todayAppointments}
          value={todayBookings.length}
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: '+12% vs. hier', isPositive: true }}
          color="blue"
        />
        <StatCard
          title={t.professional.dashboard.clients}
          value={todayBookings.length}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title={t.professional.dashboard.attendanceRate}
          value={`${attendanceRate}%`}
          icon={<Star className="h-6 w-6" />}
          trend={{ value: '+2% ce mois', isPositive: true }}
          color="purple"
        />
        <StatCard
          title={t.professional.dashboard.dailyRevenue}
          value={formatPrice(totalRevenue)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t.professional.dashboard.todayAppointments}</h2>
              <Link
                to="/pro/bookings"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
              >
                {t.professional.bookings.calendar}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {t.professional.dashboard.noAppointments}
                </p>
              ) : (
                todayBookings.map(booking => (
                  <AppointmentCard
                    key={booking.id}
                    time={booking.time}
                    customerName={booking.customerName}
                    serviceName={booking.service.name}
                    duration={booking.service.duration}
                    price={booking.service.price}
                    status={booking.status}
                    isNext={booking.id === nextBooking?.id}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold">{t.professional.dashboard.statistics}</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64 text-gray-500">
              {/* Placeholder pour le graphique */}
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>{t.professional.dashboard.statistics}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboardPage;