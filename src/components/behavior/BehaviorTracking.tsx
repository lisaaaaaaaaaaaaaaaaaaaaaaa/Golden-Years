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
exports.BehaviorTracking = BehaviorTracking;
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../config/firebase");
function BehaviorTracking({ pet, onBehaviorRecordAdded }) {
    let _a;
    const [category, setCategory] = (0, react_1.useState)('activity');
    const [description, setDescription] = (0, react_1.useState)('');
    const [severity, setSeverity] = (0, react_1.useState)('low');
    const [duration, setDuration] = (0, react_1.useState)('');
    const [triggers, setTriggers] = (0, react_1.useState)('');
    const [notes, setNotes] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            const newRecord = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                category,
                description,
                severity,
                duration,
                triggers: triggers.split(',').map(t => t.trim()).filter(t => t),
                notes,
            };
            const petRef = (0, firestore_1.doc)(firebase_1.db, 'pets', pet.id);
            yield (0, firestore_1.updateDoc)(petRef, {
                behaviorRecords: [...(pet.behaviorRecords || []), newRecord],
            });
            setDescription('');
            setDuration('');
            setTriggers('');
            setNotes('');
            onBehaviorRecordAdded();
        }
        catch (error) {
            console.error('Error adding behavior record:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
              <option value="activity">Activity Level</option>
              <option value="mood">Mood</option>
              <option value="appetite">Appetite</option>
              <option value="sleep">Sleep</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="Describe the behavior..."/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="e.g., 30 minutes, 2 hours"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Triggers</label>
            <input type="text" value={triggers} onChange={(e) => setTriggers(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="Comma-separated triggers"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="Any additional observations..."/>
        </div>

        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Behavior Record'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Recent Behavior Records</h3>
        <div className="mt-4 space-y-4">
          {(_a = pet.behaviorRecords) === null || _a === void 0 ? void 0 : _a.slice(0, 5).map((record) => {
            let _a;
            return (<div key={record.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium capitalize">{record.category}</p>
                  <p className="text-sm text-gray-600">{record.description}</p>
                  {((_a = record.triggers) === null || _a === void 0 ? void 0 : _a.length) > 0 && (<div className="mt-2 flex flex-wrap gap-2">
                      {record.triggers.map((trigger, index) => (<span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-dark">
                          {trigger}
                        </span>))}
                    </div>)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.severity === 'high'
                    ? 'bg-red-100 text-red-800'
                    : record.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'}`}>
                    {record.severity}
                  </span>
                </div>
              </div>
            </div>);
        })}
        </div>
      </div>
    </div>);
}
