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
exports.generateTimeline = void 0;
const generateTimeline = (pet) => __awaiter(void 0, void 0, void 0, function* () {
    const timeline = [];
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
    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
exports.generateTimeline = generateTimeline;
