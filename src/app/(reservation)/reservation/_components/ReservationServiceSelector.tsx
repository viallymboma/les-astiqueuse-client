'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Service, ServiceWithIcon } from '@/types/service';
import { formatPrice, formatDuration, mapServiceWithIcon } from '@/lib/services';

export default function ReservationServiceSelector() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const { theme } = useStore();
  
  const [services, setServices] = useState<ServiceWithIcon[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedService, setSelectedService] = useState<ServiceWithIcon | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Service[] = await response.json();
        const servicesWithIcons = data
          .filter(s => s.status === 'ACTIVE' && s.code !== 'TEST')
          .map(mapServiceWithIcon);
        setServices(servicesWithIcons);
        setFilteredServices(servicesWithIcons);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const handleServiceSelect = (service: ServiceWithIcon) => {
    // Navigate to step 1 with selected service
    const params = new URLSearchParams({
      serviceId: service.id.toString(),
      step: '1',
    });
    router.push(`/reservation/demarrer?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-16 w-16 border-b-2 ${
            theme === 'dark' ? 'border-white' : 'border-[#185d88]'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
        : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
            Sélectionnez votre service
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
            Choisissez le service qui correspond à vos besoins
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className={`w-6 h-6 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un service..."
              className={`w-full pl-16 pr-6 py-6 text-lg rounded-2xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                  : 'bg-white/70 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
              } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20 shadow-xl`}
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Aucun service trouvé pour {`${searchQuery}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`group cursor-pointer p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15'
                    : 'bg-white/70 backdrop-blur-xl border border-[#6eaad0]/30 hover:bg-white/90'
                } shadow-xl hover:shadow-2xl`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                    : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                } shadow-md transform group-hover:rotate-6 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  {service.name}
                </h3>

                <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  {service.description}
                </p>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
                    {formatPrice(service.standardRate, service.preferredRate)}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]/70' : 'text-[#6d89a3]/70'}`}>
                    / heure
                  </span>
                </div>

                <div className={`flex items-center gap-2 text-sm mb-6 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDuration(service.minDuration)} - {formatDuration(service.maxDuration)}
                  </span>
                </div>

                {service.options.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {service.options.slice(0, 2).map((option) => (
                      <div key={option.id} className={`flex items-start space-x-2 text-xs ${
                        theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
                      }`}>
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
                        }`} />
                        <span>{option.optionName}</span>
                      </div>
                    ))}
                    {service.options.length > 2 && (
                      <p className={`text-xs ${theme === 'dark' ? 'text-[#b2d2e6]/70' : 'text-[#6d89a3]/70'}`}>
                        +{service.options.length - 2} autre{service.options.length - 2 > 1 ? 's' : ''} option{service.options.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}

                <div className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-white group-hover:bg-white/20'
                    : 'bg-[#6eaad0]/20 text-[#307aa8] group-hover:bg-[#6eaad0]/30'
                }`}>
                  <span>Choisir ce service</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}