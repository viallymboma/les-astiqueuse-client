'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,  
  Clock, 
  Euro, 
  Info, 
  Plus, 
  Minus,
  Calendar,
  Star
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Service, ServiceWithIcon } from '@/types/service';
import { formatDuration, mapServiceWithIcon } from '@/lib/services';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useStore();
  const [service, setService] = useState<ServiceWithIcon | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [duration, setDuration] = useState(120); // Default 2 hours

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Service[] = await response.json();
        const found = data.find(s => s.id === Number(params.id));
        if (found) {
          setService(mapServiceWithIcon(found));
          setDuration(found.minDuration);
        }
      } catch (error) {
        console.error('Failed to fetch service:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  const toggleOption = (optionId: number) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotal = () => {
    if (!service) return 0;
    const hours = duration / 60;
    const baseRate = service.preferredRate || service.standardRate;
    const basePrice = baseRate * hours;
    const optionsPrice = selectedOptions.reduce((sum, optionId) => {
      const option = service.options.find(o => o.id === optionId);
      return sum + (option?.rate || 0);
    }, 0);
    return basePrice + optionsPrice;
  };

  const adjustDuration = (increment: number) => {
    if (!service) return;
    const newDuration = duration + increment;
    if (newDuration >= service.minDuration && newDuration <= service.maxDuration) {
      setDuration(newDuration);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className={`inline-block animate-spin rounded-full h-16 w-16 border-b-2 ${
          theme === 'dark' ? 'border-white' : 'border-[#185d88]'
        }`}></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
            Service non trouvé
          </h1>
          <Link href="/services" className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white'
              : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
          }`}>
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux services</span>
          </Link>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/services" className={`inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-[#b2d2e6] hover:bg-white/10'
            : 'text-[#6d89a3] hover:bg-white/50'
        }`}>
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux services</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className={`p-8 rounded-2xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-xl`}>
              <div className="flex items-start gap-6 mb-6">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                    : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                } shadow-lg`}>
                  <service.icon className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {service.name}
                  </h1>
                  <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-[#6eaad0]/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className={`w-5 h-5 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                      Tarif
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {(service.preferredRate || service.standardRate).toFixed(0)}€/h
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-[#6eaad0]/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                      Durée min
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {formatDuration(service.minDuration)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-[#6eaad0]/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={`w-5 h-5 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                      TVA
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {service.vatRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className={`p-8 rounded-2xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Choisir la durée
              </h2>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => adjustDuration(-service.durationIncrement)}
                  disabled={duration <= service.minDuration}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    duration <= service.minDuration
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-[#6eaad0]/20 hover:bg-[#6eaad0]/30 text-[#185d88]'
                  }`}
                >
                  <Minus className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <div className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {formatDuration(duration)}
                  </div>
                  <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    {formatDuration(service.minDuration)} - {formatDuration(service.maxDuration)}
                  </div>
                </div>

                <button
                  onClick={() => adjustDuration(service.durationIncrement)}
                  disabled={duration >= service.maxDuration}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    duration >= service.maxDuration
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-[#6eaad0]/20 hover:bg-[#6eaad0]/30 text-[#185d88]'
                  }`}
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Options */}
            {service.options.length > 0 && (
              <div className={`p-8 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                  : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
              } shadow-xl`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  Options disponibles
                </h2>
                <div className="space-y-4">
                  {service.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedOptions.includes(option.id)
                          ? theme === 'dark'
                            ? 'bg-[#61c4f1]/20 border-2 border-[#61c4f1]'
                            : 'bg-[#6eaad0]/30 border-2 border-[#6eaad0]'
                          : theme === 'dark'
                            ? 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                            : 'bg-white/30 border-2 border-transparent hover:bg-white/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => toggleOption(option.id)}
                        className="mt-1 w-5 h-5 rounded accent-[#61c4f1]"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                              {option.optionName}
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                              {option.optionDescription}
                            </p>
                          </div>
                          <span className={`text-xl font-bold whitespace-nowrap ${
                            theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
                          }`}>
                            +{option.rate.toFixed(0)}€
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#61c4f1]/10 border border-[#61c4f1]/30'
                : 'bg-[#6eaad0]/10 border border-[#6eaad0]/30'
            }`}>
              <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
                }`} />
                <div className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  <p className="font-semibold mb-1">À savoir :</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Les tarifs s&apos;entendent TTC</li>
                    <li>Annulation gratuite jusqu&apos;à 24h avant</li>
                    <li>Paiement sécurisé en ligne</li>
                    <li>Satisfaction garantie ou remboursé</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className={`sticky top-32 p-8 rounded-2xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Service de base
                  </span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {((service.preferredRate || service.standardRate) * (duration / 60)).toFixed(2)}€
                  </span>
                </div>

                {selectedOptions.length > 0 && (
                  <>
                    <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#6eaad0]/20'} pt-4`}>
                      <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                        Options sélectionnées :
                      </p>
                      {selectedOptions.map(optionId => {
                        const option = service.options.find(o => o.id === optionId);
                        return option ? (
                          <div key={option.id} className="flex justify-between items-center mb-2">
                            <span className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                              {option.optionName}
                            </span>
                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                              +{option.rate.toFixed(2)}€
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </>
                )}

                <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#6eaad0]/20'} pt-4`}>
                  <div className="flex justify-between items-center text-lg">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                      Total TTC
                    </span>
                    <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
                      {calculateTotal().toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className={`block w-full py-4 rounded-xl text-center font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                    : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
                } transform hover:scale-105 mb-3`}
              >
                <Calendar className="w-5 h-5" />
                <span>Réserver maintenant</span>
              </Link>

              <button
                onClick={() => router.push('/contact')}
                className={`block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-[#6eaad0]/20 text-[#307aa8] hover:bg-[#6eaad0]/30'
                }`}
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}