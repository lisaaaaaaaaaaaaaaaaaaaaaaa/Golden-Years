export interface Document {
  id: string;
  fileUrl: string;
  type: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
