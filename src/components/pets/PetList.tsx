import { Link } from 'react-router-dom';
import { Pet } from '../../types';
import { format } from 'date-fns';

interface PetListProps {
  pets: Pet[];
}

export function PetList({ pets }: PetListProps) {
  const calculateAge = (birthDate: string) => {
    const years = Math.floor(
      (new Date().getTime() - new Date(birthDate).getTime()) / 31536000000
    );
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid- <boltAction type="file" filePath="src/components/pets/PetList.tsx">cols-3">
      {pets.map((pet) => (
        <Link
          key={pet.id}
          to={`/pet/${pet.id}`}
          className="block hover:shadow-lg transition-shadow duration-200"
        >
          <div className="bg-white overflow-hidden rounded-lg shadow">
            <div className="h-48 w-full relative">
              <img
                src={pet.photoUrl || '/default-pet.png'}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-xl font-semibold text-white">{pet.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                  <p className="text-sm text-gray-500">
                    Age: {calculateAge(pet.birthDate)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-primary-light text-primary-dark">
                  {pet.type}
                </span>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Weight: {pet.weight}kg</span>
                <span>Added: {format(new Date(pet.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}