import { inject, Injectable } from '@angular/core';
import UserService from './user.service';
import { Optional } from '../models';
import { UserInfo } from './models/user-info';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);
  userInfoPromise?: Promise<UserInfo>;

  async getUserInfo() {
    if (!this.userInfoPromise) {
      this.userInfoPromise = this.userService.getUserInfo();
    }
    return this.userInfoPromise;
  }
}
