import { db, storage } from "../config/firebase";
import { 
  collection, 
  doc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

export interface PetDocument {
  id?: string;
  petId: string;
  type: "medical" | "vaccination" | "insurance" | "other";
  title: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
}

export const documentsService = {
  uploadDocument: async (file: any, petId: string, type: string, metadata: any) => {
    try {
      // Create storage reference
      const storageRef = ref(storage, `documents/${petId}/${Date.now()}_${file.name}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Add document record to Firestore
      const docRef = await addDoc(collection(db, "documents"), {
        petId,
        type,
        title: file.name,
        fileUrl: downloadUrl,
        fileName: file.name,
        fileType: file.type,
        metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return {
        id: docRef.id,
        fileUrl: downloadUrl
      };
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  updateDocument: async (id: string, updates: Partial<PetDocument>) => {
    try {
      const docRef = doc(db, "documents", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  deleteDocument: async (id: string, fileUrl: string) => {
    try {
      // Delete from Storage
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, "documents", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  getDocuments: async (petId: string, type?: string) => {
    try {
      let q = query(
        collection(db, "documents"),
        where("petId", "==", petId)
      );

      if (type) {
        q = query(q, where("type", "==", type));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  }
};
