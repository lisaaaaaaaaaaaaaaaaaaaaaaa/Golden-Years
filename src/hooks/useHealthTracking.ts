import { useState, useCallback } from 'react';
import { HealthRecord } from '../types/health';
import { handleError } from '../utils/errorHandling';
import { healthService } from '../services/healthService';

export const useHealthTracking = (petId: string) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await healthService.getRecords(petId);
      setRecords(data);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [petId]);

  const addRecord = useCallback(async (recordData: Omit<HealthRecord, 'id'>) => {
    try {
      setLoading(true);
      const newRecord = await healthService.createRecord(petId, recordData);
      setRecords(prev => [...prev, newRecord]);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [petId]);

  const updateRecord = useCallback(async (recordId: string, updates: Partial<HealthRecord>) => {
    try {
      setLoading(true);
      const updatedRecord = await healthService.updateRecord(recordId, updates);
      setRecords(prev =>
        prev.map(record =>
          record.id === recordId ? updatedRecord : record
        )
      );
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    records,
    error,
    loading,
    fetchRecords,
    addRecord,
    updateRecord
  };
};
