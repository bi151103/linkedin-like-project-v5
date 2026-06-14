import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageNotification } from '../../services/models/message-notification';
import { Optional } from '../../models';
import { BubbleDirective } from '../../directives/bubble.directive';
import ProfileService from '../../services/profile.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, BubbleDirective],
  template: `
    <ng-container>
      <div class="min-w-50px basis-50px h-3/5">
        <a routerLink="/" class="flex h-full w-full justify-center">
          <img
            class="aspect-square h-full"
            src="assets/images/icons8-profile-100.png"
          />
        </a>
      </div>
      <div
        class="flex h-3/5 basis-[calc(100%-100px)] items-center bg-[#edf3f8]"
      >
        <img
          class="ml-10px aspect-square h-3/5"
          src="assets/images/icons8-search-100.png"
        />
        <input
          (click)="onOpenSearchComboboxDialog()"
          type="text"
          name="search"
          class="pl-5px pr-10px text-medium pt-[4px] font-bold outline-none"
          placeholder="Search"
        />
      </div>
      <div class="min-w-50px basis-50px h-3/5">
        <a
          routerLink="/message"
          class="relative flex h-full w-full justify-center"
        >
          <img
            class="aspect-square h-full"
            src="assets/images/icons8-chat-bubble-100.png"
          />
          @if (messageNotifications()) {
            <span appBubble adjustedRightPositionClass="right-5px">{{
              messageNotifications()?.length
            }}</span>
          }
        </a>
      </div>
    </ng-container>
  `,
  host: {
    class:
      'w-full h-50px flex items-center bg-white border-b border-separator-line fixed top-0 z-999',
  },
})
export default class HeaderComponent {
  profileService = inject(ProfileService);

  onShowSearchComboboxDialog = output();
  messageNotifications = signal<Optional<MessageNotification[]>>([]);

  onOpenSearchComboboxDialog() {
    this.onShowSearchComboboxDialog.emit();
  }

  constructor() {
    this.profileService.getMessageNotifications().subscribe((data) => {
      this.messageNotifications.set(data.data);
    });
  }
}
