export interface Event {
  id: number;
  name: string;
  categoryId: number;
  location: string;
  dateEvent: Date;
  description: string;
  createdAt?: Date;
}
