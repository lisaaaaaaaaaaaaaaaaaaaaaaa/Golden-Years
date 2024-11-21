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
exports.useNotificationStore = void 0;
const zustand_1 = require("zustand");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
exports.useNotificationStore = (0, zustand_1.create)((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    fetchNotifications: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'notifications'), (0, firestore_1.where)('userId', '==', userId));
            const querySnapshot = yield (0, firestore_1.getDocs)(q);
            const notifications = [];
            querySnapshot.forEach((doc) => {
                notifications.push(Object.assign({ id: doc.id }, doc.data()));
            });
            const unreadCount = notifications.filter((n) => !n.read).length;
            set({ notifications, unreadCount, loading: false });
        }
        catch (error) {
            set({ error: 'Failed to fetch notifications', loading: false });
        }
    }),
    markAsRead: (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notificationRef = (0, firestore_1.doc)(firebase_1.db, 'notifications', notificationId);
            yield (0, firestore_1.updateDoc)(notificationRef, { read: true });
            set((state) => ({
                notifications: state.notifications.map((n) => n.id === notificationId ? Object.assign(Object.assign({}, n), { read: true }) : n),
                unreadCount: state.unreadCount - 1,
            }));
        }
        catch (error) {
            set({ error: 'Failed to mark notification as read' });
        }
    }),
    addNotification: (notification) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'notifications'), notification);
            const newNotification = Object.assign(Object.assign({}, notification), { id: docRef.id });
            set((state) => ({
                notifications: [...state.notifications, newNotification],
                unreadCount: state.unreadCount + 1,
            }));
        }
        catch (error) {
            set({ error: 'Failed to add notification' });
        }
    }),
}));
