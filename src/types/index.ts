// Re-export with explicit names to avoid conflicts
import { User as AuthUser } from './auth';
import { User as AppUser } from './user';
import { HealthRecord as PetHealthRecord } from './pets';
import { HealthRecord as MedicalRecord } from './health';

export {
  AuthUser,
  AppUser,
  PetHealthRecord,
  MedicalRecord
};

// Safe exports without conflicts
export * from './pets';
export * from './documents';
export * from './insurance';
