"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardOverview = DashboardOverview;
const react_1 = require("react");
const petStore_1 = require("../../stores/petStore");
const AuthContext_1 = require("../../contexts/AuthContext");
const PetList_1 = require("../pets/PetList");
const AddPetModal_1 = require("../pets/AddPetModal");
const SubscriptionModal_1 = require("../subscription/SubscriptionModal");
const subscriptionStore_1 = require("../../stores/subscriptionStore");
const AnalyticsDashboard_1 = require("../analytics/AnalyticsDashboard");
const ReminderList_1 = require("../reminders/ReminderList");
const TimelineView_1 = require("../timeline/TimelineView");
const timeline_1 = require("../../services/timeline");
function DashboardOverview() {
    const { user } = (0, AuthContext_1.useAuth)();
    const { pets, fetchPets } = (0, petStore_1.usePetStore)();
    const [isAddPetModalOpen, setIsAddPetModalOpen] = (0, react_1.useState)(false);
    const [selectedPet, setSelectedPet] = (0, react_1.useState)(null);
    const [timeline, setTimeline] = (0, react_1.useState)([]);
    const { showUpgradeModal, setShowUpgradeModal } = (0, subscriptionStore_1.useSubscriptionStore)();
    (0, react_1.useEffect)(() => {
        if (user) {
            fetchPets(user.id);
        }
    }, [user]);
    (0, react_1.useEffect)(() => {
        if (selectedPet) {
            (0, timeline_1.generateTimeline)(selectedPet).then(setTimeline);
        }
    }, [selectedPet]);
    const handlePetSelect = (pet) => {
        setSelectedPet(pet);
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={() => setIsAddPetModalOpen(true)} className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
          Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">My Pets</h2>
            <PetList_1.PetList pets={pets} onPetSelect={handlePetSelect}/>
          </div>

          {selectedPet && (<div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <AnalyticsDashboard_1.AnalyticsDashboard pet={selectedPet}/>
            </div>)}
        </div>

        <div className="space-y-8">
          {selectedPet && (<>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ReminderList_1.ReminderList pet={selectedPet}/>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                <TimelineView_1.TimelineView events={timeline}/>
              </div>
            </>)}
        </div>
      </div>

      <AddPetModal_1.AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)}/>

      <SubscriptionModal_1.SubscriptionModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)}/>
    </div>);
}
