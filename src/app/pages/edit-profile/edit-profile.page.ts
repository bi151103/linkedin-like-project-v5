import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import UserInfoService from '../../services/user-info.service';
import { Nullable } from '../../models';
import { UserInfo } from '../../services/models/user-info';
import { Router } from '@angular/router';
import ProfileInputComponent from '../../components/profile-input/profile-input.component';
import ProfileService from '../../services/profile.service';
import { Education } from '../../services/models/education';
import FullscreenLoadingComponent from '../../components/fullscreen-loading/fullscreen-loading.component';
import { UpdateResponse } from '../../services/models/update-response';
import ToastNotificationComponent from '../../components/toast-notification/toast-notification.component';
import EditPageHeaderComponent from '../../components/edit-page-header/edit-page-header.component';
import FormDirective from '../../directives/form.directive';
import UserService from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [
    ProfileInputComponent,
    FullscreenLoadingComponent,
    EditPageHeaderComponent,
    FormDirective,
  ],
  template: `
    <app-fullscreen-loading [isVisible]="saving()"></app-fullscreen-loading>
    <ng-container>
      <app-edit-page-header
        type="edit-profile"
        (saveClick)="saveProfileChanges()"
        (backClick)="form.onLeaveForm($event)"
        [isSaveBtnDisabled]="!isFormValid() || !form.isDirty()"
      ></app-edit-page-header>
      <form class="px-15px py-10px bg-white" appForm #form="appForm">
        <app-profile-input
          type="firstName"
          [inputValue]="userInfo()?.firstName ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #firstName
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="lastName"
          [inputValue]="userInfo()?.lastName ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #lastName
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="headline"
          [inputValue]="userInfo()?.headline ?? ''"
          [clearable]="true"
          (dirty)="form.isDirty.set(true)"
          #headline
        ></app-profile-input>
        <!-- Business constraint: If the educations list is empty, it means the profile hasn't added any education to the profile info, then we should hide the education and Show education checkbox field-->
        @if (educationList().length) {
          <app-profile-input
            type="education"
            [inputValue]="
              userInfo()?.education?.institution?.educationName ?? ''
            "
            [educationList]="educationList()"
            #education
            (dirty)="form.isDirty.set(true)"
          ></app-profile-input>
          <div class="mt-10px px-5px flex items-center">
            <input
              id="education-check"
              class="h-[2rem] w-[2rem] align-middle"
              type="checkbox"
              name="educationShow"
              (change)="form.isDirty.set(true)"
              [checked]="userInfo()?.showEducation"
              #educationShow
            />
            <label class="ml-10px text-emphasis-tx" for="education-check"
              >Show education in my intro</label
            >
          </div>
        }
        <app-profile-input
          type="industry"
          [inputValue]="userInfo()?.industry ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #industry
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="country"
          [inputValue]="userInfo()?.country ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #country
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="location"
          [inputValue]="userInfo()?.location ?? ''"
          [clearable]="true"
          #location
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
      </form>
    </ng-container>
  `,
  host: {
    class: 'block pt-50px h-screen bg-white',
  },
})
export default class EditProfilePage implements OnInit {
  userInfoService = inject(UserInfoService);
  userService = inject(UserService);
  profileService = inject(ProfileService);
  userInfo = signal<Nullable<UserInfo>>(null);
  educationList = signal<Education[]>([]);
  isFormValid = computed(
    () =>
      this.firstNameInput().isValid() &&
      this.lastNameInput().isValid() &&
      this.educationInput()?.isValid() &&
      this.industryInput().isValid() &&
      this.countryInput().isValid() &&
      this.locationInput().isValid(),
  );
  router = inject(Router);
  saving = signal(false);
  receiveResponse = signal(false);

  vcf = inject(ViewContainerRef);

  form = viewChild.required('form', { read: FormDirective });
  firstNameInput = viewChild.required<ProfileInputComponent>('firstName');
  lastNameInput = viewChild.required<ProfileInputComponent>('lastName');
  headlineInput = viewChild.required<ProfileInputComponent>('headline');
  educationInput = viewChild<ProfileInputComponent>('education');
  educationShowInput = viewChild<ElementRef<HTMLInputElement>>('educationShow');
  industryInput = viewChild.required<ProfileInputComponent>('industry');
  countryInput = viewChild.required<ProfileInputComponent>('country');
  locationInput = viewChild.required<ProfileInputComponent>('location');
  toastNotification =
    viewChild.required<ToastNotificationComponent>('toastNotification');

  async saveProfileChanges() {
    const userInfo: UserInfo = {
      id: this.userInfo()?.id ?? '',
      firstName: this.firstNameInput().inputValue(),
      lastName: this.lastNameInput().inputValue(),
      headline: this.headlineInput().inputValue(),
      education: this.educationList().find(
        (item) => item.id === this.educationInput()?.selectedEducationId(),
      ),
      showEducation: this.educationShowInput()?.nativeElement.checked || false,
      industry: this.industryInput().inputValue(),
      country: this.countryInput().inputValue(),
      location: this.locationInput().inputValue(),
    };
    this.saving.set(true);
    const response: UpdateResponse =
      await this.userService.updateUserInfo(userInfo);
    if (response) {
      this.saving.set(false);
      this.form().isDirty.set(false);
      this.userInfoService.changedSinceLastRetrieve.set(true);

      const compRef = this.vcf.createComponent(ToastNotificationComponent);
      compRef.instance.isVisible.set(true);
      compRef.instance.message.set(response.message);
      compRef.instance.type.set(
        response.status === 'success' ? 'success' : 'error',
      );
      // compRef.setInput('closeBy', 'clickingCloseBtn');
      compRef.setInput('closeBy', 'swiping');
      compRef.instance.closeToast.subscribe(() => {
        compRef.instance.isVisible.set(false);
        setTimeout(() => {
          compRef.destroy(); //destroy component after 1s being invisible
        }, 1000);
      });
    }
  }

  async ngOnInit() {
    this.userInfo.set(await this.userInfoService.getUserInfo());
    this.educationList.set((await this.profileService.getEducations()).data);
  }
}
