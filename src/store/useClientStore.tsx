import { useState } from 'react';

// Zustand Store (simulated in-component)
export const useClientStore = () => {
  const [user, setUser] = useState({
    id: 1,
    firstName: 'Ariel Desir',
    lastName: 'Mboma',
    email: 'viallymboma@gmail.com',
    phone: '695500474',
    phoneVerified: false,
    profileImage: null,
    address: 'Villiers-sur-Marne',
    city: 'Villiers-sur-Marne',
    postalCode: '94350',
    country: 'France'
  });

  const [properties, setProperties] = useState([
    {
      id: 1,
      type: 'APARTMENT',
      name: 'Propriété Mboma',
      address: 'Villiers-sur-Marne',
      city: 'Villiers-sur-Marne',
      postalCode: '94350',
      surfaceArea: 100,
      roomCount: 10,
      contactName: 'Ariel Desir Mboma',
      contactPhone: '695500474',
      isDefault: true
    },
    {
      id: 2,
      type: 'HOUSE',
      name: 'Maison Secondaire',
      address: '12 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      surfaceArea: 150,
      roomCount: 6,
      contactName: 'Ariel Desir Mboma',
      contactPhone: '695500474',
      isDefault: false
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      serviceId: 1,
      serviceName: 'Ménage particulier',
      propertyId: 1,
      propertyName: 'Propriété Mboma',
      interventionDate: '2025-11-26',
      startTime: '09:00',
      duration: 180,
      frequency: 'ONE_TIME',
      status: 'CONFIRMED',
      totalAmount: 135.00,
      options: ['Repassage', 'Grand ménage'],
      notes: 'ras'
    },
    {
      id: 2,
      serviceId: 2,
      serviceName: 'Ménage Airbnb',
      propertyId: 2,
      propertyName: 'Maison Secondaire',
      interventionDate: '2025-11-28',
      startTime: '14:00',
      duration: 120,
      frequency: 'WEEKLY',
      status: 'PENDING',
      totalAmount: 90.00,
      options: ['Changement draps'],
      notes: ''
    },
    {
      id: 3,
      serviceId: 1,
      serviceName: 'Ménage particulier',
      propertyId: 1,
      propertyName: 'Propriété Mboma',
      interventionDate: '2025-11-15',
      startTime: '10:00',
      duration: 180,
      frequency: 'ONE_TIME',
      status: 'COMPLETED',
      totalAmount: 135.00,
      options: ['Repassage'],
      notes: ''
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      bookingId: 3,
      date: '2025-11-15',
      amount: 135.00,
      status: 'PAID',
      method: 'CARD',
      invoiceNumber: 'INV-2025-001',
      description: 'Ménage particulier - Propriété Mboma'
    },
    {
      id: 2,
      bookingId: 1,
      date: '2025-11-20',
      amount: 135.00,
      status: 'PENDING',
      method: 'CARD',
      invoiceNumber: 'INV-2025-002',
      description: 'Ménage particulier - Propriété Mboma'
    }
  ]);

  return {
    user,
    setUser,
    properties,
    setProperties,
    bookings,
    setBookings,
    transactions,
    setTransactions
  };
};