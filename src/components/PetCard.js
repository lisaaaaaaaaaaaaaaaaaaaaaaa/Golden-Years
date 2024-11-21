"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetCard = PetCard;
const outline_1 = require("@heroicons/react/24/outline");
const solid_1 = require("@heroicons/react/24/solid");
const react_1 = require("react");
function PetCard({ pet }) {
    const [isFavorite, setIsFavorite] = (0, react_1.useState)(false);
    return (<div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={pet.imageUrl} alt={pet.name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <button onClick={() => setIsFavorite(!isFavorite)} className="text-red-500 hover:text-red-600">
            {isFavorite ? (<solid_1.HeartIcon className="h-6 w-6"/>) : (<outline_1.HeartIcon className="h-6 w-6"/>)}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Age: {pet.age} years</p>
        <p className="text-sm text-gray-600">{pet.breed}</p>
        <p className="mt-2 text-sm text-gray-700">{pet.description}</p>
        <div className="mt-4">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>);
}
