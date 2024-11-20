import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: userData, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to sign in', loading: false });
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: User = {
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
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: 'Failed to sign up', loading: false });
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: 'Failed to sign out' });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
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
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        set({ user: userData, loading: false });
      } else {
        set({ user: userDoc.data() as User, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to sign in with Google', loading: false });
    }
  },

  updateUser: async (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ loading: true, error: null });
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await setDoc(userRef, { ...currentUser, ...userData }, { merge: true });
      set({ user: { ...currentUser, ...userData }, loading: false });
    } catch (error) {
      set({ error: 'Failed to update user', loading: false });
    }
  },
}));