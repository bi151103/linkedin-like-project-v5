import { inject, Injectable, signal } from '@angular/core';
import UserService from './user.service';
import { Optional } from '../models';
import { UserInfo } from './models/user-info';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);
  userInfoPromise?: Promise<UserInfo>;
  changedSinceLastRetrieve = signal<boolean>(false);

  async getUserInfo() {
    if (!this.userInfoPromise) {
      this.userInfoPromise = this.userService.getUserInfo();
    } else if (this.changedSinceLastRetrieve()) {
      this.userInfoPromise = this.userService.getUserInfo();
      this.changedSinceLastRetrieve.set(false);
    }
    return this.userInfoPromise;
  }
}
