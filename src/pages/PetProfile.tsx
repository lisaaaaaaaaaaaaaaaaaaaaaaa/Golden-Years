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
