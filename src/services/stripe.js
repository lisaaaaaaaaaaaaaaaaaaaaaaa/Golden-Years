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
exports.updateUserSubscriptionStatus = exports.createSubscription = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const stripe = (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const createSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
            }),
        });
        const data = yield response.json();
        if (data.sessionId) {
            const stripeInstance = yield stripe;
            yield (stripeInstance === null || stripeInstance === void 0 ? void 0 : stripeInstance.redirectToCheckout({
                sessionId: data.sessionId,
            }));
        }
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
});
exports.createSubscription = createSubscription;
const updateUserSubscriptionStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
    yield (0, firestore_1.updateDoc)(userRef, {
        subscriptionStatus: status,
    });
});
exports.updateUserSubscriptionStatus = updateUserSubscriptionStatus;
