// ... other imports
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dailyValue } from './reference-data';

export const useDailyValueStore = create(
  persist(
    (set) => ({
      value: dailyValue,
      showModal: false,
      setValue: (newValue) => set({ value: newValue }),
      setShowModal: (showModal) => set(() => ({ showModal })),
    }),
    {
      name: 'daily-value-store',
      // other options
    },
  )
);
