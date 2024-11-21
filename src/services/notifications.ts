import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Pet } from '../types';

export const scheduleReminders = async (pet: Pet): Promise<void> => {
  const notifications: LocalNotificationSchema[] = [];

  pet.medications?.forEach(medication => {
    notifications.push({
      id: parseInt(medication.id),
      title: `Medication Reminder for ${pet.name}`,
      body: `Time to give ${medication.name} - ${medication.dosage}`,
      schedule: { at: new Date(medication.startDate) },
      attachments: [],
      extra: {
        petId: pet.id,
        medicationId: medication.id
      }
    });
  });

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
};

export const scheduleReminder = scheduleReminders; // Alias for backward compatibility

export const cancelReminders = async (notificationIds: number[]): Promise<void> => {
  await LocalNotifications.cancel({
    notifications: notificationIds.map(id => ({ id }))
  });
};
