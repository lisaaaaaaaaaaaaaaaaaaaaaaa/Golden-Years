export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: 'free' | 'premium';
  subscriptionId?: string;
  notificationsEnabled: boolean;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationTypes: {
    medications: boolean;
    appointments: boolean;
    vaccinations: boolean;
    weightReminders: boolean;
  };
  measurementUnit: 'metric' | 'imperial';
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  birthDate: string;
  weight: number;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  medicalRecords: MedicalRecord[];
  medications: Medication[];
  vaccinations: Vaccination[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  behaviorRecords: BehaviorRecord[];
  dietRecords: DietRecord[];
  documents: Document[];
  careTeam: CareTeamMember[];
  emergencyContacts: EmergencyContact[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  provider: string;
  attachments: string[];
  followUpDate?: string;
  cost?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  sideEffects?: string[];
  instructions: string;
  reminderEnabled: boolean;
  reminderTimes: string[];
  refillDate?: string;
  pharmacy?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  provider: string;
  batchNumber?: string;
  manufacturer?: string;
  location?: string;
  notes?: string;
  reminderEnabled: boolean;
  attachments: string[];
}

export interface Appointment {
  id: string;
  type: 'checkup' | 'vaccination' | 'grooming' | 'emergency' | 'other';
  date: string;
  provider: string;
  location: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reminderEnabled: boolean;
  reminderTime: string;
  followUpNeeded: boolean;
  cost?: number;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'temperature' | 'pain' | 'symptom' | 'other';
  value: number | string;
  notes?: string;
  recordedBy: string;
}

export interface BehaviorRecord {
  id: string;
  date: string;
  category: 'activity' | 'mood' | 'appetite' | 'sleep' | 'other';
  description: string;
  severity?: 'low' | 'medium' | 'high';
  duration?: string;
  triggers?: string[];
  notes?: string;
}

export interface DietRecord {
  id: string;
  date: string;
  foodType: string;
  brand?: string;
  amount: number;
  unit: 'g' | 'oz' | 'cups';
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  reactions?: string[];
}

export interface Document {
  id: string;
  type: 'insurance' | 'medical' | 'registration' | 'other';
  title: string;
  url: string;
  uploadDate: string;
  expiryDate?: string;
  tags: string[];
  notes?: string;
}

export interface CareTeamMember {
  id: string;
  type: 'vet' | 'groomer' | 'trainer' | 'sitter' | 'other';
  name: string;
  organization?: string;
  phone: string;
  email?: string;
  address?: string;
  specialty?: string;
  notes?: string;
  primaryContact: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  hasKey: boolean;
  notes?: string;
  priority: number;
}

export interface AnalyticsData {
  weightTrend: {
    date: string;
    value: number;
  }[];
  medicationAdherence: number;
  appointmentAttendance: number;
  healthScore: number;
  symptoms: {
    type: string;
    frequency: number;
  }[];
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'cancelled' | 'past_due';
  plan: 'premium';
  startDate: string;
  endDate?: string;
  cancelDate?: string;
  trialEnd?: string;
  currentPeriodEnd: string;
  paymentMethod?: string;
}

export interface Notification {
  id: string;
  userId: string;
  petId?: string;
  type: 'medication' | 'appointment' | 'vaccination' | 'weight' | 'other';
  title: string;
  message: string;
  date: string;
  read: boolean;
  action?: {
    type: string;
    payload: any;
  };
}

export interface TimelineEvent {
  id: string;
  petId: string;
  date: string;
  type: 'medical' | 'vaccination' | 'medication' | 'appointment' | 'weight' | 'behavior' | 'diet';
  title: string;
  description: string;
  metadata: any;
}

export interface InsurancePolicy {
  id: string;
  petId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate?: string;
  coverage: {
    type: string;
    limit: number;
    deductible: number;
  }[];
  documents: Document[];
  claims: InsuranceClaim[];
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  date: string;
  type: string;
  amount: number;
  status: 'submitted' | 'processing' | 'approved' | 'denied';
  documents: Document[];
  notes?: string;
}