import create from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
  fontSize: "small" | "medium" | "large";
}

interface SettingsStore {
  settings: Settings;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  notifications: true,
  language: "en",
  fontSize: "medium"
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,

  loadSettings: async () => {
    set({ loading: true });
    try {
      const stored = await AsyncStorage.getItem("@settings");
      if (stored) {
        set({ settings: JSON.parse(stored), loading: false });
      } else {
        set({ settings: DEFAULT_SETTINGS, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateSettings: async (updates) => {
    try {
      const newSettings = { ...get().settings, ...updates };
      await AsyncStorage.setItem("@settings", JSON.stringify(newSettings));
      set({ settings: newSettings });
    } catch (error) {
      set({ error: error.message });
    }
  },

  resetSettings: async () => {
    try {
      await AsyncStorage.setItem("@settings", JSON.stringify(DEFAULT_SETTINGS));
      set({ settings: DEFAULT_SETTINGS });
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
