"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripePromise = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
exports.stripePromise = (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
