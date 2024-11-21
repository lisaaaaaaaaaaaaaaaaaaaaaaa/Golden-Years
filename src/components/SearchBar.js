"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = SearchBar;
const outline_1 = require("@heroicons/react/24/outline");
function SearchBar({ onSearch }) {
    return (<div className="relative max-w-xl mx-auto">
      <div className="relative">
        <input type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search pets..." onChange={(e) => onSearch(e.target.value)}/>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <outline_1.MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
        </div>
      </div>
    </div>);
}
