import React, { useState } from 'react';
import { MapPin, Star, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import ServiceModal from '@/components/services/ServiceModal';
import type { Service } from '@/types/business';
import { useTranslation } from '@/hooks/useTranslation';

const ProfessionalBusinessPage: React.FC = () => {
  const { user } = useAuthStore();
  const { businesses, updateBusiness } = useBusinessStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const { t } = useTranslation();
  
  const business = businesses.find(b => b.id === user?.businessId);

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {t.professional.business.noBusinessAssigned}
        </p>
      </div>
    );
  }

  const handleSaveService = async (service: Service) => {
    const updatedServices = selectedService
      ? business.services.map(s => s.id === selectedService.id ? service : s)
      : [...business.services, { ...service, id: crypto.randomUUID() }];

    await updateBusiness(business.id, {
      ...business,
      services: updatedServices,
    });

    setSelectedService(null);
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm(t.professional.business.deleteConfirm)) return;

    await updateBusiness(business.id, {
      ...business,
      services: business.services.filter(s => s.id !== serviceId),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t.professional.business.title}</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">{business.name}</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{business.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{business.totalReviews} {t.business.reviews}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{business.address}, {business.city}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{t.professional.business.services}</h3>
            <Button
              size="sm"
              onClick={() => {
                setSelectedService(null);
                setIsServiceModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.professional.business.addService}
            </Button>
          </div>

          <div className="space-y-4">
            {business.services.map(service => (
              <div
                key={service.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{service.duration} {t.common.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">{formatPrice(service.price)}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsServiceModalOpen(true);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {business.services.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                {t.professional.business.noServices}
              </p>
            )}
          </div>
        </div>
      </div>

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setSelectedService(null);
          setIsServiceModalOpen(false);
        }}
        onSave={handleSaveService}
        service={selectedService}
      />
    </div>
  );
};

export default ProfessionalBusinessPage;