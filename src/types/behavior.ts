export interface BehaviorRecord {
  id: string;
  date: string;
  category: 'activity' | 'aggression' | 'anxiety' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  notes?: string;
}
