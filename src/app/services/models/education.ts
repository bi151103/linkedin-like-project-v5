import { Institution } from './institution';

export interface Education {
  id: string;
  institution: Institution;
  major: string;
  degreeType?: 'bachelor' | 'master';
  duration: {
    start: string;
    end?: string;
  };
}
