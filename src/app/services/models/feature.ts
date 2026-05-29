import { FeatureType } from './feature-type';

export interface Feature {
  id: string;
  name?: string;
  description?: string;
  type: FeatureType;
  value: string; //path to file or link
  linkThumbPath?: string; //path to link thumbnail
}
