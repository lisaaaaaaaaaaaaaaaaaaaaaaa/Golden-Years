"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = exports.createStripeCustomer = void 0;
const functions = __importStar(require("firebase-functions"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
    apiVersion: '2023-08-16',
});
exports.createStripeCustomer = functions.auth.user().onCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield stripe.customers.create({
        email: user.email,
        metadata: {
            firebaseUID: user.uid,
        },
    });
    yield admin.firestore().collection('users').doc(user.uid).update({
        stripeCustomerId: customer.id,
    });
}));
exports.createSubscription = functions.https.onCall((data, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }
    const { priceId } = data;
    const userId = context.auth.uid;
    const userDoc = yield admin.firestore().collection('users').doc(userId).get();
    const user = userDoc.data();
    if (!(user === null || user === void 0 ? void 0 : user.stripeCustomerId)) {
        throw new functions.https.HttpsError('failed-precondition', 'User has no Stripe customer ID');
    }
    const subscription = yield stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
    });
    const invoice = subscription.latest_invoice;
    const paymentIntent = invoice.payment_intent;
    yield admin.firestore().collection('users').doc(userId).update({
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
    });
    return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
    };
}));
