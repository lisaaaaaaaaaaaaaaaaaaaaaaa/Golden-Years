import { useState, useEffect } from "react";
import { analyticsService } from "../services/analytics";
import { useAuth } from "./useAuth";

export interface AnalyticsMetrics {
  weightTrend: any[];
  activityStats: any[];
  medicationAdherence: number;
  healthMetrics: any[];
}

export const useAnalytics = (petId: string) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    weightTrend: [],
    activityStats: [],
    medicationAdherence: 0,
    healthMetrics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !petId) return;
    
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [
          weightData,
          adherenceData,
          healthData
        ] = await Promise.all([
          analyticsService.getWeightTrend(petId),
          analyticsService.getMedicationAdherence(petId),
          analyticsService.getHealthMetrics(petId),
        ]);

        setMetrics({
          weightTrend: weightData,
          activityStats: [], // To be implemented
          medicationAdherence: adherenceData.adherenceRate,
          healthMetrics: healthData,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [petId, user]);

  const trackEvent = async (eventType: string, data: any) => {
    try {
      await analyticsService.trackEvent({
        petId,
        type: eventType,
        ...data,
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      const [
        weightData,
        adherenceData,
        healthData
      ] = await Promise.all([
        analyticsService.getWeightTrend(petId),
        analyticsService.getMedicationAdherence(petId),
        analyticsService.getHealthMetrics(petId),
      ]);

      setMetrics({
        weightTrend: weightData,
        activityStats: [], // To be implemented
        medicationAdherence: adherenceData.adherenceRate,
        healthMetrics: healthData,
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    error,
    trackEvent,
    refreshMetrics,
  };
};
