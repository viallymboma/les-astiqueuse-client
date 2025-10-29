"use client";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export type ReservationStatus = 'En attente' | 'Confirmé' | 'Annulé' | 'Terminé';

export interface Reservation {
  id: string;
  userId: string;
  service: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

interface Store {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationById: (id: string) => Reservation | undefined;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, reservations: [] }),

      // Reservations
      reservations: [],
      addReservation: (reservation) =>
        set((state) => ({
          reservations: [
            ...state.reservations,
            {
              ...reservation,
              id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateReservation: (id, updates) =>
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, ...updates } : res
          ),
        })),
      deleteReservation: (id) =>
        set((state) => ({
          reservations: state.reservations.filter((res) => res.id !== id),
        })),
      getReservationById: (id) =>
        get().reservations.find((res) => res.id === id),
    }),
    {
      name: 'LesAstiqueuses-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);