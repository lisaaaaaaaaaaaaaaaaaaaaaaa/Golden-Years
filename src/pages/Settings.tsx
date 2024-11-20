import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createSubscription } from '../services/stripe';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Switch } from '@headlessui/react';

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await createSubscription(user.id);
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPreferences = async (enabled: boolean) => {
    if (!user) return;
    setNotifications(enabled);
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      notificationsEnabled: enabled,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Current Plan:</p>
              <p className="font-medium">{user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}</p>
            </div>
            {user?.subscriptionStatus !== 'premium' && (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-primary-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts for reminders and updates</p>
            </div>
            <Switch
              checked={notifications}
              onChange={updateNotificationPreferences}
              className={`${
                notifications ? 'bg-primary-dark' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2`}
            >
              <span
                className={`${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}