import { db } from "../config/firebase";
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

export interface CareTeamMember {
  id?: string;
  petId: string;
  name: string;
  role: string;
  specialty?: string;
  facility?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export const careTeamService = {
  addMember: async (member: CareTeamMember) => {
    try {
      const docRef = await addDoc(collection(db, "careTeam"), {
        ...member,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...member };
    } catch (error) {
      console.error("Error adding care team member:", error);
      throw error;
    }
  },

  updateMember: async (id: string, updates: Partial<CareTeamMember>) => {
    try {
      const memberRef = doc(db, "careTeam", id);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating care team member:", error);
      throw error;
    }
  },

  deleteMember: async (id: string) => {
    try {
      await deleteDoc(doc(db, "careTeam", id));
    } catch (error) {
      console.error("Error deleting care team member:", error);
      throw error;
    }
  },

  getTeamMembers: async (petId: string) => {
    try {
      const q = query(
        collection(db, "careTeam"),
        where("petId", "==", petId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting care team members:", error);
      throw error;
    }
  },

  searchBySpecialty: async (specialty: string, location?: string) => {
    try {
      let q = query(
        collection(db, "careTeam"),
        where("specialty", "==", specialty)
      );

      if (location) {
        q = query(q, where("location", "==", location));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error searching care team members:", error);
      throw error;
    }
  }
};
