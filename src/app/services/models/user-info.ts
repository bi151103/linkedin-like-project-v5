import { Education } from './education';

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  education?: Education;
  showEducation: boolean;
  industry: string;
  country: string;
  location: string;
}
