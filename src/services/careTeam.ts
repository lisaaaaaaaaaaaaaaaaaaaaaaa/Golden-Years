import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { CareTeamMember, EmergencyContact } from '../types';

export const addCareTeamMember = async (
  petId: string,
  member: Omit<CareTeamMember, 'id'>
): Promise<CareTeamMember> => {
  const memberData = {
    ...member,
    id: Date.now().toString(),
  };

  await addDoc(collection(db, `pets/${petId}/care-team`), memberData);
  return memberData;
};

export const updateCareTeamMember = async (
  petId: string,
  member: CareTeamMember
): Promise<void> => {
  const memberRef = doc(db, `pets/${petId}/care-team`, member.id);
  await updateDoc(memberRef, member);
};

export const deleteCareTeamMember = async (
  petId: string,
  memberId: string
): Promise<void> => {
  const memberRef = doc(db, `pets/${petId}/care-team`, memberId);
  await deleteDoc(memberRef);
};

export const addEmergencyContact = async (
  petId: string,
  contact: Omit<EmergencyContact, 'id'>
): Promise<EmergencyContact> => {
  const contactData = {
    ...contact,
    id: Date.now().toString(),
  };

  await addDoc(collection(db, `pets/${petId}/emergency-contacts`), contactData);
  return contactData;
};

export const updateEmergencyContact = async (
  petId: string,
  contact: EmergencyContact
): Promise<void> => {
  const contactRef = doc(db, `pets/${petId}/emergency-contacts`, contact.id);
  await updateDoc(contactRef, contact);
};

export const deleteEmergencyContact = async (
  petId: string,
  contactId: string
): Promise<void> => {
  const contactRef = doc(db, `pets/${petId}/emergency-contacts`, contactId);
  await deleteDoc(contactRef);
};