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
exports.calculateCoverage = exports.updatePolicy = exports.submitClaim = void 0;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const firebase_2 = require("../config/firebase");
const storage_1 = require("firebase/storage");
const submitClaim = (policyId, claim, documents) => __awaiter(void 0, void 0, void 0, function* () {
    // Upload documents
    const uploadedDocs = [];
    for (const file of documents) {
        const storageRef = (0, storage_1.ref)(firebase_2.storage, `insurance-claims/${policyId}/${Date.now()}-${file.name}`);
        yield (0, storage_1.uploadBytes)(storageRef, file);
        const url = yield (0, storage_1.getDownloadURL)(storageRef);
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
    const claimData = Object.assign(Object.assign({}, claim), { id: Date.now().toString(), status: 'submitted', documents: uploadedDocs });
    yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'insurance-claims'), claimData);
    return claimData;
});
exports.submitClaim = submitClaim;
const updatePolicy = (policy) => __awaiter(void 0, void 0, void 0, function* () {
    const policyRef = (0, firestore_1.doc)(firebase_1.db, 'insurance-policies', policy.id);
    yield (0, firestore_1.updateDoc)(policyRef, policy);
});
exports.updatePolicy = updatePolicy;
const calculateCoverage = (policy, amount, type) => {
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
exports.calculateCoverage = calculateCoverage;
