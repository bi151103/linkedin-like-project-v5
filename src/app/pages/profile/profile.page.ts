import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import HeaderComponent from '../../components/header/header.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import FooterComponent from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import UserInfoService from '../../services/user-info.service';
import { UserInfo } from '../../services/models/user-info';
import { Nullable } from '../../models';
import ProfileNamePipe from '../../pipes/profile-name.pipe';
import ProfileService from '../../services/profile.service';
import { ExperienceData } from '../../services/models/experience-data';
import { ConnectionResponse } from '../../services/models/connection-response';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
    RouterLink,
    ProfileNamePipe,
  ],
  template: `
    <app-header
      (onShowSearchComboboxDialog)="showSearchComboboxDialog()"
    ></app-header>
    <ng-container>
      <section class="relative">
        <img
          src="assets/images/background-image-cut.jpg"
          class="w-full bg-white align-middle"
        />
        <a routerLink="/my-preference"
          ><img
            src="assets/images/icons8-setting-100.png"
            class="p-5px absolute top-0 right-0 mt-[15px] mr-[15px] aspect-square w-[25px] rounded-full bg-white"
        /></a>
      </section>
    </ng-container>
    <ng-container>
      <section class="flex h-[40px] w-full bg-white">
        <a class="w-min" routerLink="add-profile">
          <div class="relative ml-[15px] h-full w-[120px]">
            <div
              class="border-primary-tx absolute bottom-0 flex h-3/1 w-full flex-col items-center justify-center rounded-full border-2 border-double bg-white"
            >
              <img class="w-50px" src="assets/images/icons8-camera-100.png" />
              <span class="text-[0.8em]">Add Photo</span>
            </div>
          </div>
        </a>
        <div class="ml-auto flex h-full w-[90px] items-end justify-around">
          <button
            #shareBtn
            (click)="shareProfileInfo()"
            [attr.data-title]="'LinkedIn: Profile of Phuc Dang'"
            data-text="'Check out Phuc Dang's profile on LinkedIn'"
            data-url="https://linkedin.com/in/dang-phan-minh-phuc"
          >
            <img
              src="assets/images/icons8-share-100.png"
              class="aspect-square w-[25px]"
            />
          </button>
          <a routerLink="edit-profile">
            <img
              src="assets/images/icons8-edit-100.png"
              class="aspect-square w-[25px]"
            />
          </a>
        </div>
      </section>
    </ng-container>
    <ng-container>
      <section class="px-15px bg-white py-[25px]">
        <h1 class="text-emphasis-tx">
          {{
            { firstName: userInfo()?.firstName, lastName: userInfo()?.lastName }
              | profileName
          }}
        </h1>
        <p>{{ userInfo()?.headline ?? '' }}</p>
        <p>{{ recentCompanyExp() }}</p>
        <p>
          {{ userInfo()?.country }}<span class="dot"></span>
          <a routerLink="connection"
            >{{ connectionCount() }}
            {{ connectionCount() === 1 ? 'Connection' : 'Connections' }}
          </a>
        </p>
      </section>
    </ng-container>
    <app-footer></app-footer>
    <div appOverlay>
      <app-dialog
        [isVisible]="searchDialogVisible()"
        (closeDialog)="hideSearchComboboxDialog()"
      >
        <app-search-combobox-dialog></app-search-combobox-dialog>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'block py-50px',
  },
})
export class ProfilePage {
  searchDialogVisible = signal(false);
  userInfoService = inject(UserInfoService);
  profileService = inject(ProfileService);
  userInfo = signal<Nullable<UserInfo>>(null);
  experiences = signal<ExperienceData[]>([]);
  connectionCount = signal<number>(0);
  recentCompanyExp = signal('');
  shareProfileBtn = viewChild.required<ElementRef<HTMLElement>>('shareBtn');

  constructor() {
    this.userInfoService.getUserInfo().then((data) => {
      this.userInfo.set(data);
    });
    this.profileService.getExperiences().then((data) => {
      this.experiences.set(data);
      this.recentCompanyExp.set(
        this.experiences().sort(
          (a, b) =>
            new Date(b.experiences[0].duration.start).getTime() -
            new Date(a.experiences[0].duration.start).getTime(),
        )[0].company.companyName,
      );
    });
    this.profileService.getConnections().then((data) => {
      this.connectionCount.set(data.count);
    });
  }

  showSearchComboboxDialog() {
    this.searchDialogVisible.set(true);
  }
  hideSearchComboboxDialog() {
    this.searchDialogVisible.set(false);
  }
  async shareProfileInfo() {
    try {
      const shareData = {
        title: this.shareProfileBtn().nativeElement.dataset['title'],
        text: this.shareProfileBtn().nativeElement.dataset['text'],
        url: this.shareProfileBtn().nativeElement.dataset['url'],
      };
      await navigator.share(shareData);
    } catch (e) {
      console.error('The browser does not support the sharing with navigator');
    }
  }
}
