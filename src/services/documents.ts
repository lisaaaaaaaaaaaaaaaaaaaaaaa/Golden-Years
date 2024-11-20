import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Document } from '../types';

export const uploadDocument = async (
  petId: string,
  file: File,
  metadata: Omit<Document, 'id' | 'url'>
): Promise<Document> => {
  const storageRef = ref(storage, `documents/${petId}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const documentData: Document = {
    ...metadata,
    id: Date.now().toString(),
    url,
    uploadDate: new Date().toISOString(),
  };

  await addDoc(collection(db, `pets/${petId}/documents`), documentData);
  return documentData;
};

export const updateDocument = async (
  petId: string,
  document: Document
): Promise<void> => {
  const docRef = doc(db, `pets/${petId}/documents`, document.id);
  await updateDoc(docRef, document);
};

export const deleteDocument = async (
  petId: string,
  document: Document
): Promise<void> => {
  // Delete from Storage
  const storageRef = ref(storage, document.url);
  await deleteObject(storageRef);

  // Delete from Firestore
  const docRef = doc(db, `pets/${petId}/documents`, document.id);
  await deleteDoc(docRef);
};