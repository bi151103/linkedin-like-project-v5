import { Injectable, signal } from '@angular/core';
import { Nullable } from '../models';

@Injectable({ providedIn: 'root' })
export default class AddFeaturedStoreService {
  imgInputFile = signal<Nullable<File>>(null);
  docInputFile = signal<Nullable<File>>(null);
  profilePageVisited = signal(false);
}
