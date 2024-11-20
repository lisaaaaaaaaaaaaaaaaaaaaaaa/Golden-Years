import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

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

export const handleSubscriptionUpdated = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig!, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'customer.subscription.updated' || 
      event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if (customer.deleted) {
      res.status(400).send('Customer deleted');
      return;
    }

    const userId = customer.metadata.firebaseUID;

    await admin.firestore().collection('users').doc(userId).update({
      subscriptionStatus: subscription.status,
      subscriptionId: subscription.id,
    });
  }

  res.json({ received: true });
});

export const sendPushNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const userId = notification.userId;

    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const user = userDoc.data();

    if (!user?.notificationsEnabled) {
      return;
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      token: user.fcmToken,
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });