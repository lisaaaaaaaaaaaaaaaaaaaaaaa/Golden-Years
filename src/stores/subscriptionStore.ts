import { create } from "zustand";

interface Subscription {
  id: string;
  type: "basic" | "premium";
  status: "active" | "cancelled";
  expiryDate: string;
}

interface SubscriptionStore {
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: null,
  setSubscription: (subscription) => set({ subscription }),
  clearSubscription: () => set({ subscription: null })
}));
