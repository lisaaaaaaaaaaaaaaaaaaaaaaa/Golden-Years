"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderList = ReminderList;
const react_1 = require("react");
const date_fns_1 = require("date-fns");
const notifications_1 = require("../../services/notifications");
function ReminderList({ pet }) {
    const [reminders, setReminders] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // Combine all reminders
        const allReminders = [
            ...pet.medications
                .filter(med => med.reminderEnabled)
                .map(med => ({
                id: med.id,
                title: `${med.name} medication`,
                date: med.startDate,
                type: 'medication',
            })),
            ...pet.vaccinations
                .filter(vac => vac.reminderEnabled)
                .map(vac => ({
                id: vac.id,
                title: `${vac.name} vaccination`,
                date: vac.nextDueDate,
                type: 'vaccination',
            })),
        ];
        setReminders(allReminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, [pet]);
    const handleReschedule = (reminder) => __awaiter(this, void 0, void 0, function* () {
        yield (0, notifications_1.scheduleReminder)(reminder.title, `Reminder for ${pet.name}'s ${reminder.title}`, new Date(reminder.date));
    });
    return (<div className="space-y-4">
      <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
      {reminders.length === 0 ? (<p className="text-gray-500">No reminders scheduled</p>) : (<div className="space-y-2">
          {reminders.map((reminder) => (<div key={reminder.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <div>
                <p className="font-medium">{reminder.title}</p>
                <p className="text-sm text-gray-500">
                  {(0, date_fns_1.format)(new Date(reminder.date), 'PPP')}
                </p>
              </div>
              <button onClick={() => handleReschedule(reminder)} className="text-primary-dark hover:text-opacity-80">
                Reschedule
              </button>
            </div>))}
        </div>)}
    </div>);
}
