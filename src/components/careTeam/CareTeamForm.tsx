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
exports.CareTeamForm = CareTeamForm;
const react_1 = require("react");
const careTeam_1 = require("../../services/careTeam");
function CareTeamForm({ petId, onMemberAdded }) {
    const [name, setName] = (0, react_1.useState)('');
    const [type, setType] = (0, react_1.useState)('vet');
    const [organization, setOrganization] = (0, react_1.useState)('');
    const [phone, setPhone] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            const member = yield (0, careTeam_1.addCareTeamMember)(petId, {
                type,
                name,
                organization,
                phone,
                email,
                primaryContact: false,
            });
            onMemberAdded(member);
            setName('');
            setOrganization('');
            setPhone('');
            setEmail('');
        }
        catch (error) {
            console.error('Error adding care team member:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
          <option value="vet">Veterinarian</option>
          <option value="groomer">Groomer</option>
          <option value="trainer">Trainer</option>
          <option value="sitter">Pet Sitter</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
        <input id="organization" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"/>
      </div>

      <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Care Team Member'}
      </button>
    </form>);
}
