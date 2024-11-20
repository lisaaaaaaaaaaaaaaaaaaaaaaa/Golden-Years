export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  description: string;
  imageUrl: string;
  type: 'dog' | 'cat' | 'other';
}