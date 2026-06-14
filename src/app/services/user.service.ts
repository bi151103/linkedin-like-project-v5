import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { UserInfo } from './models/user-info';
import { UpdateResponse } from './models/update-response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class UserService extends BaseService {
  getUserInfo(): Observable<UserInfo> {
    const apiUrl = `${this.rootUrl}/user/info`;
    return this.http.get<UserInfo>(apiUrl);
  }

  updateUserInfo(userInfo: UserInfo): Observable<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/user/info`;
    return this.http.post<UpdateResponse>(apiUrl, userInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
