const stripeConfig = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || ''
};

export default stripeConfig;
