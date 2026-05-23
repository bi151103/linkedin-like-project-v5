import {
  Component,
  computed,
  Directive,
  effect,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NetworkNotification } from '../../services/models/network-notification';
import { GeneralNotification } from '../../services/models/general-notification';
import { Optional } from '../../models';
import { BubbleDirective } from '../../directives/bubble.directive';

export type navType = 'home' | 'network' | 'post' | 'noti' | 'job';

@Component({
  selector: 'li[appFooterItem]',
  imports: [RouterLink, BubbleDirective],
  template: `
    <ng-container>
      <a
        [routerLink]="routeLink()"
        class="text-ext-small text-primary-tx flex w-full flex-col items-center justify-center"
      >
        <img class="w-sm-img h-sm-img align-middle" src="{{ imgSrc() }}" />
        @switch (type()) {
          @case ('home') {
            <img
              src="assets/images/icons8-circle-100.png"
              class="right-15px h-20px w-20px absolute top-0"
            />
          }
          @case ('network') {
            <span appBubble>{{ networkNotificationsCount() }}</span>
          }
          @case ('noti') {
            <span appBubble>{{ generalNotificationsCount() }}</span>
          }
        }
        <p>{{ navText() }}</p>
      </a>
    </ng-container>
  `,
  host: {
    class: 'block text-center basis-1/5 min-w-1/5 relative',
  },
})
export class FooterItemComponent {
  type = input.required<navType>();
  generalNotificationsCount = input<Optional<number>>(0);
  networkNotificationsCount = input<Optional<number>>(0);

  navText = signal('Home');
  routeLink = signal('');
  imgSrc = signal('');
  constructor() {
    effect(() => {
      switch (this.type()) {
        case 'home':
          this.navText.set('Home');
          this.routeLink.set('home');
          this.imgSrc.set('assets/images/icons8-home-100.png');
          break;
        case 'network':
          this.navText.set('My network');
          this.routeLink.set('network');
          this.imgSrc.set('assets/images/icons8-people-48.png');
          break;
        case 'post':
          this.navText.set('Post');
          this.routeLink.set('post');
          this.imgSrc.set('assets/images/icons8-plus-key-100.png');
          break;
        case 'noti':
          this.navText.set('Notifications');
          this.routeLink.set('notification');
          this.imgSrc.set('assets/images/icons8-doorbell-100.png');
          break;
        case 'job':
          this.navText.set('Jobs');
          this.routeLink.set('job');
          this.imgSrc.set('assets/images/icons8-bag-100.png');
          break;
        default:
      }
    });
  }
}

@Component({
  selector: 'app-footer',
  imports: [FooterItemComponent],
  template: `
    <ng-container>
      <nav class="h-full w-full">
        <ul class="flex h-full w-full items-center justify-center">
          <li appFooterItem [type]="'home'"></li>
          <li
            appFooterItem
            [type]="'network'"
            [networkNotificationsCount]="networkNotifications()?.length"
          ></li>
          <li appFooterItem [type]="'post'"></li>
          <li
            appFooterItem
            [type]="'noti'"
            [generalNotificationsCount]="generalNotifications()?.length"
          ></li>
          <li appFooterItem [type]="'job'"></li>
        </ul>
      </nav>
    </ng-container>
  `,
  host: {
    class:
      'block h-50px border-separator-line fixed bottom-0 z-999 w-full border-t bg-white',
  },
})
export default class FooterComponent {
  networkNotifications = input<Optional<NetworkNotification[]>>([]);
  generalNotifications = input<Optional<GeneralNotification[]>>([]);
}
