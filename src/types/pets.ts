export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  imageUrl?: string;
  healthRecords?: HealthRecord[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  type: 'weight' | 'pain' | 'symptom';
  value: number | string;
  recordedBy: string;
  timestamp: string;
}
