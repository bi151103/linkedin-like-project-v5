export interface Relationship {
  connected: boolean; //true: 1st
  hasConnectionInCommon: boolean; //true: 2nd; false: 3rd
  connectedAt?: string;
}
