import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';

export const scheduleReminder = async (title: string, body: string, scheduleDate: Date) => {
  await LocalNotifications.schedule({
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
};

export const initPushNotifications = async () => {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive === 'granted') {
    await PushNotifications.register();
  }

  PushNotifications.addListener('registration', (token) => {
    // Send token to backend
    console.log('Push registration success:', token.value);
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Error on registration:', error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
  });
};