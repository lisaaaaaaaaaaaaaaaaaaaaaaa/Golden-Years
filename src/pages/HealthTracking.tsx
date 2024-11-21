import React from 'react';
import { Pet } from '../types';
import { scheduleReminders } from '../services/notifications';

interface HealthTrackingProps {
  pet: Pet;
}

export const HealthTracking: React.FC<HealthTrackingProps> = ({ pet }) => {
  const handleScheduleCheck = async () => {
    try {
      await scheduleReminders(pet);
    } catch (error) {
      console.error('Error scheduling health check:', error);
    }
  };

  return (
    <div>
      {/* Health tracking content */}
      <button onClick={handleScheduleCheck}>
        Schedule Health Check
      </button>
    </div>
  );
};
