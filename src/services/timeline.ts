import { db } from '../config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { TimelineEvent, Pet } from '../types';

export const generateTimeline = async (pet: Pet): Promise<TimelineEvent[]> => {
  const timeline: TimelineEvent[] = [];

  // Add medical records
  pet.medicalRecords.forEach(record => {
    timeline.push({
      id: record.id,
      petId: pet.id,
      date: record.date,
      type: 'medical',
      title: `Medical Visit: ${record.type}`,
      description: record.diagnosis,
      metadata: record
    });
  });

  // Add vaccinations
  pet.vaccinations.forEach(vaccination => {
    timeline.push({
      id: vaccination.id,
      petId: pet.id,
      date: vaccination.date,
      type: 'vaccination',
      title: `Vaccination: ${vaccination.name}`,
      description: `Next due: ${vaccination.nextDueDate}`,
      metadata: vaccination
    });
  });

  // Add medications
  pet.medications.forEach(medication => {
    timeline.push({
      id: medication.id,
      petId: pet.id,
      date: medication.startDate,
      type: 'medication',
      title: `Started Medication: ${medication.name}`,
      description: `${medication.dosage} - ${medication.frequency}`,
      metadata: medication
    });
  });

  // Add appointments
  pet.appointments.forEach(appointment => {
    timeline.push({
      id: appointment.id,
      petId: pet.id,
      date: appointment.date,
      type: 'appointment',
      title: `${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Appointment`,
      description: appointment.notes,
      metadata: appointment
    });
  });

  // Add weight records
  pet.healthRecords
    .filter(record => record.type === 'weight')
    .forEach(record => {
      timeline.push({
        id: record.id,
        petId: pet.id,
        date: record.date,
        type: 'weight',
        title: 'Weight Recorded',
        description: `${record.value} kg`,
        metadata: record
      });
    });

  // Add behavior records
  pet.behaviorRecords.forEach(record => {
    timeline.push({
      id: record.id,
      petId: pet.id,
      date: record.date,
      type: 'behavior',
      title: `Behavior: ${record.category}`,
      description: record.description,
      metadata: record
    });
  });

  // Add diet records
  pet.dietRecords.forEach(record => {
    timeline.push({
      id: record.id,
      petId: pet.id,
      date: record.date,
      type: 'diet',
      title: `Diet: ${record.mealTime}`,
      description: `${record.amount}${record.unit} of ${record.foodType}`,
      metadata: record
    });
  });

  // Sort timeline by date
  return timeline.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};