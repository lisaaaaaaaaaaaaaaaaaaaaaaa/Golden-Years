import { useState } from 'react';
import { CareTeamMember } from '../../types';
import { addCareTeamMember } from '../../services/careTeam';

interface CareTeamFormProps {
  petId: string;
  onMemberAdded: (member: CareTeamMember) => void;
}

export function CareTeamForm({ petId, onMemberAdded }: CareTeamFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CareTeamMember['type']>('vet');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const member = await addCareTeamMember(petId, {
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
    } catch (error) {
      console.error('Error adding care team member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select <boltAction type="file" filePath="src/components/careTeam/CareTeamForm.tsx">
          value={type}
          onChange={(e) => setType(e.target.value as CareTeamMember['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        >
          <option value="vet">Veterinarian</option>
          <option value="groomer">Groomer</option>
          <option value="trainer">Trainer</option>
          <option value="sitter">Pet Sitter</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Organization</label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Care Team Member'}
      </button>
    </form>
  );
}