import { Nullable } from '../../models';

export interface CreateFeatureRequest {
  name: string;
  description?: string;
  type: 'link' | 'media';
  value?: string;
  file?: Nullable<File>;
}
