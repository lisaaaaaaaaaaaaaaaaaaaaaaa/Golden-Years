import { loadStripe } from '@stripe/stripe-js';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User } from '../types';

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createSubscription = async (userId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
      }),
    });

    const data = await response.json();
    
    if (data.sessionId) {
      const stripeInstance = await stripe;
      await stripeInstance?.redirectToCheckout({
        sessionId: data.sessionId,
      });
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const updateUserSubscriptionStatus = async (userId: string, status: User['subscriptionStatus']) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    subscriptionStatus: status,
  });
};