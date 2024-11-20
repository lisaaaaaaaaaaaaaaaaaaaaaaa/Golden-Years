import { create } from 'zustand';
import { User } from '../types';

interface SubscriptionStore {
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  checkFeatureAccess: (feature: 'analytics' | 'multiPet' | 'export' | 'customReminders') => boolean;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  showUpgradeModal: false,
  setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),
  
  checkFeatureAccess: (feature) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
    
    if (user.subscriptionStatus === 'premium') {
      return true;
    }

    switch (feature) {
      case 'analytics':
      case 'multiPet':
      case 'export':
      case 'customReminders':
        return false;
      default:
        return true;
    }
  },
}));