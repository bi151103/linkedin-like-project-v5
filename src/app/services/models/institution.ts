import { Country } from './country';

export interface Institution {
  id: string;
  educationName: string;
  educationLogoSrc?: string;
  country: Country;
  location: Location;
}
