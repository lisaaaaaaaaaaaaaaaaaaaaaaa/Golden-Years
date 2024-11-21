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
exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
const firebase_1 = require("../config/firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
exports.useAuthStore = (0, zustand_1.create)((set, get) => ({
    user: null,
    loading: false,
    error: null,
    signIn: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const { user: firebaseUser } = yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
            const userDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                set({ user: userData, loading: false });
            }
        }
        catch (error) {
            set({ error: 'Failed to sign in', loading: false });
        }
    }),
    signUp: (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const { user: firebaseUser } = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
            const userData = {
                id: firebaseUser.uid,
                email,
                name,
                subscriptionStatus: 'free',
                notificationsEnabled: true,
                createdAt: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    notificationTypes: {
                        medications: true,
                        appointments: true,
                        vaccinations: true,
                        weightReminders: true,
                    },
                    measurementUnit: 'metric',
                },
            };
            yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid), userData);
            set({ user: userData, loading: false });
        }
        catch (error) {
            set({ error: 'Failed to sign up', loading: false });
        }
    }),
    signOut: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, auth_1.signOut)(firebase_1.auth);
            set({ user: null });
        }
        catch (error) {
            set({ error: 'Failed to sign out' });
        }
    }),
    signInWithGoogle: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const provider = new auth_1.GoogleAuthProvider();
            const { user: firebaseUser } = yield (0, auth_1.signInWithPopup)(firebase_1.auth, provider);
            const userDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
                const userData = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    subscriptionStatus: 'free',
                    notificationsEnabled: true,
                    createdAt: new Date().toISOString(),
                    preferences: {
                        theme: 'light',
                        notificationTypes: {
                            medications: true,
                            appointments: true,
                            vaccinations: true,
                            weightReminders: true,
                        },
                        measurementUnit: 'metric',
                    },
                };
                yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid), userData);
                set({ user: userData, loading: false });
            }
            else {
                set({ user: userDoc.data(), loading: false });
            }
        }
        catch (error) {
            set({ error: 'Failed to sign in with Google', loading: false });
        }
    }),
    updateUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = get().user;
        if (!currentUser)
            return;
        set({ loading: true, error: null });
        try {
            const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', currentUser.id);
            yield (0, firestore_1.setDoc)(userRef, Object.assign(Object.assign({}, currentUser), userData), { merge: true });
            set({ user: Object.assign(Object.assign({}, currentUser), userData), loading: false });
        }
        catch (error) {
            set({ error: 'Failed to update user', loading: false });
        }
    }),
}));
