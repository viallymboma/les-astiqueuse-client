import { getUserFromLocalStorage } from '@/lib/get-user';
import { useClientStore } from '@/store/useClientStore';
import { AlertCircle, ArrowRight, Building2, Calendar, Camera, CheckCircle, Clock, CreditCard, Download, Edit2, Eye, Home, LogOut, MapPin, Menu, Phone, Plus, Receipt, Trash2, User, X } from 'lucide-react';
import React, { useState } from 'react'

const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const store = useClientStore();
  const user = getUserFromLocalStorage();
  console.log('User from localStorage:', user);

  const navigation = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'bookings', label: 'Réservations', icon: Calendar },
    { id: 'properties', label: 'Propriétés', icon: Building2 },
    { id: 'payments', label: 'Paiements', icon: Receipt },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStatusBadge = (status: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styles: any = {
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      PAID: 'bg-green-100 text-green-800'
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labels: any = {
      CONFIRMED: 'Confirmé',
      PENDING: 'En attente',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
      PAID: 'Payé'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const nextBooking = store.bookings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((b: any) => b.status === 'CONFIRMED' && new Date(b.interventionDate) >= new Date())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => new Date(a.interventionDate).getTime() - new Date(b.interventionDate).getTime())[0];

  return (
        <div className="min-h-screen bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]">
      {/* Mobile Header */}
      <div className="lg:hidden z-[900] fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-[#6eaad0]/20 z-40">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#6eaad0]/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#185d88]" />
          </button>
          <h1 className="text-lg font-bold text-[#185d88]">LesAstiqueuses</h1>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] flex items-center justify-center text-white text-sm font-bold">
            {store.user.firstName[0]}{store.user.lastName[0]}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white/90 backdrop-blur-xl border-r border-[#6eaad0]/20 z-50
        transition-transform duration-300 w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#6eaad0]/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#185d88]">LesAstiqueuses</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[#6eaad0]/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#185d88]" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] flex items-center justify-center text-white font-bold">
              {store.user.firstName[0]}{store.user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#185d88] truncate text-sm">
                {store.user.firstName} {store.user.lastName}
              </p>
              <p className="text-xs text-[#6d89a3] truncate">{store.user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-lg'
                  : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6eaad0]/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-[8rem] pb-24 lg:pb-8 px-4 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#185d88] mb-1">
            Bienvenue, {store.user.firstName} !
          </h1>
          <p className="text-sm lg:text-base text-[#6d89a3]">
            Gérez vos réservations et vos propriétés
          </p>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 lg:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {[
                { label: 'Réservations actives', value: store.bookings.filter(b => b.status === 'CONFIRMED').length, icon: Calendar, color: 'from-blue-400 to-blue-600' },
                { label: 'Propriétés', value: store.properties.length, icon: Building2, color: 'from-purple-400 to-purple-600' },
                { label: 'Dépenses mois', value: `${store.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(0)}€`, icon: Receipt, color: 'from-green-400 to-green-600' },
                { label: 'Terminés', value: store.bookings.filter(b => b.status === 'COMPLETED').length, icon: CheckCircle, color: 'from-orange-400 to-orange-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-[#6eaad0]/30 shadow-lg">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 lg:mb-4`}>
                    <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <p className="text-xl lg:text-3xl font-bold text-[#185d88] mb-1">{stat.value}</p>
                  <p className="text-xs lg:text-sm text-[#6d89a3]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Next Appointment */}
            {nextBooking && (
              <div className="bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white shadow-xl">
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <div>
                    <p className="text-white/80 text-xs lg:text-sm mb-2">Prochaine intervention</p>
                    <h2 className="text-xl lg:text-3xl font-bold">{nextBooking.serviceName}</h2>
                  </div>
                  {getStatusBadge(nextBooking.status)}
                </div>
                <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                    <div>
                      <p className="text-white/80 text-xs">Date</p>
                      <p className="font-semibold text-sm lg:text-base">{formatDate(nextBooking.interventionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                    <div>
                      <p className="text-white/80 text-xs">Heure</p>
                      <p className="font-semibold text-sm lg:text-base">{nextBooking.startTime} ({nextBooking.duration} min)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                    <div>
                      <p className="text-white/80 text-xs">Propriété</p>
                      <p className="font-semibold text-sm lg:text-base">{nextBooking.propertyName}</p>
                    </div>
                  </div>
                </div>
                <button className="w-full lg:w-auto bg-white text-[#6eaad0] px-6 py-3 rounded-lg lg:rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-sm lg:text-base">
                  Voir les détails
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-4 lg:mb-6">Activité récente</h3>
              <div className="space-y-3 lg:space-y-4">
                {store.bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#185d88] text-sm lg:text-base truncate">{booking.serviceName}</p>
                        <p className="text-xs lg:text-sm text-[#6d89a3] truncate">{formatDate(booking.interventionDate)} • {booking.startTime}</p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 lg:mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#185d88]">Mes réservations</h2>
              <button className="bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white px-4 lg:px-6 py-3 rounded-lg lg:rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm lg:text-base">
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                Nouvelle réservation
              </button>
            </div>

            {store.bookings.map((booking) => (
              <div key={booking.id} className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
                <div className="flex justify-between items-start mb-4 lg:mb-6">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-1 lg:mb-2">{booking.serviceName}</h3>
                    <p className="text-sm lg:text-base text-[#6d89a3] truncate">{booking.propertyName}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#6d89a3]">Date</p>
                      <p className="font-semibold text-[#185d88] text-xs lg:text-sm truncate">{formatDate(booking.interventionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#6d89a3]">Heure</p>
                      <p className="font-semibold text-[#185d88] text-xs lg:text-sm">{booking.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#6d89a3]">Durée</p>
                      <p className="font-semibold text-[#185d88] text-xs lg:text-sm">{booking.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#6d89a3]">Montant</p>
                      <p className="font-semibold text-[#185d88] text-xs lg:text-sm">{booking.totalAmount.toFixed(2)}€</p>
                    </div>
                  </div>
                </div>

                {booking.options.length > 0 && (
                  <div className="mb-4 lg:mb-6">
                    <p className="text-xs lg:text-sm font-semibold text-[#185d88] mb-2">Options sélectionnées :</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.options.map((opt, i) => (
                        <span key={i} className="px-2 lg:px-3 py-1 bg-[#6eaad0]/20 text-[#307aa8] rounded-full text-xs font-medium">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-[#6eaad0]/10 rounded-lg lg:rounded-xl">
                    <p className="text-xs lg:text-sm font-semibold text-[#185d88] mb-1">Notes :</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">{booking.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 lg:gap-3">
                  <button className="flex-1 py-2 lg:py-3 bg-white/60 text-[#307aa8] rounded-lg lg:rounded-xl font-semibold hover:bg-white/80 transition-all flex items-center justify-center gap-2 text-sm lg:text-base">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Détails</span>
                  </button>
                  {booking.status === 'CONFIRMED' && (
                    <button className="flex-1 py-2 lg:py-3 bg-white/60 text-[#307aa8] rounded-lg lg:rounded-xl font-semibold hover:bg-white/80 transition-all flex items-center justify-center gap-2 text-sm lg:text-base">
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Properties View */}
        {activeTab === 'properties' && (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 lg:mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#185d88]">Mes propriétés</h2>
              <button 
                onClick={() => setShowPropertyModal(true)}
                className="bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white px-4 lg:px-6 py-3 rounded-lg lg:rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                Ajouter une propriété
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {store.properties.map((property) => (
                <div key={property.id} className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
                  <div className="flex justify-between items-start mb-4 lg:mb-6">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-2 truncate">{property.name}</h3>
                      <span className="inline-block px-2 lg:px-3 py-1 bg-[#6eaad0]/20 text-[#307aa8] rounded-full text-xs font-medium">
                        {property.type === 'APARTMENT' ? 'Appartement' : 'Maison'}
                      </span>
                    </div>
                    {property.isDefault && (
                      <span className="ml-2 px-2 lg:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold whitespace-nowrap">
                        Défaut
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4 lg:mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#185d88] text-sm lg:text-base">{property.address}</p>
                        <p className="text-xs lg:text-sm text-[#6d89a3]">{property.postalCode} {property.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0]" />
                        <span className="text-xs lg:text-sm text-[#6d89a3]">{property.surfaceArea} m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0]" />
                        <span className="text-xs lg:text-sm text-[#6d89a3]">{property.roomCount} pièces</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-[#6eaad0] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#185d88] text-sm lg:text-base truncate">{property.contactName}</p>
                        <p className="text-xs lg:text-sm text-[#6d89a3]">{property.contactPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:gap-3">
                    <button className="flex-1 py-2 lg:py-3 bg-white/60 text-[#307aa8] rounded-lg lg:rounded-xl font-semibold hover:bg-white/80 transition-all flex items-center justify-center gap-2 text-sm lg:text-base">
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button className="py-2 lg:py-3 px-3 lg:px-4 bg-red-100 text-red-600 rounded-lg lg:rounded-xl font-semibold hover:bg-red-200 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments View */}
        {activeTab === 'payments' && (
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#185d88] mb-4 lg:mb-6">Paiements et factures</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
              {[
                { label: 'Total payé', value: `${store.transactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}€`, color: 'from-green-400 to-green-600' },
                { label: 'En attente', value: `${store.transactions.filter(t => t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}€`, color: 'from-yellow-400 to-yellow-600' },
                { label: 'Transactions', value: store.transactions.length, color: 'from-blue-400 to-blue-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-[#6eaad0]/30 shadow-lg">
                  <p className="text-[#6d89a3] mb-2 text-sm lg:text-base">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-[#185d88]">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Transactions List */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-4 lg:mb-6">Historique des transactions</h3>
              <div className="space-y-3 lg:space-y-4">
                {store.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 lg:p-6 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 hover:bg-white/60 transition-all gap-3">
                    <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 ${
                        transaction.status === 'PAID' 
                          ? 'bg-gradient-to-br from-green-400 to-green-600' 
                          : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      }`}>
                        <Receipt className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#185d88] text-sm lg:text-base truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 lg:gap-4 mt-1">
                          <p className="text-xs lg:text-sm text-[#6d89a3]">{formatDate(transaction.date)}</p>
                          <span className="text-xs lg:text-sm text-[#6d89a3] hidden sm:inline">•</span>
                          <p className="text-xs lg:text-sm text-[#6d89a3] hidden sm:inline truncate">{transaction.invoiceNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg lg:text-2xl font-bold text-[#185d88]">{transaction.amount.toFixed(2)}€</p>
                        <div className="mt-1">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                      <button className="p-2 lg:p-3 bg-white/60 text-[#307aa8] rounded-lg lg:rounded-xl hover:bg-white/80 transition-all">
                        <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile View */}
        {activeTab === 'profile' && (
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#185d88] mb-4 lg:mb-6">Mon profil</h2>

            {/* Profile Header */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                    {store.user.firstName[0]}{store.user.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-3 h-3 lg:w-4 lg:h-4 text-[#6eaad0]" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#185d88] truncate">{store.user.firstName} {store.user.lastName}</h3>
                  <p className="text-[#6d89a3] text-sm lg:text-base truncate">{store.user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {store.user.phoneVerified ? (
                      <span className="flex items-center gap-1 text-xs lg:text-sm text-green-600">
                        <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                        Téléphone vérifié
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs lg:text-sm text-yellow-600">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                        Téléphone non vérifié
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-2xl font-bold text-[#185d88]">Informations personnelles</h3>
                <button className="text-[#6eaad0] hover:text-[#307aa8] font-semibold flex items-center gap-2 text-sm lg:text-base">
                  <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  Modifier
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Prénom</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.firstName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Nom</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Email</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base truncate">{store.user.email}</p>
                    <button className="text-xs text-[#6eaad0] hover:text-[#307aa8] font-semibold whitespace-nowrap">
                      Changer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Téléphone</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.phone}</p>
                    {!store.user.phoneVerified && (
                      <button className="text-xs text-[#6eaad0] hover:text-[#307aa8] font-semibold">
                        Vérifier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-2xl font-bold text-[#185d88]">Adresse</h3>
                <button className="text-[#6eaad0] hover:text-[#307aa8] font-semibold flex items-center gap-2 text-sm lg:text-base">
                  <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  Modifier
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="sm:col-span-2">
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Adresse complète</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.address}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Ville</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.city}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-semibold text-[#6d89a3] mb-2 block">Code postal</label>
                  <div className="p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">{store.user.postalCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-4 lg:mb-6">Sécurité</h3>
              
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">Mot de passe</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">Modifié il y a 3 mois</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="ml-3 px-3 lg:px-4 py-2 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white rounded-lg font-semibold hover:shadow-lg transition-all text-xs lg:text-sm whitespace-nowrap"
                  >
                    Modifier
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">Double authentification</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">Sécurité renforcée</p>
                  </div>
                  <button className="ml-3 px-3 lg:px-4 py-2 bg-white/60 text-[#307aa8] rounded-lg font-semibold hover:bg-white/80 transition-all text-xs lg:text-sm whitespace-nowrap">
                    Activer
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-[#6eaad0]/30 shadow-lg">
              <h3 className="text-lg lg:text-2xl font-bold text-[#185d88] mb-4 lg:mb-6">Préférences</h3>
              
              <div className="space-y-3 lg:space-y-4">
                <label className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 cursor-pointer hover:bg-white/60 transition-all">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">Notifications email</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">Mises à jour réservations</p>
                  </div>
                  <input type="checkbox" defaultChecked className="ml-3 w-5 h-5 rounded text-[#6eaad0]" />
                </label>

                <label className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 cursor-pointer hover:bg-white/60 transition-all">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">Notifications SMS</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">Rappels par SMS</p>
                  </div>
                  <input type="checkbox" defaultChecked className="ml-3 w-5 h-5 rounded text-[#6eaad0]" />
                </label>

                <label className="flex items-center justify-between p-3 lg:p-4 bg-white/40 rounded-lg lg:rounded-xl border border-[#6eaad0]/20 cursor-pointer hover:bg-white/60 transition-all">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#185d88] text-sm lg:text-base">Offres promotionnelles</p>
                    <p className="text-xs lg:text-sm text-[#6d89a3]">Offres spéciales</p>
                  </div>
                  <input type="checkbox" className="ml-3 w-5 h-5 rounded text-[#6eaad0]" />
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-red-200 shadow-lg">
              <h3 className="text-lg lg:text-2xl font-bold text-red-600 mb-2 lg:mb-4">Zone dangereuse</h3>
              <p className="text-red-600 mb-4 lg:mb-6 text-xs lg:text-sm">Actions irréversibles</p>
              
              <button className="w-full py-3 bg-white text-red-600 rounded-lg lg:rounded-xl font-semibold hover:bg-red-50 transition-all border border-red-200 flex items-center justify-center gap-2 text-sm lg:text-base">
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#6eaad0]/20 z-30">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'text-[#6eaad0]'
                  : 'text-[#6d89a3]'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${activeTab === item.id ? 'text-[#6eaad0]' : ''}`} />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Property Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] p-4 lg:p-6 rounded-t-xl lg:rounded-t-2xl">
              <h3 className="text-xl lg:text-2xl font-bold text-white">Ajouter une propriété</h3>
            </div>
            
            <div className="p-4 lg:p-8">
              <form className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Type de propriété
                  </label>
                  <select className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base">
                    <option value="APARTMENT">Appartement</option>
                    <option value="HOUSE">Maison</option>
                    <option value="OFFICE">Bureau</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Nom de la propriété
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mon appartement parisien"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    placeholder="12 Rue de la Paix"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      placeholder="75001"
                      className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      placeholder="Paris"
                      className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                      Nombre de pièces
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Téléphone du contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Instructions d&apos;accès (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Code d'accès, digicode..."
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded text-[#6eaad0]" />
                  <span className="text-xs lg:text-sm text-[#6d89a3]">
                    Définir comme propriété par défaut
                  </span>
                </label>

                <div className="flex gap-3 lg:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPropertyModal(false)}
                    className="flex-1 py-3 bg-white text-[#6d89a3] rounded-lg lg:rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200 text-sm lg:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white rounded-lg lg:rounded-xl font-semibold hover:shadow-xl transition-all text-sm lg:text-base"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl max-w-md w-full shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] p-4 lg:p-6 rounded-t-xl lg:rounded-t-2xl">
              <h3 className="text-xl lg:text-2xl font-bold text-white">Changer le mot de passe</h3>
            </div>
            
            <div className="p-4 lg:p-8">
              <form className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                  <p className="text-xs text-[#6d89a3] mt-2">
                    Minimum 8 caractères avec majuscules, minuscules et chiffres
                  </p>
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#185d88] mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-[#6eaad0]/30 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eaad0] text-sm lg:text-base"
                  />
                </div>

                <div className="flex gap-3 lg:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 bg-white text-[#6d89a3] rounded-lg lg:rounded-xl font-semibold hover:bg-gray-50 transition-all border border-gray-200 text-sm lg:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white rounded-lg lg:rounded-xl font-semibold hover:shadow-xl transition-all text-sm lg:text-base"
                  >
                    Confirmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard