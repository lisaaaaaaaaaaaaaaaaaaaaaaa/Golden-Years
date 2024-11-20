import { useState } from 'react';
import { Pet, DietRecord } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface DietTrackingProps {
  pet: Pet;
  onDietRecordAdded: () => void;
}

export function DietTracking({ pet, onDietRecordAdded }: DietTrackingProps) {
  const [foodType, setFoodType] = useState('');
  const [brand, setBrand] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<'g' | 'oz' | 'cups'>('g');
  const [mealTime, setMealTime] = useState<DietRecord['mealTime']>('breakfast');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newRecord: DietRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        foodType,
        brand,
        amount: parseFloat(amount),
        unit,
        mealTime,
        notes,
        reactions: [],
      };

      const petRef = doc(db, 'pets', pet.id);
      await updateDoc(petRef, {
        dietRecords: [...(pet.dietRecords || []), newRecord],
      });

      setFoodType('');
      setBrand('');
      setAmount('');
      setNotes('');
      onDietRecordAdded();
    } catch (error) {
      console.error('Error adding diet record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Type</label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="e.g., Dry Food, Wet Food"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="Brand name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'g' | 'oz' | 'cups')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            >
              <option value="g">Grams</option>
              <option value="oz">Ounces</option>
              <option value="cups">Cups</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Time</label>
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value as DietRecord['mealTime'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            placeholder="Any additional notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Diet Record'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Recent Diet Records</h3>
        <div className="mt-4 space-y-4">
          {pet.dietRecords?.slice(0, 5).map((record) => (
            <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{record.foodType}</p>
                  <p className="text-sm text-gray-500">
                    {record.amount} {record.unit} - {record.mealTime}
                  </p>
                  {record.brand && (
                    <p className="text-sm text-gray-500">Brand: {record.brand}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
              {record.notes && (
                <p className="mt-2 text-sm text-gray-600">{record.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}