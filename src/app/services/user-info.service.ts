import { inject, Injectable, signal } from '@angular/core';
import UserService from './user.service';
import { Optional } from '../models';
import { UserInfo } from './models/user-info';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class UserInfoService {
  userService = inject(UserService);
  changedSinceLastRetrieve = signal<boolean>(false);
  userInfo$?: Observable<UserInfo>;

  getUserInfo(): Observable<UserInfo> {
    if (!this.userInfo$) {
      this.userInfo$ = this.userService.getUserInfo().pipe(shareReplay(1));
    }
    if (this.changedSinceLastRetrieve()) {
      this.userInfo$ = this.userService.getUserInfo().pipe(shareReplay(1));
      this.changedSinceLastRetrieve.set(false);
    }
    return this.userInfo$;
  }
}
