export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  userId: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
