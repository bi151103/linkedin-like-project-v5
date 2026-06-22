import { Country } from './country';
import { Relationship } from './relationship';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  headline?: string;
  relationship: Relationship;
  country: Country;
  location: Location;
}
