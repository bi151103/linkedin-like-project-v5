import { Component, inject, signal } from '@angular/core';
import UserInfoService from '../../services/user-info.service';
import { Nullable } from '../../models';
import { UserInfo } from '../../services/models/user-info';
import ButtonComponent from '../../components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ButtonComponent, RouterLink],
  template: `<ng-container>
    <div
      class="h-50px border-separator-line fixed top-0 flex w-full items-center border-b bg-white"
    >
      <button appButton routerLink="/"></button>
      <h1 class="text-emphasis-tx px-15px">Edit Intro</h1>
      <button
        disabled
        class="min-w-50px px-15px disabled:text-disabled-tx ml-auto text-inherit"
      >
        Save
      </button>
    </div>
  </ng-container>`,
  host: {
    class: 'block pt-50px h-screen bg-white',
  },
})
export default class EditProfilePage {
  userInfoService = inject(UserInfoService);
  userInfo = signal<Nullable<UserInfo>>(null);
}
