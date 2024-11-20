import { useState } from 'react';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Document } from '../../types';

interface DocumentUploadProps {
  petId: string;
  onUpload: (document: Document) => void;
}

export function DocumentUpload({ petId, onUpload }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Document['type']>('medical');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `documents/${petId}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const document: Document = {
        id: Date.now().toString(),
        type,
        title: title || file.name,
        url,
        uploadDate: new Date().toISOString(),
        tags: [type],
      };

      onUpload(document);
      setTitle('');
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Document Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
          placeholder="Enter document title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Document['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
        >
          <option value="medical">Medical Record</option>
          <option value="insurance">Insurance</option>
          <option value="registration">Registration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary-dark file:text-white
            hover:file:bg-opacity-90"
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-primary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-sm text-gray-500">Uploading...</span>
        </div>
      )}
    </div>
  );
}