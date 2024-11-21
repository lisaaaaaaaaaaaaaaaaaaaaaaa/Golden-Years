import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export interface Pet {
  id?: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  imageUrl?: string;
  ownerId: string;
  metadata?: any;
}

export const usePet = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "pets"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const petList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Pet[];
        setPets(petList);
        setLoading(false);
      },
      (err) => {
        console.error("Pet subscription error:", err);
        setError("Failed to fetch pets");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addPet = async (petData: Omit<Pet, "id" | "ownerId">) => {
    if (!user) return;

    try {
      setError(null);
      const docRef = await addDoc(collection(db, "pets"), {
        ...petData,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (err: any) {
      console.error("Add pet error:", err);
      setError(err.message);
      throw err;
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    try {
      setError(null);
      const petRef = doc(db, "pets", petId);
      await updateDoc(petRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Update pet error:", err);
      setError(err.message);
      throw err;
    }
  };

  const deletePet = async (petId: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "pets", petId));
    } catch (err: any) {
      console.error("Delete pet error:", err);
      setError(err.message);
      throw err;
    }
  };

  const getPet = (petId: string) => {
    return pets.find(pet => pet.id === petId);
  };

  return {
    pets,
    loading,
    error,
    addPet,
    updatePet,
    deletePet,
    getPet
  };
};
