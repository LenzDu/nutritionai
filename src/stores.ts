import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dailyValue } from './reference-data';

// Define the store's state shape
interface DailyValueState {
  value: typeof dailyValue;   // You might replace 'typeof dailyValue' with a more specific type if necessary
  showModal: boolean;
  setValue: (newValue: typeof dailyValue) => void;
  setShowModal: (showModal: boolean) => void;
};

export const useDailyValueStore = create<DailyValueState>()(
  persist(
    (set) => ({
      value: dailyValue,
      showModal: false,
      setValue: (newValue: typeof dailyValue) => set({ value: newValue }),
      setShowModal: (showModal: boolean) => set(() => ({ showModal })),
    }),
    {
      name: 'daily-value-store',
      // If any other options are needed they would go here
      // Example: getStorage: () => myCustomStorage
    },
  )
);


interface ApiPopupState {
  apiKey: string;
  showApiModal: boolean;
  setApiKey: (newKey: string) => void;
  setShowApiModal: (show: boolean) => void;
};

export const useApiPopupStore = create<ApiPopupState>()(
  persist(
    (set) => ({
      apiKey: '',
      showApiModal: true, // show api modal the first time user opens this page
      setApiKey: (newKey: string) => {
        set({ apiKey: newKey });
      },
      setShowApiModal: (show: boolean) => set({ showApiModal: show }),
    }),
    {
      name: 'api-store',
    }
  )
);