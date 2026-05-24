import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { UserInfo } from './models/user-info';

@Injectable({ providedIn: 'root' })
export default class UserService extends BaseService {
  async getUserInfo(): Promise<UserInfo> {
    const apiUrl = `${this.rootUrl}/user/info`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as UserInfo;
    return json;
  }

  async updateUserInfo(userInfo: UserInfo): Promise<void> {
    const apiUrl = `${this.rootUrl}/user/info`;
    console.log(userInfo);
    const request = new Request(apiUrl, {
      body: JSON.stringify(userInfo),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetch(request);
  }
}
