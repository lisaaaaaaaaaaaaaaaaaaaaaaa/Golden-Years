"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
const react_1 = require("react");
const AuthContext_1 = require("../contexts/AuthContext");
const stripe_1 = require("../services/stripe");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const react_2 = require("@headlessui/react");
function Settings() {
    const { user } = (0, AuthContext_1.useAuth)();
    const [notifications, setNotifications] = (0, react_1.useState)(true);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubscribe = () => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        setLoading(true);
        try {
            yield (0, stripe_1.createSubscription)(user.id);
        }
        catch (error) {
            console.error('Error subscribing:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const updateNotificationPreferences = (enabled) => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        setNotifications(enabled);
        const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', user.id);
        yield (0, firestore_1.updateDoc)(userRef, {
            notificationsEnabled: enabled,
        });
    });
    return (<div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Current Plan:</p>
              <p className="font-medium">{(user === null || user === void 0 ? void 0 : user.subscriptionStatus) === 'premium' ? 'Premium' : 'Free'}</p>
            </div>
            {(user === null || user === void 0 ? void 0 : user.subscriptionStatus) !== 'premium' && (<button onClick={handleSubscribe} disabled={loading} className="bg-primary-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </button>)}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts for reminders and updates</p>
            </div>
            <react_2.Switch checked={notifications} onChange={updateNotificationPreferences} className={`${notifications ? 'bg-primary-dark' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2`}>
              <span className={`${notifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
            </react_2.Switch>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user === null || user === void 0 ? void 0 : user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{user === null || user === void 0 ? void 0 : user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
