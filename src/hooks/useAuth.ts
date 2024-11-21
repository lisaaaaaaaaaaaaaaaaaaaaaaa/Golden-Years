import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setProfile({ id: userId, ...userDoc.data() } as UserProfile);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile");
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          darkMode: false
        }
      });

      await fetchUserProfile(user.uid);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(user.uid);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
      await fetchUserProfile(user.uid);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile
  };
};
