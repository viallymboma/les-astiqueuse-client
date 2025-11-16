'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Search, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Bell } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface AddressSuggestion {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
    citycode: string;
    street: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface Commune {
  id: number;
  name: string;
  inseeCode: string;
  postalCode: string;
  department: string;
  region: string;
}

export default function ReservationStep1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useStore();
  
  const serviceId = searchParams.get('serviceId');
  
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [isValidCommune, setIsValidCommune] = useState<boolean | null>(null);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');

  // Fetch available communes
  useEffect(() => {
    async function fetchCommunes() {
      try {
        const response = await fetch('/api/communes');
        if (!response.ok) throw new Error('Failed to fetch communes');
        const data = await response.json();
        setCommunes(data);
      } catch (error) {
        console.error('Error fetching communes:', error);
      }
    }
    fetchCommunes();
  }, []);

  // Fetch address suggestions from French API
  useEffect(() => {
    if (addressQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(addressQuery)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [addressQuery]);

  const handleAddressSelect = (address: AddressSuggestion) => {
    setSelectedAddress(address);
    setAddressQuery(address.properties.label);
    setSuggestions([]);

    // Check if commune is valid
    const citycode = address.properties.citycode;
    const isValid = communes.some(commune => commune.inseeCode === citycode);
    setIsValidCommune(isValid);
    
    if (!isValid) {
      setShowNotifyForm(false);
    }
  };

  const handleNotifyMe = async () => {
    if (!notificationEmail || !selectedAddress) return;

    try {
      // Call prospect API for notification
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/prospects/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: notificationEmail,
          city: selectedAddress.properties.city,
          postalCode: selectedAddress.properties.postcode,
          inseeCode: selectedAddress.properties.citycode,
        }),
      });

      if (response.ok) {
        alert('Merci ! Nous vous notifierons dès que nous interviendrons dans votre zone.');
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting notification:', error);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress || !isValidCommune) return;

    const addressData = {
      address: selectedAddress.properties.name || selectedAddress.properties.street,
      city: selectedAddress.properties.city,
      postalCode: selectedAddress.properties.postcode,
      inseeCode: selectedAddress.properties.citycode,
    };

    // Navigate to step 2 with query params
    const params = new URLSearchParams({
      serviceId: serviceId || '',
      step: '2',
      address: JSON.stringify(addressData),
    });
    router.push(`/reservation?${params.toString()}`);
  };

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
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === 1
                    ? theme === 'dark' ? 'bg-white text-[#185d88]' : 'bg-[#6eaad0] text-white'
                    : theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    step < 1
                      ? theme === 'dark' ? 'bg-white' : 'bg-[#6eaad0]'
                      : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className={theme === 'dark' ? 'text-white font-semibold' : 'text-[#185d88] font-semibold'}>Adresse</span>
            <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>Fréquence</span>
            <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>Options</span>
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
              Où souhaitez-vous notre intervention ?
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Entrez votre adresse complète pour vérifier notre disponibilité
            </p>
          </div>

          {/* Address Search */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Adresse complète *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
              </div>
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Ex: 15 rue de Rivoli, 75004 Paris"
                className={`w-full pl-12 pr-6 py-4 rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                    : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
              />
              {loading && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6eaad0]"></div>
                </div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className={`mt-2 rounded-xl shadow-lg overflow-hidden ${
                theme === 'dark' ? 'bg-[#185d88] border border-white/20' : 'bg-white border border-[#6eaad0]/30'
              }`}>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddressSelect(suggestion)}
                    className={`w-full text-left px-4 py-3 flex items-start space-x-3 transition-colors ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#6eaad0]/10'
                    } border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-b-0`}
                  >
                    <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'}`} />
                    <span className={theme === 'dark' ? 'text-white' : 'text-[#185d88]'}>
                      {suggestion.properties.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Address Display */}
          {selectedAddress && (
            <div className={`mb-8 p-6 rounded-xl ${
              isValidCommune
                ? theme === 'dark' ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                : theme === 'dark' ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {isValidCommune ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold mb-2 ${
                    isValidCommune
                      ? theme === 'dark' ? 'text-green-200' : 'text-green-800'
                      : theme === 'dark' ? 'text-red-200' : 'text-red-800'
                  }`}>
                    {isValidCommune ? 'Zone couverte !' : 'Zone non couverte'}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    isValidCommune
                      ? theme === 'dark' ? 'text-green-300' : 'text-green-700'
                      : theme === 'dark' ? 'text-red-300' : 'text-red-700'
                  }`}>
                    {selectedAddress.properties.label}
                  </p>
                  {!isValidCommune && (
                    <>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                        Nous n&quot;intervenons pas encore dans votre commune. Souhaitez-vous être notifié(e) dès que nous y serons disponibles ?
                      </p>
                      
                      {!showNotifyForm ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowNotifyForm(true)}
                            className="px-6 py-2 rounded-lg bg-white text-red-700 font-semibold hover:bg-gray-100 transition-colors"
                          >
                            Oui, me notifier
                          </button>
                          <button
                            onClick={() => router.push('/')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                              theme === 'dark'
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Non merci
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="email"
                            value={notificationEmail}
                            onChange={(e) => setNotificationEmail(e.target.value)}
                            placeholder="Votre email"
                            className={`w-full px-4 py-3 rounded-lg ${
                              theme === 'dark'
                                ? 'bg-white/10 border border-white/20 text-white placeholder-white/50'
                                : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]`}
                          />
                          <button
                            onClick={handleNotifyMe}
                            disabled={!notificationEmail}
                            className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-white text-red-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Bell className="w-4 h-4" />
                            <span>M&quot;avertir</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
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
              disabled={!selectedAddress || !isValidCommune}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                selectedAddress && isValidCommune
                  ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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
