import { Company } from './company';
import { Experience } from './experience';

export interface ExperienceData {
  id: string;
  company: Company;
  experiences: Experience[];
}
