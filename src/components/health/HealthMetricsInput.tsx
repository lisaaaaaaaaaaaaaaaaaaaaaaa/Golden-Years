import { useState } from 'react';
import { Pet } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface HealthMetricsInputProps {
  pet: Pet;
  onMetricAdded: () => void;
}

export function HealthMetricsInput({ pet, onMetricAdded }: HealthMetricsInputProps) {
  const [weight, setWeight] = useState('');
  const [painLevel, setPainLevel] = useState('1');
  const [symptom, setSymptom] = useState('');
  const [loading, setLoading] = useState(false);

  const addHealthRecord = async (type: 'weight' | 'pain' | 'symptom') => {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const newRecord = {
        id: Date.now().toString(),
        date: timestamp,
        type,
        value: type === 'weight' ? parseFloat(weight) : 
               type === 'pain' ? parseInt(painLevel) : 
               symptom,
        recordedBy: 'owner',
      };

      const petRef = doc(db, 'pets', pet.id);
      await updateDoc(petRef, {
        healthRecords: [...(pet.healthRecords || []), newRecord],
      });

      setWeight('');
      setPainLevel('1');
      setSymptom('');
      onMetricAdded();
    } catch (error) {
      console.error('Error adding health record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Add Health Metrics</h3>
        <p className="text-sm text-gray-500">Track your pet's health measurements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 rounded-md border-gray-300 focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="Enter weight"
            />
            <button
              onClick={() => addHealthRecord('weight')}
              disabled={loading || !weight}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Pain Level (1-10)</label>
          <div className="mt-1">
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
            <button
              onClick={() => addHealthRecord('pain')}
              disabled={loading}
              className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
            >
              Record Pain Level
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Symptoms</label>
          <div className="mt-1">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="Describe symptoms"
            />
            <button
              onClick={() => addHealthRecord('symptom')}
              disabled={loading || !symptom}
              className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
            >
              Add Symptom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}