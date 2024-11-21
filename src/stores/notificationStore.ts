import create from "zustand";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "reminder" | "alert" | "update";
  read: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, "id">) => Promise<void>;
  clearAll: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({
        notifications,
        unreadCount,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true
      });
      
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  addNotification: async (notification) => {
    try {
      const docRef = await addDoc(collection(db, "notifications"), notification);
      set(state => ({
        notifications: [...state.notifications, { ...notification, id: docRef.id }],
        unreadCount: state.unreadCount + 1
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearAll: async (userId) => {
    try {
      const batch = db.batch();
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
