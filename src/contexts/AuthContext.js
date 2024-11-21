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
exports.useAuth = void 0;
exports.AuthProvider = AuthProvider;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const AuthContext = (0, react_1.createContext)(null);
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, auth_1.onAuthStateChanged)(firebase_1.auth, (firebaseUser) => __awaiter(this, void 0, void 0, function* () {
            if (firebaseUser) {
                const userDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }
            }
            else {
                setUser(null);
            }
            setLoading(false);
        }));
        return unsubscribe;
    }, []);
    const signUp = (email, password, name) => __awaiter(this, void 0, void 0, function* () {
        const { user: firebaseUser } = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const userData = {
            id: firebaseUser.uid,
            email,
            name,
            subscriptionStatus: 'free'
        };
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid), userData);
        setUser(userData);
    });
    const signIn = (email, password) => __awaiter(this, void 0, void 0, function* () {
        yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
    });
    const signInWithGoogle = () => __awaiter(this, void 0, void 0, function* () {
        const provider = new auth_1.GoogleAuthProvider();
        const { user: firebaseUser } = yield (0, auth_1.signInWithPopup)(firebase_1.auth, provider);
        const userDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) {
            const userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                subscriptionStatus: 'free'
            };
            yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid), userData);
            setUser(userData);
        }
    });
    const signOut = () => __awaiter(this, void 0, void 0, function* () {
        yield (0, auth_1.signOut)(firebase_1.auth);
        setUser(null);
    });
    return (<AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>);
}
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
