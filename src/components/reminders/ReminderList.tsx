import { useState, useEffect } from 'react';
import { Pet } from '../../types';
import { format } from 'date-fns';
import { scheduleReminder } from '../../services/notifications';

interface ReminderListProps {
  pet: Pet;
}

export function ReminderList({ pet }: ReminderListProps) {
  const [reminders, setReminders] = useState<Array<{
    id: string;
    title: string;
    date: string;
    type: 'medication' | 'vaccination' | 'appointment';
  }>>([]);

  useEffect(() => {
    // Combine all reminders
    const allReminders = [
      ...pet.medications
        .filter(med => med.reminderEnabled)
        .map(med => ({
          id: med.id,
          title: `${med.name} medication`,
          date: med.startDate,
          type: 'medication' as const,
        })),
      ...pet.vaccinations
        .filter(vac => vac.reminderEnabled)
        .map(vac => ({
          id: vac.id,
          title: `${vac.name} vaccination`,
          date: vac.nextDueDate,
          type: 'vaccination' as const,
        })),
    ];

    setReminders(allReminders.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  }, [pet]);

  const handleReschedule = async (reminder: typeof reminders[0]) => {
    await scheduleReminder(
      reminder.title,
      `Reminder for ${pet.name}'s ${reminder.title}`,
      new Date(reminder.date)
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
      {reminders.length === 0 ? (
        <p className="text-gray-500">No reminders scheduled</p>
      ) : (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div>
                <p className="font-medium">{reminder.title}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(reminder.date), 'PPP')}
                </p>
              </div>
              <button
                onClick={() => handleReschedule(reminder)}
                className="text-primary-dark hover:text-opacity-80"
              >
                Reschedule
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}