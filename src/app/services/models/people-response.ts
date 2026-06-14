import { Person } from './person';

export interface PeopleResponse {
  count: number;
  data: Person[];
}
