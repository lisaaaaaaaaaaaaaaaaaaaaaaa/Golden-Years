import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { InsurancePolicy, InsuranceClaim, Document } from '../types';

export const submitClaim = async (
  policyId: string,
  claim: Omit<InsuranceClaim, 'id' | 'status'>,
  documents: File[]
): Promise<InsuranceClaim> => {
  // Upload documents
  const uploadedDocs: Document[] = [];
  
  for (const file of documents) {
    const storageRef = ref(storage, `insurance-claims/${policyId}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    uploadedDocs.push({
      id: Date.now().toString(),
      type: 'insurance',
      title: file.name,
      url,
      uploadDate: new Date().toISOString(),
      tags: ['insurance-claim'],
    });
  }

  // Create claim
  const claimData: InsuranceClaim = {
    ...claim,
    id: Date.now().toString(),
    status: 'submitted',
    documents: uploadedDocs,
  };

  await addDoc(collection(db, 'insurance-claims'), claimData);
  
  return claimData;
};

export const updatePolicy = async (
  policy: InsurancePolicy
): Promise<void> => {
  const policyRef = doc(db, 'insurance-policies', policy.id);
  await updateDoc(policyRef, policy);
};

export const calculateCoverage = (
  policy: InsurancePolicy,
  amount: number,
  type: string
): { covered: number; deductible: number } => {
  const coverage = policy.coverage.find(c => c.type === type);
  
  if (!coverage) {
    return { covered: 0, deductible: 0 };
  }

  const deductible = coverage.deductible;
  const limit = coverage.limit;
  
  // Calculate covered amount after deductible
  let covered = Math.max(0, amount - deductible);
  
  // Apply coverage limit
  covered = Math.min(covered, limit);
  
  return { covered, deductible };
};