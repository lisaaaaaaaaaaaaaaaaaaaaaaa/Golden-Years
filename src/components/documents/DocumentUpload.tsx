"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUpload = DocumentUpload;
const react_1 = require("react");
const firebase_1 = require("../../config/firebase");
const storage_1 = require("firebase/storage");
function DocumentUpload({ petId, onUpload }) {
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const [title, setTitle] = (0, react_1.useState)('');
    const [type, setType] = (0, react_1.useState)('medical');
    const handleFileUpload = (event) => __awaiter(this, void 0, void 0, function* () {
        let _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        setUploading(true);
        try {
            const storageRef = (0, storage_1.ref)(firebase_1.storage, `documents/${petId}/${Date.now()}-${file.name}`);
            yield (0, storage_1.uploadBytes)(storageRef, file);
            const url = yield (0, storage_1.getDownloadURL)(storageRef);
            const document = {
                id: Date.now().toString(),
                type,
                title: title || file.name,
                url,
                uploadDate: new Date().toISOString(),
                tags: [type],
            };
            onUpload(document);
            setTitle('');
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setUploading(false);
        }
    });
    return (<div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Document Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm" placeholder="Enter document title"/>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Document Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm">
          <option value="medical">Medical Record</option>
          <option value="insurance">Insurance</option>
          <option value="registration">Registration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload File</label>
        <input type="file" onChange={handleFileUpload} disabled={uploading} className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary-dark file:text-white
            hover:file:bg-opacity-90"/>
      </div>

      {uploading && (<div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-primary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-sm text-gray-500">Uploading...</span>
        </div>)}
    </div>);
}
