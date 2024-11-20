import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Pet } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { scheduleReminder } from '../services/notifications';

export default function HealthTracking() {
  const { petId } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [weight, setWeight] = useState('');
  const [symptom, setSymptom] = useState('');
  const [painLevel, setPainLevel] = useState('1');

  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      const petDoc = await getDoc(doc(db, 'pets', petId));
      if (petDoc.exists()) {
        setPet({ id: petDoc.id, ...petDoc.data() } as Pet);
      }
    };
    fetchPet();
  }, [petId]);

  const addHealthRecord = async (type: 'weight' | 'symptom' | 'pain') => {
    if (!pet || !petId) return;

    const timestamp = new Date().toISOString();
    const petRef = doc(db, 'pets', petId);
    const newRecord = {
      date: timestamp,
      type,
      value: type === 'weight' ? parseFloat(weight) : type === 'pain' ? parseInt(painLevel) : symptom,
    };

    await updateDoc(petRef, {
      healthRecords: [...(pet.healthRecords || []), newRecord],
    });

    // Schedule reminder for next check
    await scheduleReminder(
      'Health Check Reminder',
      `Time to check ${pet.name}'s ${type}`,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
  };

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{pet.name}'s Health Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weight Tracking</h2>
          <div className="mb-4">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter weight (kg)"
            />
            <button
              onClick={() => addHealthRecord('weight')}
              className="mt-2 bg-primary-dark text-white px-4 py-2 rounded"
            >
              Add Weight
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pet.healthRecords?.filter(r => r.type === 'weight') || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7CA5B8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Symptom Tracking</h2>
          <div className="mb-4">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter symptom"
            />
            <button
              onClick={() => addHealthRecord('symptom')}
              className="mt-2 bg-primary-dark text-white px-4 py-2 rounded"
            >
              Add Symptom
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Recent Symptoms</h3>
            <ul className="space-y-2">
              {pet.healthRecords?.filter(r => r.type === 'symptom').map((record, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {new Date(record.date).toLocaleDateString()}: {record.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pain Level Tracking</h2>
          <div className="mb-4">
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">
              Pain Level: {painLevel} / 10
            </div>
            <button
              onClick={() => addHealthRecord('pain')}
              className="mt-2 bg-primary-dark text-white px-4 py-2 rounded"
            >
              Record Pain Level
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pet.healthRecords?.filter(r => r.type === 'pain') || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#A9DBB8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}