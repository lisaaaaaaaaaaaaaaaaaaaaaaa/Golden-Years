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
exports.deleteDocument = exports.updateDocument = exports.uploadDocument = void 0;
const firebase_1 = require("../config/firebase");
const storage_1 = require("firebase/storage");
const firestore_1 = require("firebase/firestore");
const uploadDocument = (petId, file, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    const storageRef = (0, storage_1.ref)(firebase_1.storage, `documents/${petId}/${Date.now()}-${file.name}`);
    yield (0, storage_1.uploadBytes)(storageRef, file);
    const url = yield (0, storage_1.getDownloadURL)(storageRef);
    const documentData = Object.assign(Object.assign({}, metadata), { id: Date.now().toString(), url, uploadDate: new Date().toISOString() });
    yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, `pets/${petId}/documents`), documentData);
    return documentData;
});
exports.uploadDocument = uploadDocument;
const updateDocument = (petId, document) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/documents`, document.id);
    yield (0, firestore_1.updateDoc)(docRef, document);
});
exports.updateDocument = updateDocument;
const deleteDocument = (petId, document) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete from Storage
    const storageRef = (0, storage_1.ref)(firebase_1.storage, document.url);
    yield (0, storage_1.deleteObject)(storageRef);
    // Delete from Firestore
    const docRef = (0, firestore_1.doc)(firebase_1.db, `pets/${petId}/documents`, document.id);
    yield (0, firestore_1.deleteDoc)(docRef);
});
exports.deleteDocument = deleteDocument;
