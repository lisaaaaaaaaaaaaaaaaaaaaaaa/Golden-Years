import { db } from "../config/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export const analyticsService = {
  getWeightTrend: async (petId: string, months: number = 6) => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const q = query(
        collection(db, "healthRecords"),
        where("petId", "==", petId),
        where("type", "==", "weight"),
        where("date", ">=", startDate.toISOString()),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting weight trend:", error);
      throw error;
    }
  },

  getActivityStats: async (petId: string, days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, "activities"),
        where("petId", "==", petId),
        where("date", ">=", startDate.toISOString()),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting activity stats:", error);
      throw error;
    }
  },

  getHealthSummary: async (petId: string) => {
    try {
      // Get latest weight
      const weightQuery = query(
        collection(db, "healthRecords"),
        where("petId", "==", petId),
        where("type", "==", "weight"),
        orderBy("date", "desc"),
        limit(1)
      );

      // Get vaccination status
      const vaccinationQuery = query(
        collection(db, "healthRecords"),
        where("petId", "==", petId),
        where("type", "==", "vaccination"),
        orderBy("date", "desc")
      );

      const [weightSnapshot, vaccinationSnapshot] = await Promise.all([
        getDocs(weightQuery),
        getDocs(vaccinationQuery)
      ]);

      return {
        latestWeight: weightSnapshot.docs[0]?.data(),
        vaccinations: vaccinationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      };
    } catch (error) {
      console.error("Error getting health summary:", error);
      throw error;
    }
  },

  getMedicationAdherence: async (petId: string, days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, "medicationLogs"),
        where("petId", "==", petId),
        where("date", ">=", startDate.toISOString()),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const totalDoses = logs.length;
      const takenDoses = logs.filter(log => log.taken).length;

      return {
        adherenceRate: totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0,
        logs
      };
    } catch (error) {
      console.error("Error getting medication adherence:", error);
      throw error;
    }
  }
};
