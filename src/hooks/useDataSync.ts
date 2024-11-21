import { useState, useEffect, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";

interface SyncState {
  lastSynced: Date | null;
  isSyncing: boolean;
  pendingChanges: number;
  error: string | null;
}

interface SyncOptions {
  syncInterval?: number; // in milliseconds
  retryAttempts?: number;
  syncOnConnect?: boolean;
}

export const useDataSync = (options: SyncOptions = {}) => {
  const {
    syncInterval = 300000, // 5 minutes
    retryAttempts = 3,
    syncOnConnect = true,
  } = options;

  const [syncState, setSyncState] = useState<SyncState>({
    lastSynced: null,
    isSyncing: false,
    pendingChanges: 0,
    error: null,
  });

  const { user } = useAuth();

  // Queue for storing offline changes
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load offline queue from storage
    loadOfflineQueue();

    // Set up network listener
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && syncOnConnect) {
        synchronize();
      }
    });

    // Set up periodic sync
    const syncInterval = setInterval(() => {
      synchronize();
    }, syncInterval);

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
    };
  }, [user]);

  const loadOfflineQueue = async () => {
    try {
      const queue = await AsyncStorage.getItem(`@offline_queue_${user?.uid}`);
      if (queue) {
        setOfflineQueue(JSON.parse(queue));
        setSyncState(prev => ({
          ...prev,
          pendingChanges: JSON.parse(queue).length,
        }));
      }
    } catch (error) {
      console.error("Error loading offline queue:", error);
    }
  };

  const saveOfflineQueue = async (queue: any[]) => {
    try {
      await AsyncStorage.setItem(
        `@offline_queue_${user?.uid}`,
        JSON.stringify(queue)
      );
    } catch (error) {
      console.error("Error saving offline queue:", error);
    }
  };

  const queueChange = async (change: any) => {
    const newQueue = [...offlineQueue, change];
    setOfflineQueue(newQueue);
    await saveOfflineQueue(newQueue);
    setSyncState(prev => ({
      ...prev,
      pendingChanges: newQueue.length,
    }));
  };

  const synchronize = async () => {
    if (!user || syncState.isSyncing) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error("No internet connection");
      }

      // Process offline queue
      let attempts = 0;
      while (offlineQueue.length > 0 && attempts < retryAttempts) {
        try {
          const change = offlineQueue[0];
          await processChange(change);
          
          // Remove processed change
          const newQueue = offlineQueue.slice(1);
          setOfflineQueue(newQueue);
          await saveOfflineQueue(newQueue);
        } catch (error) {
          attempts++;
          if (attempts >= retryAttempts) {
            throw error;
          }
        }
      }

      setSyncState({
        lastSynced: new Date(),
        isSyncing: false,
        pendingChanges: offlineQueue.length,
        error: null,
      });
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message,
      }));
    }
  };

  const processChange = async (change: any) => {
    // Implement your sync logic here
    const { collection, doc: docId, data, operation } = change;
    
    switch (operation) {
      case "create":
      case "update":
        await setDoc(doc(db, collection, docId), data, { merge: true });
        break;
      case "delete":
        // Handle delete operation
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  };

  return {
    syncState,
    synchronize,
    queueChange,
  };
};
