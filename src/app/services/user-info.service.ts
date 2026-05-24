import { inject, Injectable } from '@angular/core';
import UserService from './user.service';
import { Optional } from '../models';
import { UserInfo } from './models/user-info';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);
  userInfo: Optional<UserInfo> = undefined;

  async getUserInfo() {
    if (!this.userInfo) {
      this.userInfo = await this.userService.getUserInfo();
    }
    return this.userInfo;
  }
}
