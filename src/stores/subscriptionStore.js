import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      subscription: null,
      setSubscription: (sub) => {
        if (typeof window !== 'undefined') {
          set({ subscription: sub });
        }
      },
      // ... rest of the store implementation
    }),
    {
      name: 'subscription-storage',
      getStorage: () => ({
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, value);
          }
        },
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(name);
          }
          return null;
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      }),
    }
  )
);

export default useSubscriptionStore;
