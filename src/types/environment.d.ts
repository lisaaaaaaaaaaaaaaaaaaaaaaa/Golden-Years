declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      EXPO_TOKEN: string;
      // Add other environment variables here
    }
  }
}

export {};
