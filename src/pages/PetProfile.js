"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PetProfile;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebase_1 = require("../config/firebase");
const camera_1 = require("@capacitor/camera");
const notifications_1 = require("../services/notifications");
function PetProfile() {
    var _a, _b;
    const { id } = (0, react_router_dom_1.useParams)();
    const [pet, setPet] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [showAddMedication, setShowAddMedication] = (0, react_1.useState)(false);
    const [showAddVaccination, setShowAddVaccination] = (0, react_1.useState)(false);
    const [newMedication, setNewMedication] = (0, react_1.useState)({});
    const [newVaccination, setNewVaccination] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const fetchPet = () => __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return;
            const petDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'pets', id));
            if (petDoc.exists()) {
                setPet(Object.assign({ id: petDoc.id }, petDoc.data()));
            }
            setLoading(false);
        });
        fetchPet();
    }, [id]);
    const updatePhoto = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const image = yield camera_1.Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: camera_1.CameraResultType.Uri
            });
            if (image.webPath && pet) {
                const response = yield fetch(image.webPath);
                const blob = yield response.blob();
                const photoRef = (0, storage_1.ref)(firebase_1.storage, `pets/${pet.id}/${Date.now()}`);
                yield (0, storage_1.uploadBytes)(photoRef, blob);
                const photoUrl = yield (0, storage_1.getDownloadURL)(photoRef);
                const petRef = (0, firestore_1.doc)(firebase_1.db, 'pets', pet.id);
                yield (0, firestore_1.updateDoc)(petRef, {
                    photoUrl
                });
                setPet(Object.assign(Object.assign({}, pet), { photoUrl }));
            }
        }
        catch (error) {
            console.error('Error updating photo:', error);
        }
    });
    const addMedication = () => __awaiter(this, void 0, void 0, function* () {
        if (!pet || !newMedication.name)
            return;
        const medication = {
            id: Date.now().toString(),
            name: newMedication.name || '',
            dosage: newMedication.dosage || '',
            frequency: newMedication.frequency || '',
            startDate: newMedication.startDate || new Date().toISOString(),
            endDate: newMedication.endDate,
            reminderEnabled: true
        };
        const petRef = (0, firestore_1.doc)(firebase_1.db, 'pets', pet.id);
        yield (0, firestore_1.updateDoc)(petRef, {
            medications: [...pet.medications, medication]
        });
        if (medication.reminderEnabled) {
            yield (0, notifications_1.scheduleReminder)('Medication Reminder', `Time for ${pet.name}'s ${medication.name}`, new Date(medication.startDate));
        }
        setPet(Object.assign(Object.assign({}, pet), { medications: [...pet.medications, medication] }));
        setNewMedication({});
        setShowAddMedication(false);
    });
    const addVaccination = () => __awaiter(this, void 0, void 0, function* () {
        if (!pet || !newVaccination.name)
            return;
        const vaccination = {
            id: Date.now().toString(),
            name: newVaccination.name || '',
            date: newVaccination.date || new Date().toISOString(),
            nextDueDate: newVaccination.nextDueDate || '',
            reminderEnabled: true
        };
        const petRef = (0, firestore_1.doc)(firebase_1.db, 'pets', pet.id);
        yield (0, firestore_1.updateDoc)(petRef, {
            vaccinations: [...pet.vaccinations, vaccination]
        });
        if (vaccination.reminderEnabled && vaccination.nextDueDate) {
            yield (0, notifications_1.scheduleReminder)('Vaccination Reminder', `${pet.name}'s ${vaccination.name} vaccination due soon`, new Date(vaccination.nextDueDate));
        }
        setPet(Object.assign(Object.assign({}, pet), { vaccinations: [...pet.vaccinations, vaccination] }));
        setNewVaccination({});
        setShowAddVaccination(false);
    });
    if (loading)
        return <div>Loading...</div>;
    if (!pet)
        return <div>Pet not found</div>;
    return (<div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img src={pet.photoUrl || '/default-pet.png'} alt={pet.name} className="w-full h-full object-cover"/>
          <button onClick={updatePhoto} className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
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
              <button onClick={() => setShowAddMedication(true)} className="bg-primary-dark text-white px-4 py-2 rounded-lg">
                Add Medication
              </button>
            </div>
            {showAddMedication && (<div className="bg-gray-50 p-4 rounded-lg mb-4">
                <input type="text" placeholder="Medication name" value={newMedication.name || ''} onChange={(e) => setNewMedication(Object.assign(Object.assign({}, newMedication), { name: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" placeholder="Dosage" value={newMedication.dosage || ''} onChange={(e) => setNewMedication(Object.assign(Object.assign({}, newMedication), { dosage: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" placeholder="Frequency" value={newMedication.frequency || ''} onChange={(e) => setNewMedication(Object.assign(Object.assign({}, newMedication), { frequency: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <div className="flex justify-end">
                  <button onClick={addMedication} className="bg-primary-dark text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>)}
            <div className="space-y-2">
              {pet.medications.map((medication) => (<div key={medication.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{medication.name}</h3>
                    <span className="text-sm text-gray-500">{medication.frequency}</span>
                  </div>
                  <p className="text-sm text-gray-600">{medication.dosage}</p>
                </div>))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vaccinations</h2>
              <button onClick={() => setShowAddVaccination(true)} className="bg-primary-dark text-white px-4 py-2 rounded-lg">
                Add Vaccination
              </button>
            </div>
            {showAddVaccination && (<div className="bg-gray-50 p-4 rounded-lg mb-4">
                <input type="text" placeholder="Vaccination name" value={newVaccination.name || ''} onChange={(e) => setNewVaccination(Object.assign(Object.assign({}, newVaccination), { name: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <input type="date" value={((_a = newVaccination.date) === null || _a === void 0 ? void 0 : _a.split('T')[0]) || ''} onChange={(e) => setNewVaccination(Object.assign(Object.assign({}, newVaccination), { date: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <input type="date" placeholder="Next due date" value={((_b = newVaccination.nextDueDate) === null || _b === void 0 ? void 0 : _b.split('T')[0]) || ''} onChange={(e) => setNewVaccination(Object.assign(Object.assign({}, newVaccination), { nextDueDate: e.target.value }))} className="w-full mb-2 p-2 border rounded"/>
                <div className="flex justify-end">
                  <button onClick={addVaccination} className="bg-primary-dark text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>)}
            <div className="space-y-2">
              {pet.vaccinations.map((vaccination) => (<div key={vaccination.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{vaccination.name}</h3>
                    <span className="text-sm text-gray-500">
                      Next due: {new Date(vaccination.nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Last given: {new Date(vaccination.date).toLocaleDateString()}
                  </p>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
