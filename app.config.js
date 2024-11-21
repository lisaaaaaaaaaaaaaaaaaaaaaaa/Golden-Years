export default {
  expo: {
    name: 'Golden Years',
    slug: 'golden-years',
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY
    }
  }
};