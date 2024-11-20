import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-08-16',
});

export const createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({
    email: user.email!,
    metadata: {
      firebaseUID: user.uid,
    },
  });

  await admin.firestore().collection('users').doc(user.uid).update({
    stripeCustomerId: customer.id,
  });
});

export const createSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { priceId } = data;
  const userId = context.auth.uid;

  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const user = userDoc.data();

  if (!user?.stripeCustomerId) {
    throw new functions.https.HttpsError('failed-precondition', 'User has no Stripe customer ID');
  }

  const subscription = await stripe.subscriptions.create({
    customer: user.stripeCustomerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  await admin.firestore().collection('users').doc(userId).update({
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
  });

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
  };
});