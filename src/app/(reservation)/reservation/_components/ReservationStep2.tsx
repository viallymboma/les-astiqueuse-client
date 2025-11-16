'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useStore } from '@/store/useStore';

type Frequency = 'ONE_TIME' | 'WEEKLY' | 'MONTHLY';

const WEEKDAYS = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' },
  { value: 'SATURDAY', label: 'Samedi' },
  { value: 'SUNDAY', label: 'Dimanche' },
];

export default function ReservationStep2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useStore();
  
  const serviceId = searchParams.get('serviceId');
  const addressData = JSON.parse(searchParams.get('address') || '{}');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [service, setService] = useState<any>(null);
  const [frequency, setFrequency] = useState<Frequency>('ONE_TIME');
  const [interventionDate, setInterventionDate] = useState('');
  const [duration, setDuration] = useState(120);
  const [startTime, setStartTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  // Fetch service details
  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const foundService = data.find((s: any) => s.id === Number(serviceId));
        setService(foundService);
        if (foundService) {
          setDuration(foundService.minDuration);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    }
    fetchService();
  }, [serviceId]);

  const handleDurationChange = (increment: number) => {
    if (!service) return;
    const newDuration = duration + increment;
    if (newDuration >= service.minDuration && newDuration <= service.maxDuration) {
      setDuration(newDuration);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  const calculatePrice = () => {
    if (!service) return 0;
    const rate = service.preferredRate || service.standardRate;
    return (rate * duration) / 60;
  };

  const isValidStep = () => {
    if (!interventionDate || !startTime) return false;
    if (frequency === 'WEEKLY' && selectedDays.length === 0) return false;
    if (frequency === 'MONTHLY' && selectedDays.length === 0) return false;
    if ((frequency === 'WEEKLY' || frequency === 'MONTHLY') && !recurrenceEndDate) return false;
    return true;
  };

  const handleContinue = () => {
    if (!isValidStep()) return;

    const scheduleData = {
      frequency,
      interventionDate,
      startTime,
      duration,
      days: selectedDays,
      recurrenceEndDate: frequency !== 'ONE_TIME' ? recurrenceEndDate : undefined,
    };

    const params = new URLSearchParams({
      serviceId: serviceId || '',
      step: '3',
      address: JSON.stringify(addressData),
      schedule: JSON.stringify(scheduleData),
    });
    router.push(`/reservation?${params.toString()}`);
  };

  if (!service) {
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
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step <= 2
                    ? theme === 'dark' ? 'bg-white text-[#185d88]' : 'bg-[#6eaad0] text-white'
                    : theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step < 2 ? '✓' : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    step < 2
                      ? theme === 'dark' ? 'bg-white' : 'bg-[#6eaad0]'
                      : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
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
              Planifiez votre intervention
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Choisissez la fréquence et la durée de votre service
            </p>
          </div>

          {/* Frequency Selection */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Fréquence *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'ONE_TIME', label: 'Ponctuel', desc: 'Une seule intervention' },
                { value: 'WEEKLY', label: 'Hebdomadaire', desc: 'Toutes les semaines' },
                { value: 'MONTHLY', label: 'Mensuel', desc: 'Tous les mois' },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setFrequency(freq.value as Frequency)}
                  className={`p-6 rounded-xl transition-all duration-300 border-2 ${
                    frequency === freq.value
                      ? theme === 'dark'
                        ? 'border-[#61c4f1] bg-[#61c4f1]/20'
                        : 'border-[#6eaad0] bg-[#6eaad0]/20'
                      : theme === 'dark'
                        ? 'border-white/20 hover:border-white/40'
                        : 'border-gray-300 hover:border-[#6eaad0]/40'
                  }`}
                >
                  <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {freq.label}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    {freq.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                {frequency === 'ONE_TIME' ? 'Date d\'intervention *' : 'Date de début *'}
              </label>
              <div className="relative">
                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
                <input
                  type="date"
                  value={interventionDate}
                  onChange={(e) => setInterventionDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-12 pr-6 py-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
                  } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Heure souhaitée *
              </label>
              <div className="relative">
                <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full pl-12 pr-6 py-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
                  } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
                />
              </div>
            </div>
          </div>

          {/* Days Selection for Weekly/Monthly */}
          {frequency === 'WEEKLY' && (
            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Jours de la semaine *
              </label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`p-3 rounded-xl font-semibold transition-all ${
                      selectedDays.includes(day.value)
                        ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
                        : theme === 'dark'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-200 text-[#185d88] hover:bg-gray-300'
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === 'MONTHLY' && (
            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Jours du mois *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day.toString())}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      selectedDays.includes(day.toString())
                        ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
                        : theme === 'dark'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-200 text-[#185d88] hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recurrence End Date */}
          {frequency !== 'ONE_TIME' && (
            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Date de fin de récurrence *
              </label>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                min={interventionDate || new Date().toISOString().split('T')[0]}
                className={`w-full px-6 py-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
                } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
              />
            </div>
          )}

          {/* Duration Selector */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Durée d&apos;intervention *
            </label>
            <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-[#6eaad0]/10 to-[#61c4f1]/10 border border-[#6eaad0]/30">
              <button
                onClick={() => handleDurationChange(-service.durationIncrement)}
                disabled={duration <= service.minDuration}
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  duration <= service.minDuration
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#6eaad0] text-white hover:bg-[#61c4f1]'
                } transition-colors`}
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <p className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  {formatDuration(duration)}
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  {formatDuration(service.minDuration)} - {formatDuration(service.maxDuration)}
                </p>
              </div>

              <button
                onClick={() => handleDurationChange(service.durationIncrement)}
                disabled={duration >= service.maxDuration}
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  duration >= service.maxDuration
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#6eaad0] text-white hover:bg-[#61c4f1]'
                } transition-colors`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Preview */}
          <div className={`p-6 rounded-xl mb-8 ${
            theme === 'dark' ? 'bg-[#185d88]/50' : 'bg-[#6eaad0]/10'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Prix estimé:
              </span>
              <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
                {calculatePrice().toFixed(2)}€
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-300">
            <button
              onClick={() => router.back()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                theme === 'dark' ? 'text-[#b2d2e6] hover:bg-white/10' : 'text-[#6d89a3] hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleContinue}
              disabled={!isValidStep()}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                isValidStep()
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

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Calendar, Clock, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
// import { useStore } from '@/store/useStore';

// type Frequency = 'ONE_TIME' | 'WEEKLY' | 'MONTHLY';

// const WEEKDAYS = [
//   { value: 'MONDAY', label: 'Lundi' },
//   { value: 'TUESDAY', label: 'Mardi' },
//   { value: 'WEDNESDAY', label: 'Mercredi' },
//   { value: 'THURSDAY', label: 'Jeudi' },
//   { value: 'FRIDAY', label: 'Vendredi' },
//   { value: 'SATURDAY', label: 'Samedi' },
//   { value: 'SUNDAY', label: 'Dimanche' },
// ];

// export default function ReservationStep2() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { theme } = useStore();
  
//   const serviceId = searchParams.get('serviceId');
//   const addressData = JSON.parse(searchParams.get('address') || '{}');
  
//   const [service, setService] = useState<any>(null);
//   const [frequency, setFrequency] = useState<Frequency>('ONE_TIME');
//   const [interventionDate, setInterventionDate] = useState('');
//   const [duration, setDuration] = useState(120);
//   const [startTime, setStartTime] = useState('09:00');
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);
//   const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

//   // Fetch service details
//   useEffect(() => {
//     async function fetchService() {
//       try {
//         const response = await fetch('/api/services');
//         const data = await response.json();
//         const foundService = data.find((s: any) => s.id === Number(serviceId));
//         setService(foundService);
//         if (foundService) {
//           setDuration(foundService.minDuration);
//         }
//       } catch (error) {
//         console.error('Error fetching service:', error);
//       }
//     }
//     fetchService();
//   }, [serviceId]);

//   const handleDurationChange = (increment: number) => {
//     if (!service) return;
//     const newDuration = duration + increment;
//     if (newDuration >= service.minDuration && newDuration <= service.maxDuration) {
//       setDuration(newDuration);
//     }
//   };

//   const toggleDay = (day: string) => {
//     setSelectedDays(prev =>
//       prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
//     );
//   };

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
//   };

//   const calculatePrice = () => {
//     if (!service) return 0;
//     const rate = service.preferredRate || service.standardRate;
//     return (rate * duration) / 60;
//   };

//   const isValidStep = () => {
//     if (!interventionDate || !startTime) return false;
//     if (frequency === 'WEEKLY' && selectedDays.length === 0) return false;
//     if (frequency === 'MONTHLY' && selectedDays.length === 0) return false;
//     if ((frequency === 'WEEKLY' || frequency === 'MONTHLY') && !recurrenceEndDate) return false;
//     return true;
//   };

//   const handleContinue = () => {
//     if (!isValidStep()) return;

//     const scheduleData = {
//       frequency,
//       interventionDate,
//       startTime,
//       duration,
//       days: selectedDays,
//       recurrenceEndDate: frequency !== 'ONE_TIME' ? recurrenceEndDate : undefined,
//     };

//     const params = new URLSearchParams({
//       serviceId: serviceId || '',
//       step: '3',
//       address: JSON.stringify(addressData),
//       schedule: JSON.stringify(scheduleData),
//     });
//     router.push(`/reservation?${params.toString()}`);
//   };

//   if (!service) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6eaad0]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen pt-32 pb-20 ${
//       theme === 'dark' 
//         ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
//         : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
//     }`}>
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Progress Stepper */}
//         <div className="mb-12">
//           <div className="flex items-center justify-center space-x-4">
//             {[1, 2, 3, 4].map((step) => (
//               <div key={step} className="flex items-center">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                   step <= 2
//                     ? theme === 'dark' ? 'bg-white text-[#185d88]' : 'bg-[#6eaad0] text-white'
//                     : theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'
//                 }`}>
//                   {step < 2 ? '✓' : step}
//                 </div>
//                 {step < 4 && (
//                   <div className={`w-16 h-1 ${
//                     step < 2
//                       ? theme === 'dark' ? 'bg-white' : 'bg-[#6eaad0]'
//                       : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
//                   }`}></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className={`relative rounded-3xl p-8 shadow-2xl ${
//           theme === 'dark'
//             ? 'bg-white/10 backdrop-blur-xl border border-white/20'
//             : 'bg-white/80 backdrop-blur-xl border border-white/60'
//         }`}>
//           <div className="mb-8">
//             <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//               Planifiez votre intervention
//             </h1>
//             <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//               Choisissez la fréquence et la durée de votre service
//             </p>
//           </div>

//           {/* Frequency Selection */}
//           <div className="mb-8">
//             <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//               Fréquence *
//             </label>
//             <div className="grid grid-cols-3 gap-4">
//               {[
//                 { value: 'ONE_TIME', label: 'Ponctuel', desc: 'Une seule intervention' },
//                 { value: 'WEEKLY', label: 'Hebdomadaire', desc: 'Toutes les semaines' },
//                 { value: 'MONTHLY', label: 'Mensuel', desc: 'Tous les mois' },
//               ].map((freq) => (
//                 <button
//                   key={freq.value}
//                   onClick={() => setFrequency(freq.value as Frequency)}
//                   className={`p-6 rounded-xl transition-all duration-300 border-2 ${
//                     frequency === freq.value
//                       ? theme === 'dark'
//                         ? 'border-[#61c4f1] bg-[#61c4f1]/20'
//                         : 'border-[#6eaad0] bg-[#6eaad0]/20'
//                       : theme === 'dark'
//                         ? 'border-white/20 hover:border-white/40'
//                         : 'border-gray-300 hover:border-[#6eaad0]/40'
//                   }`}
//                 >
//                   <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                     {freq.label}
//                   </p>
//                   <p className={`text-xs ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                     {freq.desc}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Date Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div>
//               <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 {frequency === 'ONE_TIME' ? 'Date d\'intervention *' : 'Date de début *'}
//               </label>
//               <div className="relative">
//                 <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
//                 <input
//                   type="date"
//                   value={interventionDate}
//                   onChange={(e) => setInterventionDate(e.target.value)}
//                   min={new Date().toISOString().split('T')[0]}
//                   className={`w-full pl-12 pr-6 py-4 rounded-xl ${
//                     theme === 'dark'
//                       ? 'bg-white/10 border border-white/20 text-white'
//                       : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
//                   } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Heure souhaitée *
//               </label>
//               <div className="relative">
//                 <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`} />
//                 <input
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                   className={`w-full pl-12 pr-6 py-4 rounded-xl ${
//                     theme === 'dark'
//                       ? 'bg-white/10 border border-white/20 text-white'
//                       : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
//                   } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Days Selection for Weekly/Monthly */}
//           {frequency === 'WEEKLY' && (
//             <div className="mb-8">
//               <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Jours de la semaine *
//               </label>
//               <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
//                 {WEEKDAYS.map((day) => (
//                   <button
//                     key={day.value}
//                     onClick={() => toggleDay(day.value)}
//                     className={`p-3 rounded-xl font-semibold transition-all ${
//                       selectedDays.includes(day.value)
//                         ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
//                         : theme === 'dark'
//                           ? 'bg-white/10 text-white hover:bg-white/20'
//                           : 'bg-gray-200 text-[#185d88] hover:bg-gray-300'
//                     }`}
//                   >
//                     {day.label.slice(0, 3)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {frequency === 'MONTHLY' && (
//             <div className="mb-8">
//               <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Jours du mois *
//               </label>
//               <div className="grid grid-cols-7 gap-2">
//                 {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                   <button
//                     key={day}
//                     onClick={() => toggleDay(day.toString())}
//                     className={`p-3 rounded-lg font-semibold transition-all ${
//                       selectedDays.includes(day.toString())
//                         ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
//                         : theme === 'dark'
//                           ? 'bg-white/10 text-white hover:bg-white/20'
//                           : 'bg-gray-200 text-[#185d88] hover:bg-gray-300'
//                     }`}
//                   >
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Recurrence End Date */}
//           {frequency !== 'ONE_TIME' && (
//             <div className="mb-8">
//               <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Date de fin de récurrence *
//               </label>
//               <input
//                 type="date"
//                 value={recurrenceEndDate}
//                 onChange={(e) => setRecurrenceEndDate(e.target.value)}
//                 min={interventionDate || new Date().toISOString().split('T')[0]}
//                 className={`w-full px-6 py-4 rounded-xl ${
//                   theme === 'dark'
//                     ? 'bg-white/10 border border-white/20 text-white'
//                     : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88]'
//                 } focus:outline-none focus:ring-4 focus:ring-[#61c4f1]/20`}
//               />
//             </div>
//           )}

//           {/* Duration Selector */}
//           <div className="mb-8">
//             <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//               Durée d'intervention *
//             </label>
//             <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-[#6eaad0]/10 to-[#61c4f1]/10 border border-[#6eaad0]/30">
//               <button
//                 onClick={() => handleDurationChange(-service.durationIncrement)}
//                 disabled={duration <= service.minDuration}
//                 className={`w-12 h-12 rounded-lg flex items-center justify-center ${
//                   duration <= service.minDuration
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-[#6eaad0] text-white hover:bg-[#61c4f1]'
//                 } transition-colors`}
//               >
//                 <Minus className="w-5 h-5" />
//               </button>
              
//               <div className="text-center">
//                 <p className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                   {formatDuration(duration)}
//                 </p>
//                 <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                   {formatDuration(service.minDuration)} - {formatDuration(service.maxDuration)}
//                 </p>
//               </div>

//               <button
//                 onClick={() => handleDurationChange(service.durationIncrement)}
//                 disabled={duration >= service.maxDuration}
//                 className={`w-12 h-12 rounded-lg flex items-center justify-center ${
//                   duration >= service.maxDuration
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-[#6eaad0] text-white hover:bg-[#61c4f1]'
//                 } transition-colors`}
//               >
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Price Preview */}
//           <div className={`p-6 rounded-xl mb-8 ${
//             theme === 'dark' ? 'bg-[#185d88]/50' : 'bg-[#6eaad0]/10'
//           }`}>
//             <div className="flex justify-between items-center">
//               <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                 Prix estimé:
//               </span>
//               <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
//                 {calculatePrice().toFixed(2)}€
//               </span>
//             </div>
//           </div>

//           {/* Navigation */}
//           <div className="flex justify-between pt-6 border-t border-gray-300">
//             <button
//               onClick={() => router.back()}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
//                 theme === 'dark' ? 'text-[#b2d2e6] hover:bg-white/10' : 'text-[#6d89a3] hover:bg-gray-100'
//               }`}
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Retour</span>
//             </button>

//             <button
//               onClick={handleContinue}
//               disabled={!isValidStep()}
//               className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
//                 isValidStep()
//                   ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl transform hover:scale-105'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <span>Continuer</span>
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }