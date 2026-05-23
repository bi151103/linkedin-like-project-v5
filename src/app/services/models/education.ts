export interface Education {
  id: string;
  institution: {
    id: string;
    educationName: string;
    educationLogoSrc?: string;
  };
  major: string;
  degreeType?: 'bachelor' | 'master';
  duration: {
    start: string;
    end?: string;
  };
}
