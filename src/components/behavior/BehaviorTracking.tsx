import { useState } from 'react';
import { Pet, BehaviorRecord } from '../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface BehaviorTrackingProps {
  pet: Pet;
  onBehaviorRecordAdded: () => void;
}

export function BehaviorTracking({ pet, onBehaviorRecordAdded }: BehaviorTrackingProps) {
  const [category, setCategory] = useState<BehaviorRecord['category']>('activity');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BehaviorRecord['severity']>('low');
  const [duration, setDuration] = useState('');
  const [triggers, setTriggers] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newRecord: BehaviorRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        category,
        description,
        severity,
        duration,
        triggers: triggers.split(',').map(t => t.trim()).filter(t => t),
        notes,
      };

      const petRef = doc(db, 'pets', pet.id);
      await updateDoc(petRef, {
        behaviorRecords: [...(pet.behaviorRecords || []), newRecord],
      });

      setDescription('');
      setDuration('');
      setTriggers('');
      setNotes('');
      onBehaviorRecordAdded();
    } catch (error) {
      console.error('Error adding behavior record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BehaviorRecord['category'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            >
              <option value="activity">Activity Level</option>
              <option value="mood">Mood</option>
              <option value="appetite">Appetite</option>
              <option value="sleep">Sleep</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as BehaviorRecord['severity'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            placeholder="Describe the behavior..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="e.g., 30 minutes, 2 hours"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Triggers</label>
            <input
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
              placeholder="Comma-separated triggers"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            placeholder="Any additional observations..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Behavior Record'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Recent Behavior Records</h3>
        <div className="mt-4 space-y-4">
          {pet.behaviorRecords?.slice(0, 5).map((record) => (
            <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium capitalize">{record.category}</p>
                  <p className="text-sm text-gray-600">{record.description}</p>
                  {record.triggers?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record.triggers.map((trigger, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-dark"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : record.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {record.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}