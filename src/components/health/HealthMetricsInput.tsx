import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface HealthMetricsInputProps {
  pet: {
    id: string;
  };
  loading?: boolean;
  onSubmit?: () => void;
}

export const HealthMetricsInput: React.FC<HealthMetricsInputProps> = ({ pet, loading = false, onSubmit }) => {
  const [weight, setWeight] = useState('');
  const [painLevel, setPainLevel] = useState('1');
  const [symptom, setSymptom] = useState('');

  const addHealthRecord = async (type: 'weight' | 'pain' | 'symptom') => {
    try {
      const record = {
        value: type === 'weight' ? parseFloat(weight) :
          type === 'pain' ? parseInt(painLevel) :
          symptom,
        recordedBy: 'owner',
      };

      const petRef = doc(db, 'pets', pet.id);
      await petRef.update({
        healthRecords: [...(pet.healthRecords || []), record]
      });

      setWeight('');
      setPainLevel('1');
      setSymptom('');
      
      onSubmit?.();
    } catch (error) {
      console.error('Error adding health record:', error);
    }
  };

  return (
    <View className="space-y-6">
      <View>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight (in lbs)"
          keyboardType="numeric"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
        />
        <Button
          onPress={() => addHealthRecord('weight')}
          disabled={loading || !weight}
          title="Add Weight"
        />
      </View>

      <View>
        <TextInput
          value={painLevel}
          onChangeText={setPainLevel}
          placeholder="Pain Level (1-10)"
          keyboardType="numeric"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
        />
        <Button
          onPress={() => addHealthRecord('pain')}
          disabled={loading}
          title="Add Pain Level"
        />
      </View>

      <View>
        <TextInput
          value={symptom}
          onChangeText={setSymptom}
          placeholder="Symptom Description"
          multiline
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
        />
        <Button
          onPress={() => addHealthRecord('symptom')}
          disabled={loading || !symptom}
          title="Add Symptom"
        />
      </View>
    </View>
  );
};
