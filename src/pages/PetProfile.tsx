import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Pet, MedicalRecord, Medication, Vaccination } from '../types';
import { Camera, CameraResultType } from '@capacitor/camera';
import { scheduleReminder } from '../services/notifications';

export default function PetProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [newVaccination, setNewVaccination] = useState<Partial<Vaccination>>({});

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      const petDoc = await getDoc(doc(db, 'pets', id));
      if (petDoc.exists()) {
        setPet({ id: petDoc.id, ...petDoc.data() } as Pet);
      }
      setLoading(false);
    };
    fetchPet();
  }, [id]);

  const updatePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      if (image.webPath && pet) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const photoRef = ref(storage, `pets/${pet.id}/${Date.now()}`);
        await uploadBytes(photoRef, blob);
        const photoUrl = await getDownloadURL(photoRef);

        const petRef = doc(db, 'pets', pet.id);
        await updateDoc(petRef, {
          photoUrl
        });

        setPet({ ...pet, photoUrl });
      }
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  const addMedication = async () => {
    if (!pet || !newMedication.name) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name || '',
      dosage: newMedication.dosage || '',
      frequency: newMedication.frequency || '',
      startDate: newMedication.startDate || new Date().toISOString(),
      endDate: newMedication.endDate,
      reminderEnabled: true
    };

    const petRef = doc(db, 'pets', pet.id);
    await updateDoc(petRef, {
      medications: [...pet.medications, medication]
    });

    if (medication.reminderEnabled) {
      await scheduleReminder(
        'Medication Reminder',
        `Time for ${pet.name}'s ${medication.name}`,
        new Date(medication.startDate)
      );
    }

    setPet({ ...pet, medications: [...pet.medications, medication] });
    setNewMedication({});
    setShowAddMedication(false);
  };

  const addVaccination = async () => {
    if (!pet || !newVaccination.name) return;

    const vaccination: Vaccination = {
      id: Date.now().toString(),
      name: newVaccination.name || '',
      date: newVaccination.date || new Date().toISOString(),
      nextDueDate: newVaccination.nextDueDate || '',
      reminderEnabled: true
    };

    const petRef = doc(db, 'pets', pet.id);
    await updateDoc(petRef, {
      vaccinations: [...pet.vaccinations, vaccination]
    });

    if (vaccination.reminderEnabled && vaccination.nextDueDate) {
      await scheduleReminder(
        'Vaccination Reminder',
        `${pet.name}'s ${vaccination.name} vaccination due soon`,
        new Date(vaccination.nextDueDate)
      );
    }

    setPet({ ...pet, vaccinations: [...pet.vaccinations, vaccination] });
    setNewVaccination({});
    setShowAddVaccination(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={pet.photoUrl || '/default-pet.png'}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={updatePhoto}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{pet.name}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Breed</p>
              <p className="font-medium">{pet.breed}</p>
            </div>
            <div>
              <p className="text-gray-600">Age</p>
              <p className="font-medium">
                {new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} years
              </p>
            </div>
            <div>
              <p className="text-gray-600">Weight</p>
              <p className="font-medium">{pet.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium capitalize">{pet.type}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Medications</h2>
              <button
                onClick={() => setShowAddMedication(true)}
                className="bg-primary-dark text-white px-4 py-2 rounded-lg"
              >
                Add Medication
              </button>
            </div>
            {showAddMedication && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <input
                  type="text"
                  placeholder="Medication name"
                  value={newMedication.name || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={newMedication.dosage || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={newMedication.frequency || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end">
                  <button
                    onClick={addMedication}
                    className="bg-primary-dark text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {pet.medications.map((medication) => (
                <div key={medication.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{medication.name}</h3>
                    <span className="text-sm text-gray-500">{medication.frequency}</span>
                  </div>
                  <p className="text-sm text-gray-600">{medication.dosage}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vaccinations</h2>
              <button
                onClick={() => setShowAddVaccination(true)}
                className="bg-primary-dark text-white px-4 py-2 rounded-lg"
              >
                Add Vaccination
              </button>
            </div>
            {showAddVaccination && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <input
                  type="text"
                  placeholder="Vaccination name"
                  value={newVaccination.name || ''}
                  onChange={(e) => setNewVaccination({ ...newVaccination, name: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="date"
                  value={newVaccination.date?.split('T')[0] || ''}
                  onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="Next due date"
                  value={newVaccination.nextDueDate?.split('T')[0] || ''}
                  onChange={(e) => setNewVaccination({ ...newVaccination, nextDueDate: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end">
                  <button
                    onClick={addVaccination}
                    className="bg-primary-dark text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {pet.vaccinations.map((vaccination) => (
                <div key={vaccination.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{vaccination.name}</h3>
                    <span className="text-sm text-gray-500">
                      Next due: {new Date(vaccination.nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Last given: {new Date(vaccination.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}