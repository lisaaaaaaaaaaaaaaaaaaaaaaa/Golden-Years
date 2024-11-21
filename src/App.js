"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./contexts/AuthContext");
const SignInForm_1 = require("./components/auth/SignInForm");
const SignUpForm_1 = require("./components/auth/SignUpForm");
const AuthContext_2 = require("./contexts/AuthContext");
const react_1 = require("react");
const Dashboard = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/Dashboard'))));
const PetProfile = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/PetProfile'))));
const HealthTracking = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/HealthTracking'))));
const Settings = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/Settings'))));
function PrivateRoute({ children }) {
    const { user, loading } = (0, AuthContext_2.useAuth)();
    if (loading) {
        return <div>Loading...</div>;
    }
    return user ? <>{children}</> : <react_router_dom_1.Navigate to="/signin"/>;
}
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <AuthContext_1.AuthProvider>
        <react_1.Suspense fallback={<div>Loading...</div>}>
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/signin" element={<SignInForm_1.SignInForm />}/>
            <react_router_dom_1.Route path="/signup" element={<SignUpForm_1.SignUpForm />}/>
            <react_router_dom_1.Route path="/" element={<PrivateRoute>
                  <Dashboard />
                </PrivateRoute>}/>
            <react_router_dom_1.Route path="/pet/:id" element={<PrivateRoute>
                  <PetProfile />
                </PrivateRoute>}/>
            <react_router_dom_1.Route path="/health/:petId" element={<PrivateRoute>
                  <HealthTracking />
                </PrivateRoute>}/>
            <react_router_dom_1.Route path="/settings" element={<PrivateRoute>
                  <Settings />
                </PrivateRoute>}/>
          </react_router_dom_1.Routes>
        </react_1.Suspense>
      </AuthContext_1.AuthProvider>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
