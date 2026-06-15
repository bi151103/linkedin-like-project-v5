import { Industry } from './industry';

export interface Company {
  companyId: string;
  companyName: string;
  companyLogoSrc?: string;
  companyIndustry: Industry;
}
