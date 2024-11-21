"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscriptionStore = void 0;
const zustand_1 = require("zustand");
exports.useSubscriptionStore = (0, zustand_1.create)((set, get) => ({
    showUpgradeModal: false,
    setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),
    checkFeatureAccess: (feature) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
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
