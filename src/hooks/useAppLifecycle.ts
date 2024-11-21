import { useState, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { usePerformance } from "./usePerformance";
import { useDataSync } from "./useDataSync";

interface AppLifecycle {
  appState: AppStateStatus;
  lastBackgroundedTime: number | null;
  isOnline: boolean;
  isActive: boolean;
  memoryUsage: number;
  batteryLevel: number;
}

export const useAppLifecycle = () => {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>({
    appState: AppState.currentState,
    lastBackgroundedTime: null,
    isOnline: true,
    isActive: true,
    memoryUsage: 0,
    batteryLevel: 100,
  });

  const { startTrace, measureInteraction } = usePerformance();
  const { synchronize } = useDataSync();
  const backgroundTimer = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    const netInfoUnsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Start monitoring performance
    const perfTrace = startTrace("app_lifecycle");
    perfTrace.start();

    // Monitor memory usage
    if (Platform.OS !== "web") {
      setInterval(updateMemoryUsage, 30000); // Every 30 seconds
    }

    return () => {
      subscription.remove();
      netInfoUnsubscribe();
      perfTrace.stop();
      if (backgroundTimer.current) {
        clearInterval(backgroundTimer.current);
      }
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setLifecycle(prev => ({
      ...prev,
      appState: nextAppState,
      isActive: nextAppState === "active",
      lastBackgroundedTime: nextAppState === "background" ? Date.now() : prev.lastBackgroundedTime,
    }));

    if (nextAppState === "active") {
      // App came to foreground
      measureInteraction("app_foreground", async () => {
        await synchronize(); // Sync data
        await updateMemoryUsage();
      });
    } else if (nextAppState === "background") {
      // App went to background
      backgroundTimer.current = setInterval(() => {
        // Perform background tasks if needed
      }, 30000) as any;
    }
  };

  const handleConnectivityChange = (state: any) => {
    setLifecycle(prev => ({
      ...prev,
      isOnline: state.isConnected,
    }));

    if (state.isConnected) {
      synchronize(); // Sync data when connection is restored
    }
  };

  const updateMemoryUsage = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      try {
        const usage = await Performance.memory();
        setLifecycle(prev => ({
          ...prev,
          memoryUsage: usage.usedJSHeapSize / usage.jsHeapSizeLimit,
        }));
      } catch (error) {
        console.error("Error getting memory usage:", error);
      }
    }
  };

  const getTimeInBackground = () => {
    if (!lifecycle.lastBackgroundedTime) return 0;
    return Date.now() - lifecycle.lastBackgroundedTime;
  };

  return {
    ...lifecycle,
    getTimeInBackground,
  };
};
