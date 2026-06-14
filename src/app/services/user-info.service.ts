import { inject, Injectable, signal } from '@angular/core';
import UserService from './user.service';
import { Optional } from '../models';
import { UserInfo } from './models/user-info';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);
  userInfoObs$?: Observable<UserInfo>;
  changedSinceLastRetrieve = signal<boolean>(false);

  getUserInfo(): Observable<UserInfo> {
    if (!this.userInfoObs$) {
      this.userInfoObs$ = this.userService.getUserInfo();
    } else if (this.changedSinceLastRetrieve()) {
      this.userService.getUserInfo().subscribe();
      this.userInfoObs$ = this.userService.getUserInfo();
      this.changedSinceLastRetrieve.set(false);
    }
    return this.userInfoObs$;
  }
}
