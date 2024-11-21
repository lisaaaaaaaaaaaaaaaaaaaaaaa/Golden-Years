"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetList = PetList;
const PetCard_1 = require("./PetCard");
function PetList({ pets }) {
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (<PetCard_1.PetCard key={pet.id} pet={pet}/>))}
    </div>);
}
