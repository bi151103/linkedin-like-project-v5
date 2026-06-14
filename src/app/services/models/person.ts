export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  headline?: string;
  relationship: {
    connected: boolean; //true: 1st
    hasConnectionInCommon: boolean; //true: 2nd; false: 3rd
    connectedAt?: string;
  };
  country: string;
  location: string;
}
