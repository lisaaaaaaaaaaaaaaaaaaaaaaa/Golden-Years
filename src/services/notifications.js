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
exports.initPushNotifications = exports.scheduleReminder = void 0;
const local_notifications_1 = require("@capacitor/local-notifications");
const push_notifications_1 = require("@capacitor/push-notifications");
const scheduleReminder = (title, body, scheduleDate) => __awaiter(void 0, void 0, void 0, function* () {
    yield local_notifications_1.LocalNotifications.schedule({
        notifications: [
            {
                title,
                body,
                id: new Date().getTime(),
                schedule: { at: scheduleDate },
                sound: 'beep.wav',
                attachments: null,
                actionTypeId: '',
                extra: null,
            },
        ],
    });
});
exports.scheduleReminder = scheduleReminder;
const initPushNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield push_notifications_1.PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
        yield push_notifications_1.PushNotifications.register();
    }
    push_notifications_1.PushNotifications.addListener('registration', (token) => {
        // Send token to backend
        console.log('Push registration success:', token.value);
    });
    push_notifications_1.PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', error);
    });
    push_notifications_1.PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
    });
});
exports.initPushNotifications = initPushNotifications;
