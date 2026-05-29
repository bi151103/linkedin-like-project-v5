import { Nullable } from '../../models';
import { MediaType } from './media-type';

export interface CreateFeatureRequest {
  name: string;
  description?: string;
  type: 'link' | MediaType;
  value?: string;
  file?: Nullable<File>;
}
