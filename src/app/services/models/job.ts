import { Company } from './company';
import { Country } from './country';

export interface Job {
  id: string;
  company: Company;
  title: string;
  country: Country;
  datePost: string;
  location: Location;
}
