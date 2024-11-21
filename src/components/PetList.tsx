import React from 'react';
import { Pet } from '../types';
import { PetCard } from './PetCard';

interface PetListProps {
  pets: Pet[];
  onPetSelect: (pet: Pet) => void;
}

export const PetList: React.FC<PetListProps> = ({ pets, onPetSelect }) => {
  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pets added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          onClick={() => onPetSelect(pet)}
        />
      ))}
    </div>
  );
};
