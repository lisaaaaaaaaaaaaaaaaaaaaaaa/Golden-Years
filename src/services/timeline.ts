import { Pet, TimelineEvent, Medication, Vaccination } from '../types';

const createMedicationEvent = (med: Medication, petId: string): TimelineEvent => ({
  id: `med-${med.id}`,
  date: med.startDate,
  type: 'medication',
  title: `Started ${med.name}`,
  description: `Dosage: ${med.dosage}`,
  petId
});

const createVaccinationEvent = (vac: Vaccination, petId: string): TimelineEvent => ({
  id: `vac-${vac.id}`,
  date: vac.date,
  type: 'vaccination',
  title: `Vaccination: ${vac.name}`,
  description: vac.notes,
  petId
});

export const generateTimeline = (pet: Pet): TimelineEvent[] => {
  const events: TimelineEvent[] = [];

  pet.medications?.forEach(med => {
    events.push(createMedicationEvent(med, pet.id));
  });

  pet.vaccinations?.forEach(vac => {
    events.push(createVaccinationEvent(vac, pet.id));
  });

  return events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
