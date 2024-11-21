import React from 'react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg"
    >
      <div className="flex items-center space-x-4">
        {pet.imageUrl && (
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={pet.imageUrl}
            alt={pet.name}
          />
        )}
        <div>
          <h3 className="text-lg font-medium">{pet.name}</h3>
          <p className="text-sm text-gray-500">
            {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
          </p>
        </div>
      </div>
    </div>
  );
};
