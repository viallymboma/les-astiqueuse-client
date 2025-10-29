"use client"
import { services } from "@/dummy/data";
import { useStore } from "@/store/useStore";
import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";

const DashboardPage = () => {
    const { theme, reservations, addReservation, updateReservation, deleteReservation, setUser } = useStore();
    const [showBooking, setShowBooking] = useState(false);
    const [bookingData, setBookingData] = useState({
      service: '',
      date: '',
      time: '',
      address: '',
      notes: ''
    }); 
  
    const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addReservation({ ...bookingData, status: 'En attente', userId: '1' });
      setBookingData({ service: '', date: '', time: '', address: '', notes: '' });
      setShowBooking(false);
      alert('Réservation créée avec succès!');
    };
  
    const handleLogout = () => {
      setUser(null);
      alert('Déconnexion réussie!');
    };
  
    return (
      <div className={`min-h-screen pt-32 pb-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Mon Espace Client
              </h1>
              <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Gérez vos réservations et services
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBooking(!showBooking)}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                    : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
                } transform hover:scale-105`}
              >
                <Calendar className="w-5 h-5" />
                <span>Nouvelle Réservation</span>
              </button>
              <button
                onClick={handleLogout}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-[#b2d2e6] hover:bg-white/20'
                    : 'bg-white/50 text-[#6d89a3] hover:bg-white/70'
                }`}
              >
                Déconnexion
              </button>
            </div>
          </div>
  
          {showBooking && (
            <div className={`mb-12 p-10 rounded-3xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-2xl`}>
              <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Nouvelle Réservation
              </h2>
              <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Service
                  </label>
                  <select
                    required
                    value={bookingData.service}
                    onChange={(e) => setBookingData({...bookingData, service: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                  >
                    <option value="">Sélectionner un service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Heure
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.address}
                    onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="123 Rue Example, Paris"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    rows={3}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="Informations supplémentaires..."
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                      : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
                  } transform hover:scale-105`}>
                    Confirmer la Réservation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBooking(false)}
                    className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 text-[#b2d2e6] hover:bg-white/20'
                        : 'bg-white/50 text-[#6d89a3] hover:bg-white/70'
                    }`}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
  
          <div>
            <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Mes Réservations
            </h2>
            {reservations.length === 0 ? (
              <div className={`p-16 rounded-3xl text-center ${
                theme === 'dark'
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                  : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
              } shadow-2xl`}>
                <Calendar className={`w-24 h-24 mx-auto mb-6 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'}`} />
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  Aucune réservation
                </h3>
                <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  Créez votre première réservation pour commencer
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className={`p-8 rounded-3xl ${
                    theme === 'dark'
                      ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                      : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
                  } shadow-2xl hover:scale-105 transition-all duration-500`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`px-4 py-2 rounded-xl font-semibold ${
                            reservation.status === 'En attente'
                              ? theme === 'dark' ? 'bg-[#61c4f1]/20 text-[#61c4f1]' : 'bg-[#6eaad0]/20 text-[#307aa8]'
                              : reservation.status === 'Confirmé'
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}>
                            {reservation.status}
                          </div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                            Créé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                          {reservation.service}
                        </h3>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                          <p className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(reservation.date).toLocaleDateString('fr-FR')} à {reservation.time}</span>
                          </p>
                          <p className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>{reservation.address}</span>
                          </p>
                          {reservation.notes && (
                            <p className="mt-3 italic">{reservation.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {reservation.status === 'En attente' && (
                          <button
                            onClick={() => updateReservation(reservation.id, { status: 'Confirmé' })}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                              theme === 'dark'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
                              deleteReservation(reservation.id);
                            }
                          }}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                              : 'bg-red-500/20 text-red-600 hover:bg-red-500/30'
                          }`}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default DashboardPage;