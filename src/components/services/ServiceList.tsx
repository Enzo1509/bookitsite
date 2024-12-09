import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import type { Service } from '@/types/business';
import { formatPrice } from '@/lib/utils';
import Button from '../ui/Button';
import BookingModal from '../booking/BookingModal';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';

interface ServiceListProps {
  services: Service[];
  businessId: string;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, businessId }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration} {t.common.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold mb-2">{formatPrice(service.price)}</div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!isAuthenticated) {
                      // Trigger login modal here
                      return;
                    }
                    setSelectedService(service);
                  }}
                >
                  {t.common.book}
                </Button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {selectedService && (
        <BookingModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          businessId={businessId}
        />
      )}
    </>
  );
};

export default ServiceList;