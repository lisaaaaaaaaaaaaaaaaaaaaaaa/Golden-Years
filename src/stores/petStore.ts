import { create } from 'zustand';
import { Pet } from '../types';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

interface PetStore {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  fetchPets: (userId: string) => Promise<void>;
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  selectPet: (pet: Pet | null) => void;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  fetchPets: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'pets'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const pets: Pet[] = [];
      querySnapshot.forEach((doc) => {
        pets.push({ id: doc.id, ...doc.data() } as Pet);
      });
      set({ pets, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch pets', loading: false });
    }
  },

  addPet: async (pet) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, 'pets'), pet);
      const newPet = { ...pet, id: docRef.id } as Pet;
      set((state) => ({ pets: [...state.pets, newPet], loading: false }));
    } catch (error) {
      set({ error: 'Failed to add pet', loading: false });
    }
  },

  updatePet: async (pet) => {
    set({ loading: true, error: null });
    try {
      const petRef = doc(db, 'pets', pet.id);
      await updateDoc(petRef, pet);
      set((state) => ({
        pets: state.pets.map((p) => (p.id === pet.id ? pet : p)),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update pet', loading: false });
    }
  },

  deletePet: async (petId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'pets', petId));
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== petId),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete pet', loading: false });
    }
  },

  selectPet: (pet) => {
    set({ selectedPet: pet });
  },
}));