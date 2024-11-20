import { useEffect, useState } from 'react';
import { usePetStore } from '../../stores/petStore';
import { useAuth } from '../../contexts/AuthContext';
import { PetList } from '../pets/PetList';
import { AddPetModal } from '../pets/AddPetModal';
import { SubscriptionModal } from '../subscription/SubscriptionModal';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { ReminderList } from '../reminders/ReminderList';
import { TimelineView } from '../timeline/TimelineView';
import { generateTimeline } from '../../services/timeline';
import { Pet, TimelineEvent } from '../../types';

export function DashboardOverview() {
  const { user } = useAuth();
  const { pets, fetchPets } = usePetStore();
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const { showUpgradeModal, setShowUpgradeModal } = useSubscriptionStore();

  useEffect(() => {
    if (user) {
      fetchPets(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedPet) {
      generateTimeline(selectedPet).then(setTimeline);
    }
  }, [selectedPet]);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setIsAddPetModalOpen(true)}
          className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">My Pets</h2>
            <PetList pets={pets} onPetSelect={handlePetSelect} />
          </div>

          {selectedPet && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <AnalyticsDashboard pet={selectedPet} />
            </div>
          )}
        </div>

        <div className="space-y-8">
          {selectedPet && (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ReminderList pet={selectedPet} />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                <TimelineView events={timeline} />
              </div>
            </>
          )}
        </div>
      </div>

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}