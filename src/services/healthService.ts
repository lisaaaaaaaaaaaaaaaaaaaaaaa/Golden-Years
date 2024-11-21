import { db } from '../config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { HealthRecord } from '../types/health';

export const healthService = {
  async getRecords(petId: string): Promise<HealthRecord[]> {
    const q = query(collection(db, 'healthRecords'), where('petId', '==', petId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthRecord));
  },

  async createRecord(petId: string, data: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
    const docRef = await addDoc(collection(db, 'healthRecords'), {
      ...data,
      petId,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data } as HealthRecord;
  },

  async updateRecord(recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> {
    const docRef = doc(db, 'healthRecords', recordId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { id: recordId, ...updates } as HealthRecord;
  }
};
