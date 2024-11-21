#!/bin/bash

# 1. Update types.ts with additional interfaces
cat >> src/types.ts << 'END'
export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  contact: {
    email: string;
    phone?: string;
  };
}

export interface HealthRecord {
  id: string;
  date: string;
  type: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  uid: string;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
}

// Update Pet interface
export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  birthDate?: string;
  imageUrl: string;
  photoURL?: string;
  healthRecords?: HealthRecord[];
  medications?: Medication[];
  vaccinations?: Vaccination[];
}
END

# 2. Update HealthMetrics component
cat > src/components/health/HealthMetrics.tsx << 'END'
import React from 'react';
import { Pet, HealthRecord } from '../../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthMetricsProps {
  pet: Pet;
  metricType: string;
}

export const HealthMetrics: React.FC<HealthMetricsProps> = ({ pet, metricType }) => {
  const data = pet.healthRecords
    ?.filter((record: HealthRecord) => record.type === metricType)
    .map((record: HealthRecord) => ({
      date: new Date(record.date).toLocaleDateString(),
      value: record.value
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
END

# 3. Update PetList component
cat > src/components/pets/PetList.tsx << 'END'
import React from 'react';
import { Pet } from '../../types';
import { Link } from 'react-router-dom';

interface PetListProps {
  pets: Pet[];
}

export const PetList: React.FC<PetListProps> = ({ pets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map((pet) => (
        <Link
          key={pet.id}
          to={`/pet/${pet.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-center space-x-4">
              {pet.imageUrl ? (
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={pet.imageUrl}
                  alt={pet.name}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200" />
              )}
              <div>
                <h3 className="text-lg font-medium">{pet.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
END

# 4. Update AuthContext
cat > src/contexts/AuthContext.tsx << 'END'
import React, { createContext, useContext, useState } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, _password: string) => {
    setLoading(true);
    try {
      setUser({
        id: '1',
        email,
        name: 'Test User',
        uid: '1',
        subscriptionStatus: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, _password: string) => {
    setLoading(true);
    try {
      setUser({
        id: '1',
        email,
        name: 'Test User',
        uid: '1',
        subscriptionStatus: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
END

# 5. Update services
cat > src/services/careTeam.ts << 'END'
import { CareTeamMember } from '../types';

export const addCareTeamMember = async (member: Omit<CareTeamMember, 'id'>): Promise<string> => {
  // Implementation
  return 'member-id';
};
END

cat > src/services/insurance.ts << 'END'
import { Coverage, NewInsuranceClaim } from '../types';

export const submitClaim = async (_petId: string, _claim: NewInsuranceClaim): Promise<string> => {
  // Implementation
  return 'claim-id';
};

export const calculateCoverage = (amount: number, coverage: Coverage): number => {
  const afterDeductible = Math.max(0, amount - coverage.deductible);
  const coveredAmount = afterDeductible * (1 - coverage.copay / 100);
  return Math.min(coveredAmount, coverage.limit);
};
END

cat > src/services/stripe.ts << 'END'
import { User } from '../types';

export const updateUserSubscriptionStatus = async (
  userId: string,
  status: NonNullable<User['subscriptionStatus']>
): Promise<void> => {
  // Implementation
};
END

# Make the script executable and run it
chmod +x fix4.sh
./fix4.sh
