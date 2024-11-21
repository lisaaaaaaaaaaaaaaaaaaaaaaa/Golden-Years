#!/bin/bash

# 1. Update DietTracking.tsx
cat > src/components/diet/DietTracking.tsx << 'END'
import React, { useState } from 'react';
import { DietRecord, NewDietRecord } from '../../types';

interface DietTrackingProps {
  records: DietRecord[];
  onAddRecord: (record: NewDietRecord) => Promise<void>;
}

export const DietTracking: React.FC<DietTrackingProps> = ({ records, onAddRecord }) => {
  const [mealTime, setMealTime] = useState<DietRecord['mealTime']>('breakfast');
  const [foodType, setFoodType] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<string>('cups');
  const [brand, setBrand] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!records.length || !amount) return;

    const newRecord: NewDietRecord = {
      petId: records[0].petId,
      foodType,
      mealTime,
      amount: Number(amount),
      unit,
      brand: brand || undefined
    };

    await onAddRecord(newRecord);
    setFoodType('');
    setAmount('');
    setBrand('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <select
          value={mealTime}
          onChange={(e) => setMealTime(e.target.value as DietRecord['mealTime'])}
          className="block w-full"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <input
          type="text"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          placeholder="Food Type"
          className="block w-full mt-2"
        />

        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="block flex-1"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="block w-24"
          >
            <option value="cups">Cups</option>
            <option value="grams">Grams</option>
            <option value="ounces">Ounces</option>
          </select>
        </div>

        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand (optional)"
          className="block w-full mt-2"
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 mt-4">
          Add Record
        </button>
      </form>

      <div className="mt-6">
        {records.map(record => (
          <div key={record.id} className="bg-white p-4 rounded shadow mb-2">
            <p className="font-medium">{record.foodType}</p>
            <p className="text-sm text-gray-600">
              {record.amount} {record.unit} - {record.mealTime}
            </p>
            {record.brand && (
              <p className="text-sm text-gray-500">Brand: {record.brand}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
END

# 2. Update DocumentUpload.tsx
cat > src/components/documents/DocumentUpload.tsx << 'END'
import React, { useState } from 'react';
import { NewDocument } from '../../types';

interface DocumentUploadProps {
  onUpload: (document: NewDocument) => Promise<void>;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newDocument: NewDocument = {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
        uploadDate: new Date().toISOString()
      };
      await onUpload(newDocument);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full"
      />
      {uploading && <p className="text-gray-500">Uploading...</p>}
    </div>
  );
};
END

# 3. Update InsuranceClaimForm.tsx
cat > src/components/insurance/InsuranceClaimForm.tsx << 'END'
import React, { useState } from 'react';
import { NewInsuranceClaim } from '../../types';

interface InsuranceClaimFormProps {
  onSubmit: (claim: NewInsuranceClaim) => Promise<void>;
}

export const InsuranceClaimForm: React.FC<InsuranceClaimFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !amount) return;

    const claim: NewInsuranceClaim = {
      type,
      amount: Number(amount),
      date: new Date().toISOString(),
      description
    };

    await onSubmit(claim);
    setType('');
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Claim Type"
        className="block w-full"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="block w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="block w-full"
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        Submit Claim
      </button>
    </form>
  );
};
END

# 4. Update PetCard.tsx
cat > src/components/PetCard.tsx << 'END'
import React from 'react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg"
    >
      <div className="flex items-center space-x-4">
        {pet.imageUrl && (
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={pet.imageUrl}
            alt={pet.name}
          />
        )}
        <div>
          <h3 className="text-lg font-medium">{pet.name}</h3>
          <p className="text-sm text-gray-500">
            {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
          </p>
        </div>
      </div>
    </div>
  );
};
END

# Make the script executable and run it
chmod +x fix2.sh
./fix2.sh
