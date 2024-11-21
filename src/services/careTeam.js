"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmergencyContact = exports.updateEmergencyContact = exports.addEmergencyContact = exports.deleteCareTeamMember = exports.updateCareTeamMember = exports.addCareTeamMember = void 0;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const addCareTeamMember = (petId, member) => __awaiter(void 0, void 0, void 0, function* () {
    const memberData = Object.assign(Object.assign({}, member), { id: Date.now().toString() });
    yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, `pets/${petId}/care-team`), memberData);
    return memberData;
});
exports.addCareTeamMember = addCareTeamMember;
const updateCareTeamMember = (petId, member) => __awaiter(void 0, void 0, void 0, function* () {
    const memberRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/care-team`, member.id);
    yield (0, firestore_1.updateDoc)(memberRef, member);
});
exports.updateCareTeamMember = updateCareTeamMember;
const deleteCareTeamMember = (petId, memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const memberRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/care-team`, memberId);
    yield (0, firestore_1.deleteDoc)(memberRef);
});
exports.deleteCareTeamMember = deleteCareTeamMember;
const addEmergencyContact = (petId, contact) => __awaiter(void 0, void 0, void 0, function* () {
    const contactData = Object.assign(Object.assign({}, contact), { id: Date.now().toString() });
    yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, `pets/${petId}/emergency-contacts`), contactData);
    return contactData;
});
exports.addEmergencyContact = addEmergencyContact;
const updateEmergencyContact = (petId, contact) => __awaiter(void 0, void 0, void 0, function* () {
    const contactRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/emergency-contacts`, contact.id);
    yield (0, firestore_1.updateDoc)(contactRef, contact);
});
exports.updateEmergencyContact = updateEmergencyContact;
const deleteEmergencyContact = (petId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    const contactRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/emergency-contacts`, contactId);
    yield (0, firestore_1.deleteDoc)(contactRef);
});
exports.deleteEmergencyContact = deleteEmergencyContact;
