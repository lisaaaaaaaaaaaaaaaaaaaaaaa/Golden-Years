export interface Document {
  id: string;
  url: string;
  type: string;
  metadata: {
    name: string;
    size: number;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}
