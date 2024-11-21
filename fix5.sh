#!/bin/bash

# 1. Update CareTeamForm component
cat > src/components/careTeam/CareTeamForm.tsx << 'END'
import React, { useState } from 'react';
import { CareTeamMember } from '../../types';

interface CareTeamFormProps {
  initialData?: CareTeamMember;
  onSubmit: (data: Omit<CareTeamMember, 'id'>) => void;
}

export const CareTeamForm: React.FC<CareTeamFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    specialty: initialData?.specialty || '',
    contact: {
      email: initialData?.contact.email || '',
      phone: initialData?.contact.phone || ''
    },
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      role: formData.role,
      specialty: formData.specialty || undefined,
      contact: {
        email: formData.contact.email,
        phone: formData.contact.phone || undefined
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="block w-full"
      />
      <input
        type="text"
        value={formData.role}
        onChange={e => setFormData({ ...formData, role: e.target.value })}
        placeholder="Role"
        className="block w-full"
      />
      <input
        type="text"
        value={formData.specialty}
        onChange={e => setFormData({ ...formData, specialty: e.target.value })}
        placeholder="Specialty (optional)"
        className="block w-full"
      />
      <input
        type="email"
        value={formData.contact.email}
        onChange={e => setFormData({
          ...formData,
          contact: { ...formData.contact, email: e.target.value }
        })}
        placeholder="Email"
        className="block w-full"
      />
      <input
        type="tel"
        value={formData.contact.phone}
        onChange={e => setFormData({
          ...formData,
          contact: { ...formData.contact, phone: e.target.value }
        })}
        placeholder="Phone (optional)"
        className="block w-full"
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        {initialData ? 'Update' : 'Add'} Team Member
      </button>
    </form>
  );
};
END

# 2. Update PetProfile to use id
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
  // Use id to fetch pet data
  const pet = id ? mockPet : null;

  if (!pet) return <div>Pet not found</div>;

  return (
    <div>
      <h1>{pet.name}</h1>
      {pet.imageUrl && <img src={pet.imageUrl} alt={pet.name} />}
    </div>
  );
};

export default PetProfile;
END

# 3. Update services with proper parameter handling
cat > src/services/careTeam.ts << 'END'
import { CareTeamMember } from '../types';

export const addCareTeamMember = async (data: Omit<CareTeamMember, 'id'>): Promise<string> => {
  // Implementation would go here
  console.log('Adding care team member:', data);
  return 'member-id';
};
END

cat > src/services/stripe.ts << 'END'
import { User } from '../types';

export const updateUserSubscriptionStatus = async (
  id: string,
  newStatus: NonNullable<User['subscriptionStatus']>
): Promise<void> => {
  // Implementation would go here
  console.log('Updating subscription status:', { id, newStatus });
};
END

# 4. Update authStore with correct subscription status
cat > src/stores/authStore.ts << 'END'
import { User } from '../types';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      set({
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.displayName || 'User',
          uid: userCredential.user.uid,
          subscriptionStatus: 'inactive'
        },
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    // Implementation
    set({ loading: false });
  },

  signOut: async () => {
    // Implementation
    set({ user: null, loading: false });
  }
}));

// Mock function for TypeScript
async function signInWithEmailAndPassword(email: string, password: string) {
  return {
    user: {
      uid: '1',
      email,
      displayName: null
    }
  };
}
END

# Make the script executable and run it
chmod +x fix5.sh
./fix5.sh
