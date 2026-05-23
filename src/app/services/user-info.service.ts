import { inject, Injectable } from '@angular/core';
import UserService from './user.service';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);

  async getUserInfo() {
    return await this.userService.getUserInfo();
  }
}
