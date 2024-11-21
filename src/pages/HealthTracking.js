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
exports.default = HealthTracking;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const recharts_1 = require("recharts");
const notifications_1 = require("../services/notifications");
function HealthTracking() {
    var _a, _b, _c;
    const { petId } = (0, react_router_dom_1.useParams)();
    const [pet, setPet] = (0, react_1.useState)(null);
    const [weight, setWeight] = (0, react_1.useState)(&apos;&apos;);
    const [symptom, setSymptom] = (0, react_1.useState)(&apos;&apos;);
    const [painLevel, setPainLevel] = (0, react_1.useState)(&apos;1&apos;);
    (0, react_1.useEffect)(() => {
        const fetchPet = () => __awaiter(this, void 0, void 0, function* () {
            if (!petId)
                return;
            const petDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, &apos;pets&apos;, petId));
            if (petDoc.exists()) {
                setPet(Object.assign({ id: petDoc.id }, petDoc.data()));
            }
        });
        fetchPet();
    }, [petId]);
    const addHealthRecord = (type) => __awaiter(this, void 0, void 0, function* () {
        if (!pet || !petId)
            return;
        const timestamp = new Date().toISOString();
        const petRef = (0, firestore_1.doc)(firebase_1.db, &apos;pets&apos;, petId);
        const newRecord = {
            date: timestamp,
            type,
            value: type === &apos;weight&apos; ? parseFloat(weight) : type === &apos;pain&apos; ? parseInt(painLevel) : symptom,
        };
        yield (0, firestore_1.updateDoc)(petRef, {
            healthRecords: [...(pet.healthRecords || []), newRecord],
        });
        // Schedule reminder for next check
        yield (0, notifications_1.scheduleReminder)(&apos;Health Check Reminder&apos;, `Time to check ${pet.name}&apos;s ${type}`, new Date(Date.now() + 24 * 60 * 60 * 1000));
    });
    if (!pet)
        return <div>Loading...</div>;
    return (<div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{pet.name}&apos;s Health Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weight Tracking</h2>
          <div className="mb-4">
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter weight (kg)"/>
            <button onClick={() => addHealthRecord(&apos;weight&apos;)} className="mt-2 bg-primary-dark text-white px-4 py-2 rounded">
              Add Weight
            </button>
          </div>
          <recharts_1.ResponsiveContainer width="100%" height={200}>
            <recharts_1.LineChart data={((_a = pet.healthRecords) === null || _a === void 0 ? void 0 : _a.filter(r => r.type === &apos;weight&apos;)) || []}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="date"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Line type="monotone" dataKey="value" stroke="#7CA5B8"/>
            </recharts_1.LineChart>
          </recharts_1.ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Symptom Tracking</h2>
          <div className="mb-4">
            <input type="text" value={symptom} onChange={(e) => setSymptom(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter symptom"/>
            <button onClick={() => addHealthRecord(&apos;symptom&apos;)} className="mt-2 bg-primary-dark text-white px-4 py-2 rounded">
              Add Symptom
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Recent Symptoms</h3>
            <ul className="space-y-2">
              {(_b = pet.healthRecords) === null || _b === void 0 ? void 0 : _b.filter(r => r.type === &apos;symptom&apos;).map((record, index) => (<li key={index} className="text-sm text-gray-600">
                  {new Date(record.date).toLocaleDateString()}: {record.value}
                </li>))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pain Level Tracking</h2>
          <div className="mb-4">
            <input type="range" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(e.target.value)} className="w-full"/>
            <div className="text-sm text-gray-600 mt-1">
              Pain Level: {painLevel} / 10
            </div>
            <button onClick={() => addHealthRecord(&apos;pain&apos;)} className="mt-2 bg-primary-dark text-white px-4 py-2 rounded">
              Record Pain Level
            </button>
          </div>
          <recharts_1.ResponsiveContainer width="100%" height={200}>
            <recharts_1.LineChart data={((_c = pet.healthRecords) === null || _c === void 0 ? void 0 : _c.filter(r => r.type === &apos;pain&apos;)) || []}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="date"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Line type="monotone" dataKey="value" stroke="#A9DBB8"/>
            </recharts_1.LineChart>
          </recharts_1.ResponsiveContainer>
        </div>
      </div>
    </div>);
}
