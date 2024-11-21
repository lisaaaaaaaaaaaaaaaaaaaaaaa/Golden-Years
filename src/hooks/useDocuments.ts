import { useState, useCallback } from 'react';
import { Document } from '../types/document';
import { handleError } from '../utils/errorHandling';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useDocuments = (userId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadDocument = async (
    file: File,
    type: string,
    metadata: Record<string, unknown> = {}
  ) => {
    try {
      const storageRef = ref(storage, `documents/${userId}/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      
      const result = {
        id: storageRef.fullPath,
        fileUrl,
        type,
        metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(handleError(err));
      throw err;
    }
  };

  const deleteDocument = async (documentId: string, fileUrl: string) => {
    try {
      const storageRef = ref(storage, documentId);
      await storageRef.delete();
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError(handleError(err));
      throw err;
    }
  };

  return {
    documents,
    error,
    loading,
    uploadDocument,
    deleteDocument
  };
};
