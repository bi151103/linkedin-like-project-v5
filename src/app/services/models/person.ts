import { Relationship } from './relationship';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  headline?: string;
  relationship: Relationship;
  country: string;
  location: string;
}
