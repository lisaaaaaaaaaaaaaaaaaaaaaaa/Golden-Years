"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPetModal = AddPetModal;
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const AuthContext_1 = require("../../contexts/AuthContext");
const firebase_1 = require("../../config/firebase");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const camera_1 = require("@capacitor/camera");
function AddPetModal({ isOpen, onClose }) {
    const { user } = (0, AuthContext_1.useAuth)();
    const [name, setName] = (0, react_1.useState)('');
    const [type, setType] = (0, react_1.useState)('dog');
    const [breed, setBreed] = (0, react_1.useState)('');
    const [birthDate, setBirthDate] = (0, react_1.useState)('');
    const [weight, setWeight] = (0, react_1.useState)('');
    const [photo, setPhoto] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const takePicture = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const image = yield camera_1.Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: camera_1.CameraResultType.Uri
            });
            setPhoto(image.webPath || null);
        }
        catch (error) {
            console.error('Error taking photo:', error);
        }
    });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!user)
            return;
        setLoading(true);
        try {
            let photoUrl = '';
            if (photo) {
                const response = yield fetch(photo);
                const blob = yield response.blob();
                const photoRef = (0, storage_1.ref)(firebase_1.storage, `pets/${user.id}/${Date.now()}`);
                yield (0, storage_1.uploadBytes)(photoRef, blob);
                photoUrl = yield (0, storage_1.getDownloadURL)(photoRef);
            }
            yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'pets'), {
                userId: user.id,
                name,
                type,
                breed,
                birthDate,
                weight: parseFloat(weight),
                photoUrl,
                createdAt: new Date().toISOString(),
                medicalRecords: [],
                medications: [],
                vaccinations: []
            });
            onClose();
            setName('');
            setType('dog');
            setBreed('');
            setBirthDate('');
            setWeight('');
            setPhoto(null);
        }
        catch (error) {
            console.error('Error adding pet:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (<react_2.Transition appear show={isOpen} as={react_1.Fragment}>
      <react_2.Dialog as="div" className="relative z-10" onClose={onClose}>
        <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
        </react_2.Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <react_2.Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <react_2.Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add New Pet
                </react_2.Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      {photo && (<img src={photo} alt="Pet preview" className="h-20 w-20 rounded-full object-cover"/>)}
                      <button type="button" onClick={takePicture} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Take Photo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Breed
                    </label>
                    <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Birth Date
                    </label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-dark rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50">
                      {loading ? 'Adding...' : 'Add Pet'}
                    </button>
                  </div>
                </form>
              </react_2.Dialog.Panel>
            </react_2.Transition.Child>
          </div>
        </div>
      </react_2.Dialog>
    </react_2.Transition>);
}
