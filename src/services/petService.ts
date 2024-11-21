import { db, storage } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Pet } from '../types';

export const fetchPets = async (): Promise<Pet[]> => {
  const snapshot = await getDocs(collection(db, 'pets'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
};

export const createPetProfile = async (petData: Omit<Pet, 'id'>, imageUri?: string): Promise<Pet> => {
  let imageUrl = '';
  if (imageUri) {
    const storageRef = ref(storage, `pets/${Date.now()}`);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    imageUrl = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, 'pets'), {
    ...petData,
    imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return { id: docRef.id, ...petData, imageUrl };
};

export const updatePetProfile = async (
  petId: string, 
  updates: Partial<Pet>, 
  newImageUri?: string
): Promise<Pet> => {
  let imageUrl = updates.imageUrl;
  if (newImageUri) {
    const storageRef = ref(storage, `pets/${petId}`);
    const response = await fetch(newImageUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    imageUrl = await getDownloadURL(storageRef);
  }

  const petRef = doc(db, 'pets', petId);
  const updatedData = {
    ...updates,
    imageUrl,
    updatedAt: new Date().toISOString()
  };
  
  await updateDoc(petRef, updatedData);
  return { id: petId, ...updatedData } as Pet;
};

export const deletePet = async (petId: string): Promise<void> => {
  await deleteDoc(doc(db, 'pets', petId));
};
