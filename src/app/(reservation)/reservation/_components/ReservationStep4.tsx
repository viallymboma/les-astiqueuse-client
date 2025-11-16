'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Building, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPhoneNumber, validateFrenchPhone } from '@/lib/utils';

type AccountType = 'INDIVIDUAL' | 'BUSINESS';

export default function ReservationStep4() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useStore();
  
  const serviceId = searchParams.get('serviceId');
  const addressData = JSON.parse(searchParams.get('address') || '{}');
  const scheduleData = JSON.parse(searchParams.get('schedule') || '{}');
  const optionsData = JSON.parse(searchParams.get('options') || '{}');
  
  const [accountType, setAccountType] = useState<AccountType>('INDIVIDUAL');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    siret: '',
    propertyType: 'APARTMENT',
    propertyName: '',
    surfaceArea: '',
    roomCount: '',
    floorCount: '',
    reference: '',
    contactName: '',
    contactPhone: '',
    digicode: '',
    etage: '',
    comment: '',
    notes: '',
    marketingEmailConsent: false,
    marketingSmsConsent: false,
  });
  const [googleAccount, setGoogleAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return false;
    if (accountType === 'BUSINESS' && !formData.siret) return false;
    return true;
  };

  const handleSubmit = async (useGoogle: boolean) => {
    if (!isFormValid()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');
    setGoogleAccount(useGoogle);

    const sanitize = (p: string) => p ? p.replace(/[\s\-\.]/g, '') : p;
    const sanitizedPhone = sanitize(formData.phone);
    const sanitizedContactPhone = sanitize(formData.contactPhone || formData.phone);

    try {
      const prospectData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: sanitizedPhone,
        phoneVerified: false,
        googleAccount: useGoogle,
        type: accountType,
        companyName: accountType === 'BUSINESS' ? formData.companyName : undefined,
        siret: accountType === 'BUSINESS' ? formData.siret : undefined,
        address: addressData.address,
        city: addressData.city,
        postalCode: addressData.postalCode,
        inseeCode: addressData.inseeCode,
        country: 'France',
        reservation: {
          serviceId: Number(serviceId),
          propertyData: {
            type: formData.propertyType,
            name: formData.propertyName || `Propriété ${accountType === 'BUSINESS' ? formData.companyName : formData.lastName}`,
            address: addressData.address,
            city: addressData.city,
            postalCode: addressData.postalCode,
            inseeCode: addressData.inseeCode,
            country: 'France',
            surfaceArea: formData.surfaceArea ? parseFloat(formData.surfaceArea) : undefined,
            floorCount: formData.floorCount ? parseInt(formData.floorCount) : undefined,
            reference: formData.reference || undefined,
            roomCount: formData.roomCount ? parseInt(formData.roomCount) : undefined,
            contactName: formData.contactName || `${formData.firstName} ${formData.lastName}`,
            contactPhone: sanitizedContactPhone,
            accessInstructions: {
              digicode: formData.digicode || undefined,
              etage: formData.etage || undefined,
            },
            comment: formData.comment || undefined,
          },
          interventionDate: scheduleData.interventionDate,
          startTime: scheduleData.startTime,
          duration: scheduleData.duration,
          frequency: scheduleData.frequency,
          days: scheduleData.days || [],
          recurrenceEndDate: scheduleData.recurrenceEndDate || undefined,
          selectedOptionIds: optionsData.selectedOptionIds || [],
          notes: formData.notes || undefined,
        },
        marketingEmailConsent: formData.marketingEmailConsent,
        marketingSmsConsent: formData.marketingSmsConsent,
        consentVersion: '1.0',
      };

      const apiResponse = await fetch('/api/prospects/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prospectData),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setResponse(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Success screen with Google OAuth URL
  if (response) {
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className={`rounded-3xl p-12 text-center shadow-2xl ${
            theme === 'dark' ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-white/80 backdrop-blur-xl'
          }`}>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Inscription réussie !
            </h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              {response.message}
            </p>

            {googleAccount && response.googleAuthUrl && (
              <div className={`p-6 rounded-2xl mb-6 ${
                theme === 'dark' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  Cliquez sur le bouton ci-dessous pour finaliser votre inscription avec Google
                </p>
                <a
                  href={response.googleAuthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Continuer avec Google</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}

            <div className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              <p className="mb-2">Numéro de réservation: <strong>{response.reservationId}</strong></p>
              <p>ID Client: <strong>{response.clientId}</strong></p>
            </div>

            <button
              onClick={() => router.push('/')}
              className={`mt-8 px-8 py-3 rounded-xl font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-[#185d88] hover:bg-gray-300'
              }`}
            >
              Retour à l&apos;accueil
            </button>
          </div>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step < 4 ? 'bg-[#6eaad0] text-white' : 'bg-white text-[#185d88]'
                }`}>
                  {step < 4 ? '✓' : step}
                </div>
                {step < 4 && <div className="w-16 h-1 bg-[#6eaad0]"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={`relative rounded-3xl p-8 shadow-2xl ${
          theme === 'dark' ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-white/80 backdrop-blur-xl border border-white/60'
        }`}>
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Vos informations
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Dernière étape pour finaliser votre réservation
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Account Type Selection */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Type de compte *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType('INDIVIDUAL')}
                className={`p-6 rounded-xl transition-all border-2 ${
                  accountType === 'INDIVIDUAL'
                    ? 'border-[#6eaad0] bg-[#6eaad0]/20'
                    : theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-gray-300 hover:border-[#6eaad0]/40'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-2 ${accountType === 'INDIVIDUAL' ? 'text-[#6eaad0]' : theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>Particulier</p>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('BUSINESS')}
                className={`p-6 rounded-xl transition-all border-2 ${
                  accountType === 'BUSINESS'
                    ? 'border-[#6eaad0] bg-[#6eaad0]/20'
                    : theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-gray-300 hover:border-[#6eaad0]/40'
                }`}
              >
                <Building className={`w-8 h-8 mx-auto mb-2 ${accountType === 'BUSINESS' ? 'text-[#6eaad0]' : theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>Entreprise</p>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
            </div>
            <div>
  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
    Téléphone *
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span className="text-2xl">🇫🇷</span>
    </div>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={(e) => {
        // keep raw while typing to avoid cursor/formatting issues
        setFormData(prev => ({ ...prev, phone: e.target.value }));
      }}
      onBlur={(e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
        if (formatted && !validateFrenchPhone(formatted)) {
          setError('Numéro de téléphone français invalide');
        } else {
          setError('');
        }
      }}
      placeholder="+33 6 12 34 56 78"
      className={`w-full pl-14 pr-4 py-3 rounded-xl ${
        theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
      } focus:outline-none focus:ring-2 focus:ring-[#6eaad0] ${
        formData.phone && !validateFrenchPhone(formData.phone) ? 'border-red-500' : ''
      }`}
    />
  </div>
  {formData.phone && !validateFrenchPhone(formData.phone) && (
    <p className="text-red-500 text-xs mt-1">
      Format valide: +33 6 12 34 56 78 ou 06 12 34 56 78
    </p>
  )}
</div>
          </div>

          {/* Business Fields */}
          {accountType === 'BUSINESS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl ${
                    theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                  } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  SIRET *
                </label>
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  placeholder="12345678901234"
                  className={`w-full px-4 py-3 rounded-xl ${
                    theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                  } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
                />
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="mb-6">
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Détails de la propriété (optionnel)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="surfaceArea"
                value={formData.surfaceArea}
                onChange={handleInputChange}
                placeholder="Surface (m²)"
                className={`px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
              <input
                type="number"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleInputChange}
                placeholder="Nombre de pièces"
                className={`px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
              <input
                type="text"
                name="digicode"
                value={formData.digicode}
                onChange={handleInputChange}
                placeholder="Digicode"
                className={`px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
                } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Notes supplémentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-300 text-[#185d88]'
              } focus:outline-none focus:ring-2 focus:ring-[#6eaad0]`}
              placeholder="Instructions particulières..."
            />
          </div>

          {/* Consents */}
          <div className="space-y-3 mb-8">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketingEmailConsent"
                checked={formData.marketingEmailConsent}
                onChange={handleInputChange}
                className="w-5 h-5 rounded mt-0.5"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                J&apos;accepte de recevoir des offres par email
              </span>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketingSmsConsent"
                checked={formData.marketingSmsConsent}
                onChange={handleInputChange}
                className="w-5 h-5 rounded mt-0.5"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                J&apos;accepte de recevoir des offres par SMS
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleSubmit(true)}
              disabled={!isFormValid() || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Finaliser avec Google</span>
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={!isFormValid() || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'En cours...' : 'Finaliser par email'}
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
              theme === 'dark' ? 'text-[#b2d2e6] hover:bg-white/10' : 'text-[#6d89a3] hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
}