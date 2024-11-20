import { useState } from 'react';
import { InsurancePolicy, InsuranceClaim } from '../../types';
import { submitClaim } from '../../services/insurance';
import { DocumentUpload } from '../documents/DocumentUpload';

interface InsuranceClaimFormProps {
  policy: InsurancePolicy;
  onClaimSubmitted: (claim: InsuranceClaim) => void;
}

export function InsuranceClaimForm({ policy, onClaimSubmitted }: InsuranceClaimFormProps) {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const claim = await submitClaim(policy.id, {
        policyId: policy.id,
        date: new Date().toISOString(),
        type,
        amount: parseFloat(amount),
        notes,
        documents: [],
      }, documents);

      onClaimSubmitted(claim);
      setType('');
      setAmount('');
      setDocuments([]);
      setNotes('');
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Claim Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        >
          <option value="">Select type</option>
          <option value="medical">Medical Treatment</option>
          <option value="medication">Medication</option>
          <option value="surgery">Surgery</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-primary-dark focus:border-primary-dark"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
          placeholder="Add any relevant notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
        <input
          type="file"
          multiple
          onChange={(e) => setDocuments(Array.from(e.target.files || []))}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary-dark file:text-white
            hover:file:bg-opacity-90"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Claim'}
      </button>
    </form>
  );
}