import { create } from 'zustand';
import { Notification } from '../types';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as Notification);
      });
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch notifications', loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error) {
      set({ error: 'Failed to mark notification as read' });
    }
  },

  addNotification: async (notification) => {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), notification);
      const newNotification = { ...notification, id: docRef.id } as Notification;
      set((state) => ({
        notifications: [...state.notifications, newNotification],
        unreadCount: state.unreadCount + 1,
      }));
    } catch (error) {
      set({ error: 'Failed to add notification' });
    }
  },
}));