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
exports.InsuranceClaimForm = InsuranceClaimForm;
const react_1 = require("react");
const insurance_1 = require("../../services/insurance");
function InsuranceClaimForm({ policy, onClaimSubmitted }) {
    const [type, setType] = (0, react_1.useState)('');
    const [amount, setAmount] = (0, react_1.useState)('');
    const [documents, setDocuments] = (0, react_1.useState)([]);
    const [notes, setNotes] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            const claim = yield (0, insurance_1.submitClaim)(policy.id, {
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
        }
        catch (error) {
            console.error('Error submitting claim:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Claim Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
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
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-primary-dark focus:border-primary-dark" placeholder="0.00"/>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="Add any relevant notes..."/>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
        <input type="file" multiple onChange={(e) => setDocuments(Array.from(e.target.files || []))} className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary-dark file:text-white
            hover:file:bg-opacity-90"/>
      </div>

      <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Claim'}
      </button>
    </form>);
}
