import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./useAuth";
import { db } from "../config/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    enabled: boolean;
    reminders: boolean;
    updates: boolean;
    marketing: boolean;
  };
  privacy: {
    shareData: boolean;
    locationServices: boolean;
  };
  accessibility: {
    fontSize: "small" | "medium" | "large";
    contrastMode: boolean;
    reduceMotion: boolean;
  };
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  notifications: {
    enabled: true,
    reminders: true,
    updates: true,
    marketing: false,
  },
  privacy: {
    shareData: false,
    locationServices: true,
  },
  accessibility: {
    fontSize: "medium",
    contrastMode: false,
    reduceMotion: false,
  },
  language: "en",
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        // Try to load from local storage first
        const localPrefs = await AsyncStorage.getItem(`@preferences_${user.uid}`);
        if (localPrefs) {
          setPreferences(JSON.parse(localPrefs));
        }

        // Subscribe to remote changes
        const unsubscribe = onSnapshot(
          doc(db, "users", user.uid),
          (doc) => {
            if (doc.exists() && doc.data().preferences) {
              const remotePrefs = doc.data().preferences;
              setPreferences(remotePrefs);
              // Update local storage
              AsyncStorage.setItem(
                `@preferences_${user.uid}`,
                JSON.stringify(remotePrefs)
              );
            }
          },
          (err) => setError(err.message)
        );

        setLoading(false);
        return unsubscribe;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const newPreferences = { ...preferences, ...updates };
      
      // Update local state
      setPreferences(newPreferences);
      
      // Update local storage
      await AsyncStorage.setItem(
        `@preferences_${user.uid}`,
        JSON.stringify(newPreferences)
      );
      
      // Update remote
      await updateDoc(doc(db, "users", user.uid), {
        preferences: newPreferences,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPreferences = async () => {
    try {
      await updatePreferences(DEFAULT_PREFERENCES);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    resetPreferences,
  };
};
