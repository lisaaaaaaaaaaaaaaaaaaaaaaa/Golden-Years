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
  orderBy 
} from "firebase/firestore";

export interface InsurancePolicy {
  id?: string;
  petId: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  startDate: string;
  endDate: string;
  premium: number;
  deductible: number;
  documents?: string[];
  metadata?: any;
}

export interface InsuranceClaim {
  id?: string;
  policyId: string;
  petId: string;
  date: string;
  amount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  documents?: string[];
  metadata?: any;
}

export const insuranceService = {
  addPolicy: async (policy: InsurancePolicy) => {
    try {
      const docRef = await addDoc(collection(db, "insurance"), {
        ...policy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...policy };
    } catch (error) {
      console.error("Error adding insurance policy:", error);
      throw error;
    }
  },

  updatePolicy: async (id: string, updates: Partial<InsurancePolicy>) => {
    try {
      const policyRef = doc(db, "insurance", id);
      await updateDoc(policyRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating insurance policy:", error);
      throw error;
    }
  },

  deletePolicy: async (id: string) => {
    try {
      await deleteDoc(doc(db, "insurance", id));
    } catch (error) {
      console.error("Error deleting insurance policy:", error);
      throw error;
    }
  },

  getPolicies: async (petId: string) => {
    try {
      const q = query(
        collection(db, "insurance"),
        where("petId", "==", petId),
        orderBy("startDate", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting insurance policies:", error);
      throw error;
    }
  },

  submitClaim: async (claim: InsuranceClaim) => {
    try {
      const docRef = await addDoc(collection(db, "claims"), {
        ...claim,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...claim };
    } catch (error) {
      console.error("Error submitting insurance claim:", error);
      throw error;
    }
  },

  updateClaim: async (id: string, updates: Partial<InsuranceClaim>) => {
    try {
      const claimRef = doc(db, "claims", id);
      await updateDoc(claimRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating insurance claim:", error);
      throw error;
    }
  },

  getClaims: async (policyId: string) => {
    try {
      const q = query(
        collection(db, "claims"),
        where("policyId", "==", policyId),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting insurance claims:", error);
      throw error;
    }
  }
};
