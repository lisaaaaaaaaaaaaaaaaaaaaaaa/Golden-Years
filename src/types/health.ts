export type HealthRecordType = 'medication' | 'vaccination' | 'weight' | 'checkup' | 'condition';

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}
