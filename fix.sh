#!/bin/bash

# 1. Update types.ts
cat > src/types.ts << 'END'
export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  birthDate?: string;
  imageUrl: string;
  medications?: Medication[];
  vaccinations?: Vaccination[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  notes: string;
}

export interface BehaviorRecord {
  id: string;
  petId: string;
  date: string;
  category: 'activity' | 'aggression' | 'anxiety' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DietRecord {
  id: string;
  petId: string;
  date: string;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodType: string;
  amount: number;
  unit: string;
  brand?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
}

export interface InsuranceClaim {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

export interface Coverage {
  id: string;
  type: string;
  deductible: number;
  copay: number;
  limit: number;
}

export interface TimelineEvent {
  id: string;
  petId: string;
  date: string;
  type: string;
  title: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AnalyticsData {
  weightTrend: Array<{ date: string; value: number }>;
  symptoms: Array<{ type: string; count: number }>;
  medications: {
    active: number;
    total: number;
  };
  vaccinations: {
    overdue: number;
    upcoming: number;
  };
}

export type NewBehaviorRecord = Omit<BehaviorRecord, 'id' | 'date'>;
export type NewDietRecord = Omit<DietRecord, 'id' | 'date'>;
export type NewDocument = Omit<Document, 'id'>;
export type NewInsuranceClaim = Omit<InsuranceClaim, 'id' | 'status'>;
END

# 2. Update PetProfile.tsx
cat > src/pages/PetProfile.tsx << 'END'
import React from 'react';
import { useParams } from 'react-router-dom';
import { Pet } from '../types';

const mockPet: Pet = {
  id: '1',
  name: 'Buddy',
  species: 'dog',
  imageUrl: '/dog.jpg'
};

const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pet = mockPet;

  if (!pet) return null;

  return (
    <div>
      <h1>{pet.name}</h1>
      {pet.imageUrl && <img src={pet.imageUrl} alt={pet.name} />}
    </div>
  );
};

export default PetProfile;
END

# 3. Update BehaviorTracking.tsx
cat > src/components/behavior/BehaviorTracking.tsx << 'END'
import React, { useState } from 'react';
import { BehaviorRecord, NewBehaviorRecord } from '../../types';

interface BehaviorTrackingProps {
  records: BehaviorRecord[];
  onAddRecord: (record: NewBehaviorRecord) => Promise<void>;
}

export const BehaviorTracking: React.FC<BehaviorTrackingProps> = ({
  records,
  onAddRecord
}) => {
  const [category, setCategory] = useState<BehaviorRecord['category']>('activity');
  const [severity, setSeverity] = useState<BehaviorRecord['severity']>('low');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!records.length) return;

    await onAddRecord({
      petId: records[0].petId,
      category,
      severity,
      description
    });
    
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as BehaviorRecord['category'])}
        className="block w-full"
      >
        <option value="activity">Activity</option>
        <option value="aggression">Aggression</option>
        <option value="anxiety">Anxiety</option>
        <option value="other">Other</option>
      </select>

      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value as BehaviorRecord['severity'])}
        className="block w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full"
      />

      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        Add Record
      </button>
    </form>
  );
};
END

# Make the script executable
chmod +x fix.sh
