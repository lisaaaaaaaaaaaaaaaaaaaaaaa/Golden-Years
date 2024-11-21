import create from 'zustand';
import { Pet } from '../types/pets';
import * as petService from '../services/petService';

interface PetStore {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  addPet: (petData: any, imageUri?: string) => Promise<void>;
  updatePet: (petId: string, updates: any, newImageUri?: string) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  loading: false,
  error: null,

  fetchPets: async () => {
    try {
      set({ loading: true, error: null });
      const pets = await petService.fetchPets();
      set({ pets, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  addPet: async (petData, imageUri) => {
    try {
      set({ loading: true, error: null });
      const newPet = await petService.createPetProfile(petData, imageUri);
      set(state => ({ pets: [...state.pets, newPet], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },

  updatePet: async (petId, updates, newImageUri) => {
    try {
      const updatedPet = await petService.updatePetProfile(petId, updates, newImageUri);
      set(state => ({
        pets: state.pets.map(pet => pet.id === petId ? { ...pet, ...updatedPet } : pet)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },

  deletePet: async (petId) => {
    try {
      await petService.deletePet(petId);
      set(state => ({
        pets: state.pets.filter(pet => pet.id !== petId)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
}));
