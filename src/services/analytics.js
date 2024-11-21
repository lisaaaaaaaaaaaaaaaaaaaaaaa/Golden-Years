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
exports.generateAnalytics = exports.calculateHealthScore = void 0;
const calculateHealthScore = (pet) => {
    let score = 100;
    // Weight trend analysis
    const weightRecords = pet.healthRecords.filter(r => r.type === 'weight')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (weightRecords.length >= 2) {
        const latestWeight = weightRecords[0].value;
        const previousWeight = weightRecords[1].value;
        const weightChange = Math.abs((latestWeight - previousWeight) / previousWeight);
        if (weightChange > 0.1) {
            score -= 10; // Significant weight change
        }
    }
    // Medication adherence
    const activeMedications = pet.medications.filter(med => !med.endDate || new Date(med.endDate) > new Date());
    const missedMedications = activeMedications.filter(med => {
        const lastDue = new Date(med.startDate);
        return lastDue < new Date();
    });
    score -= (missedMedications.length * 5);
    // Vaccination status
    const overdueVaccinations = pet.vaccinations.filter(vac => new Date(vac.nextDueDate) < new Date());
    score -= (overdueVaccinations.length * 10);
    // Recent symptoms
    const recentSymptoms = pet.healthRecords
        .filter(r => r.type === 'symptom' &&
        new Date(r.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    score -= (recentSymptoms.length * 3);
    return Math.max(0, Math.min(100, score));
};
exports.calculateHealthScore = calculateHealthScore;
const generateAnalytics = (pet) => __awaiter(void 0, void 0, void 0, function* () {
    const weightTrend = pet.healthRecords
        .filter(r => r.type === 'weight')
        .map(r => ({
        date: r.date,
        value: r.value
    }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const medicationAdherence = calculateMedicationAdherence(pet);
    const appointmentAttendance = calculateAppointmentAttendance(pet);
    const healthScore = (0, exports.calculateHealthScore)(pet);
    const symptoms = analyzeSymptoms(pet.healthRecords);
    return {
        weightTrend,
        medicationAdherence,
        appointmentAttendance,
        healthScore,
        symptoms
    };
});
exports.generateAnalytics = generateAnalytics;
const calculateMedicationAdherence = (pet) => {
    const activeMedications = pet.medications.filter(med => !med.endDate || new Date(med.endDate) > new Date());
    if (activeMedications.length === 0)
        return 100;
    const missedMedications = activeMedications.filter(med => {
        const lastDue = new Date(med.startDate);
        return lastDue < new Date();
    });
    return ((activeMedications.length - missedMedications.length) / activeMedications.length) * 100;
};
const calculateAppointmentAttendance = (pet) => {
    const pastAppointments = pet.appointments.filter(apt => new Date(apt.date) < new Date());
    if (pastAppointments.length === 0)
        return 100;
    const attendedAppointments = pastAppointments.filter(apt => apt.status === 'completed');
    return (attendedAppointments.length / pastAppointments.length) * 100;
};
const analyzeSymptoms = (records) => {
    const symptomRecords = records.filter(r => r.type === 'symptom');
    const symptomCount = new Map();
    symptomRecords.forEach(record => {
        const symptom = record.value;
        symptomCount.set(symptom, (symptomCount.get(symptom) || 0) + 1);
    });
    return Array.from(symptomCount.entries()).map(([type, frequency]) => ({
        type,
        frequency
    }));
};
