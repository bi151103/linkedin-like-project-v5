export interface UserInfo {
  firstName: string;
  lastName: string;
  headline?: string;
  education: {
    id: string;
    institution: {
      id: string;
      educationName: string;
      educationLogoSrc: string;
    };
  };
  showEducation: false;
  industry: string;
  country: string;
  location: string;
}
