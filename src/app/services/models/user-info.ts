import { Country } from './country';
import { Education } from './education';
import { Location } from './location';

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  education?: Education;
  showEducation: boolean;
  industry: string;
  country: Country;
  location: Location;
}
