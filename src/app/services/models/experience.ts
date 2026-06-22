import { Country } from './country';

export interface Experience {
  id: string;
  position: string;
  duration: {
    start: string;
    end?: string;
  };
  country: Country;
  description?: string;
  location: Location;
}
