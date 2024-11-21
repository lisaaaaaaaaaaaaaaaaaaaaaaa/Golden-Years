"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_1 = require("react");
const Navigation_1 = require("../components/layout/Navigation");
const PetList_1 = require("../components/pets/PetList");
const AddPetModal_1 = require("../components/pets/AddPetModal");
const AuthContext_1 = require("../contexts/AuthContext");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const outline_1 = require("@heroicons/react/24/outline");
function Dashboard() {
    const [pets, setPets] = (0, react_1.useState)([]);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = (0, react_1.useState)(false);
    const { user } = (0, AuthContext_1.useAuth)();
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'pets'), (0, firestore_1.where)('userId', '==', user.id));
        const unsubscribe = (0, firestore_1.onSnapshot)(q, (snapshot) => {
            const petData = [];
            snapshot.forEach((doc) => {
                petData.push(Object.assign({ id: doc.id }, doc.data()));
            });
            setPets(petData);
        });
        return () => unsubscribe();
    }, [user]);
    return (<div className="min-h-screen bg-gray-50">
      <Navigation_1.Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Pets</h1>
            <button onClick={() => setIsAddPetModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
              <outline_1.PlusIcon className="h-5 w-5 mr-2"/>
              Add Pet
            </button>
          </div>
          
          {pets.length === 0 ? (<div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pets added yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first pet.</p>
              <div className="mt-6">
                <button onClick={() => setIsAddPetModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90">
                  <outline_1.PlusIcon className="h-5 w-5 mr-2"/>
                  Add Pet
                </button>
              </div>
            </div>) : (<PetList_1.PetList pets={pets}/>)}
        </div>
      </main>

      <AddPetModal_1.AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)}/>
    </div>);
}
