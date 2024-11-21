export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  createdAt: string;
  subscription?: {
    status: 'active' | 'inactive' | 'cancelled';
    plan: string;
    validUntil: string;
  };
}
