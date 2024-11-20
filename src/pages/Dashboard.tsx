import { useEffect, useState } from 'react';
import { Navigation } from '../components/layout/Navigation';
import { PetList } from '../components/pets/PetList';
import { AddPetModal } from '../components/pets/AddPetModal';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Pet } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'pets'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const petData: Pet[] = [];
      snapshot.forEach((doc) => {
        petData.push({ id: doc.id, ...doc.data() } as Pet);
      });
      setPets(petData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Pets</h1>
            <button
              onClick={() => setIsAddPetModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Pet
            </button>
          </div>
          
          {pets.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pets added yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first pet.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddPetModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Pet
                </button>
              </div>
            </div>
          ) : (
            <PetList pets={pets} />
          )}
        </div>
      </main>

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
      />
    </div>
  );
}