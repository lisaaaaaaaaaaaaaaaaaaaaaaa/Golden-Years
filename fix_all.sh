#!/bin/bash

# 1. Fix all component files
mkdir -p src/components/auth src/components/behavior src/components/diet src/components/documents src/components/insurance src/components/health
mkdir -p src/contexts src/services src/pages src/types

# Update all files with correct types and implementations
cat > src/types/index.ts << "EOF"
export interface Pet {
  id: string;
  name: string;
  species: string;
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
  category: "activity" | "aggression" | "anxiety" | "other";
  severity: "low" | "medium" | "high";
  description: string;
}

export interface DietRecord {
  id: string;
  petId: string;
  date: string;
  mealTime: "breakfast" | "lunch" | "dinner" | "snack";
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
  status: "pending" | "approved" | "rejected";
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
  description?: string;
}

export interface User {
  id: string;
  uid: string;
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

export type NewBehaviorRecord = Omit<BehaviorRecord, "id" | "date">;
export type NewDietRecord = Omit<DietRecord, "id" | "date">;
export type NewDocument = Omit<Document, "id">;
export type NewInsuranceClaim = Omit<InsuranceClaim, "id" | "status">;
EOF

# Fix PetProfile.tsx export
cat > src/pages/PetProfile.tsx << "EOF"
import React from "react";
import { Pet } from "../types";
import { BehaviorTracking } from "../components/behavior/BehaviorTracking";
import { DietTracking } from "../components/diet/DietTracking";
import { HealthMetricsInput } from "../components/health/HealthMetricsInput";

interface PetProfileProps {
  pet: Pet;
}

const PetProfile: React.FC<PetProfileProps> = ({ pet }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <img
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          src={pet.imageUrl}
          alt={pet.name}
        />
        <h1 className="text-3xl font-bold text-center mb-2">{pet.name}</h1>
        <p className="text-gray-600 text-center">
          {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
        </p>
      </div>
    </div>
  );
};

export default PetProfile;
EOF

# Fix App.tsx
cat > src/App.tsx << "EOF"
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { Loading } from "./components/Loading";

const PetProfile = lazy(() => import("./pages/PetProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pet/:id" element={<PetProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
};
EOF

# Update all service files
cat > src/services/analytics.ts << "EOF"
import { Pet, AnalyticsData } from "../types";

export const generateAnalytics = (pet: Pet): AnalyticsData => {
  const now = new Date();
  
  return {
    weightTrend: [],
    symptoms: [],
    medications: {
      active: pet.medications?.filter(med => 
        !med.endDate || new Date(med.endDate) > now
      ).length || 0,
      total: pet.medications?.length || 0
    },
    vaccinations: {
      overdue: pet.vaccinations?.filter(vac => 
        new Date(vac.nextDueDate) < now
      ).length || 0,
      upcoming: pet.vaccinations?.filter(vac => 
        new Date(vac.nextDueDate) > now
      ).length || 0
    }
  };
};
EOF

# Fix all component exports
cat > src/components/behavior/BehaviorTracking.tsx << "EOF"
import React, { useState } from "react";
import { BehaviorRecord, NewBehaviorRecord } from "../../types";

interface BehaviorTrackingProps {
  records: BehaviorRecord[];
  onAddRecord: (record: NewBehaviorRecord) => Promise<void>;
}

export const BehaviorTracking: React.FC<BehaviorTrackingProps> = ({
  records,
  onAddRecord
}) => {
  const [category, setCategory] = useState<BehaviorRecord["category"]>("activity");
  const [severity, setSeverity] = useState<BehaviorRecord["severity"]>("low");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (records.length === 0) return;

    const newRecord: NewBehaviorRecord = {
      petId: records[0].petId,
      category,
      severity,
      description
    };

    await onAddRecord(newRecord);
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as BehaviorRecord["category"])}
        className="block w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="activity">Activity</option>
        <option value="aggression">Aggression</option>
        <option value="anxiety">Anxiety</option>
        <option value="other">Other</option>
      </select>

      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value as BehaviorRecord["severity"])}
        className="block w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm"
      />

      <button type="submit" className="w-full bg-blue-500 text-white rounded-md py-2">
        Add Record
      </button>
    </form>
  );
};
EOF

# Make the script executable
chmod +x fix_all.sh
