'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ServiceOption {
  id: number;
  optionId: number;
  optionName: string;
  name?: string;
  optionDescription: string;
  description?: string;
  optionType: string;
  type?: string;
  optionStatus: string;
  rate: number;
  defaultRate?: number;
  status?: string;
}

export default function ReservationStep3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useStore();
  
  const serviceId = searchParams.get('serviceId');
  const addressData = JSON.parse(searchParams.get('address') || '{}');
  const scheduleData = JSON.parse(searchParams.get('schedule') || '{}');
  
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch(`/api/services/${serviceId}/options`);
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setOptions(data.filter((opt: ServiceOption) => opt.status === 'ACTIVE'));
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    }
    if (serviceId) {
      fetchOptions();
    }
  }, [serviceId]);

  const toggleOption = (optionId: number) => {
    setSelectedOptionIds(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateOptionsTotal = () => {
    return selectedOptionIds.reduce((total, optionId) => {
      const option = options.find(o => o.id === optionId);
      return total + (option?.defaultRate || 0);
    }, 0);
  };

  const handleContinue = () => {
    const optionsData = {
      selectedOptionIds,
    };

    const params = new URLSearchParams({
      serviceId: serviceId || '',
      step: '4',
      address: JSON.stringify(addressData),
      schedule: JSON.stringify(scheduleData),
      options: JSON.stringify(optionsData),
    });
    router.push(`/reservation?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6eaad0]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
        : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, label: 'Adresse' },
              { num: 2, label: 'Fréquence' },
              { num: 3, label: 'Options' },
              { num: 4, label: 'Informations' }
            ].map((step) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step.num < 3
                    ? 'bg-[#6eaad0] text-white'
                    : step.num === 3
                      ? theme === 'dark' ? 'bg-white text-[#185d88]' : 'bg-[#6eaad0] text-white'
                      : theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.num < 3 ? '✓' : step.num}
                </div>
                {step.num < 4 && (
                  <div className={`w-16 h-1 ${
                    step.num < 3
                      ? 'bg-[#6eaad0]'
                      : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm max-w-2xl mx-auto">
            <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>Adresse</span>
            <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>Fréquence</span>
            <span className={theme === 'dark' ? 'text-white font-semibold' : 'text-[#185d88] font-semibold'}>Options</span>
            <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>Informations</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={`relative rounded-3xl p-8 shadow-2xl ${
          theme === 'dark'
            ? 'bg-white/10 backdrop-blur-xl border border-white/20'
            : 'bg-white/80 backdrop-blur-xl border border-white/60'
        }`}>
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Personnalisez votre service
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Sélectionnez les options qui correspondent à vos besoins
            </p>
          </div>

          {options.length === 0 ? (
            <div className={`p-12 rounded-2xl text-center ${
              theme === 'dark' ? 'bg-white/5' : 'bg-[#6eaad0]/10'
            }`}>
              <Plus className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
              <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Aucune option disponible pour ce service
              </p>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-[#b2d2e6]/70' : 'text-[#6d89a3]/70'}`}>
                Vous pouvez continuer vers l&apos;étape suivante
              </p>
            </div>
          ) : (
            <>
              {/* Options Grid */}
              <div className="space-y-4 mb-8">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className={`block p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedOptionIds.includes(option.id)
                        ? theme === 'dark'
                          ? 'bg-[#61c4f1]/20 border-[#61c4f1] shadow-lg'
                          : 'bg-[#6eaad0]/30 border-[#6eaad0] shadow-lg'
                        : theme === 'dark'
                          ? 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                          : 'bg-white/50 border-gray-200 hover:bg-white/70 hover:border-[#6eaad0]/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center h-6">
                        <input
                          type="checkbox"
                          checked={selectedOptionIds.includes(option.id)}
                          onChange={() => toggleOption(option.id)}
                          className="w-6 h-6 rounded-lg accent-[#6eaad0] cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-start gap-3">
                            {selectedOptionIds.includes(option.id) && (
                              <CheckCircle className={`w-6 h-6 flex-shrink-0 ${
                                theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
                              }`} />
                            )}
                            <div>
                              <h3 className={`text-xl font-bold mb-1 ${
                                theme === 'dark' ? 'text-white' : 'text-[#185d88]'
                              }`}>
                                {option.name}
                              </h3>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
                              }`}>
                                {option.description}
                              </p>
                              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                option.optionType === 'ADDON'
                                  ? theme === 'dark'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-blue-100 text-blue-700'
                                  : theme === 'dark'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-purple-100 text-purple-700'
                              }`}>
                                {option.type === 'ADDON' ? 'Supplément' : 'Formule'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-2xl font-bold ${
                              theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
                            }`}>
                              +{option?.defaultRate?.toFixed(0)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Summary */}
              {selectedOptionIds.length > 0 && (
                <div className={`p-6 rounded-2xl mb-8 ${
                  theme === 'dark' ? 'bg-[#185d88]/50' : 'bg-[#6eaad0]/10'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-semibold mb-1 ${
                        theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
                      }`}>
                        {selectedOptionIds.length} option{selectedOptionIds.length > 1 ? 's' : ''} sélectionnée{selectedOptionIds.length > 1 ? 's' : ''}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-[#b2d2e6]/70' : 'text-[#6d89a3]/70'
                      }`}>
                        Coût additionnel des options
                      </p>
                    </div>
                    <span className={`text-3xl font-bold ${
                      theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
                    }`}>
                      +{calculateOptionsTotal().toFixed(0)}€
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-300">
            <button
              onClick={() => router.back()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                theme === 'dark'
                  ? 'text-[#b2d2e6] hover:bg-white/10'
                  : 'text-[#6d89a3] hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleContinue}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl transform hover:scale-105"
            >
              <span>Continuer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}