import { Education } from './education';

export interface UserInfo {
  firstName: string;
  lastName: string;
  headline?: string;
  education?: Education;
  showEducation: boolean;
  industry: string;
  country: string;
  location: string;
}
