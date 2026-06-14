import { Company } from './company';

export interface Job {
  id: string;
  company: Company;
  title: string;
  location: string;
  datePost: string;
}
