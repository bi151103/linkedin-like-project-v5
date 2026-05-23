import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { UserInfo } from './models/user-info';

@Injectable({ providedIn: 'root' })
export default class UserService extends BaseService {
  async getUserInfo() {
    const apiUrl = `${this.rootUrl}/user/info`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as UserInfo;
    return json;
  }
}
