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
exports.usePetStore = void 0;
const zustand_1 = require("zustand");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
exports.usePetStore = (0, zustand_1.create)((set, get) => ({
    pets: [],
    selectedPet: null,
    loading: false,
    error: null,
    fetchPets: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'pets'), (0, firestore_1.where)('userId', '==', userId));
            const querySnapshot = yield (0, firestore_1.getDocs)(q);
            const pets = [];
            querySnapshot.forEach((doc) => {
                pets.push(Object.assign({ id: doc.id }, doc.data()));
            });
            set({ pets, loading: false });
        }
        catch (error) {
            set({ error: 'Failed to fetch pets', loading: false });
        }
    }),
    addPet: (pet) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'pets'), pet);
            const newPet = Object.assign(Object.assign({}, pet), { id: docRef.id });
            set((state) => ({ pets: [...state.pets, newPet], loading: false }));
        }
        catch (error) {
            set({ error: 'Failed to add pet', loading: false });
        }
    }),
    updatePet: (pet) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const petRef = (0, firestore_1.doc)(firebase_1.db, 'pets', pet.id);
            yield (0, firestore_1.updateDoc)(petRef, pet);
            set((state) => ({
                pets: state.pets.map((p) => (p.id === pet.id ? pet : p)),
                loading: false,
            }));
        }
        catch (error) {
            set({ error: 'Failed to update pet', loading: false });
        }
    }),
    deletePet: (petId) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, 'pets', petId));
            set((state) => ({
                pets: state.pets.filter((p) => p.id !== petId),
                loading: false,
            }));
        }
        catch (error) {
            set({ error: 'Failed to delete pet', loading: false });
        }
    }),
    selectPet: (pet) => {
        set({ selectedPet: pet });
    },
}));
