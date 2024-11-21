import { db } from "../config/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  addDoc,
  Timestamp 
} from "firebase/firestore";

export interface AnalyticsData {
  petId: string;
  type: "weight" | "activity" | "medication" | "health";
  value: number;
  date: Timestamp;
  metadata?: any;
}

export const analyticsService = {
  trackEvent: async (data: AnalyticsData) => {
    try {
      await addDoc(collection(db, "analytics"), {
        ...data,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error("Error tracking analytics event:", error);
      throw error;
    }
  },

  getWeightTrend: async (petId: string, months: number = 6) => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const q = query(
        collection(db, "analytics"),
        where("petId", "==", petId),
        where("type", "==", "weight"),
        where("date", ">=", startDate),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting weight trend:", error);
      throw error;
    }
  },

  getMedicationAdherence: async (petId: string) => {
    try {
      const q = query(
        collection(db, "analytics"),
        where("petId", "==", petId),
        where("type", "==", "medication"),
        orderBy("date", "desc"),
        limit(30)
      );

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => doc.data());
      
      const total = records.length;
      const taken = records.filter(r => r.metadata?.taken).length;

      return {
        adherenceRate: total > 0 ? (taken / total) * 100 : 0,
        records
      };
    } catch (error) {
      console.error("Error getting medication adherence:", error);
      throw error;
    }
  },

  getHealthMetrics: async (petId: string) => {
    try {
      const q = query(
        collection(db, "analytics"),
        where("petId", "==", petId),
        where("type", "==", "health"),
        orderBy("date", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting health metrics:", error);
      throw error;
    }
  }
};
