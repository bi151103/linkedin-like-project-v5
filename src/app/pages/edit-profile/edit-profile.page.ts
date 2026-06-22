import {
  Component,
  computed,
  effect,
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
import ProfileInputComponent from '../../components/profile-input/profile-input.component';
import ProfileService from '../../services/profile.service';
import { Education } from '../../services/models/education';
import FullscreenLoadingComponent from '../../components/fullscreen-loading/fullscreen-loading.component';
import { UpdateResponse } from '../../services/models/update-response';
import ToastNotificationComponent from '../../components/toast-notification/toast-notification.component';
import FormPageHeaderComponent from '../../components/form-page-header/form-page-header.component';
import FormDirective from '../../directives/form.directive';
import UserService from '../../services/user.service';
import ToastNotificationService from '../../services/toast-notification.service';
import { Industry } from '../../services/models/industry';
import { Country } from '../../services/models/country';
import { Location } from '../../services/models/location';
import { convertCompilerOptionsFromJson } from 'typescript';

@Component({
  selector: 'app-edit-profile',
  imports: [
    ProfileInputComponent,
    FullscreenLoadingComponent,
    FormPageHeaderComponent,
    FormDirective,
  ],
  template: `
    <app-fullscreen-loading [isVisible]="saving()"></app-fullscreen-loading>
    <ng-container>
      <app-form-page-header
        type="edit-profile"
        formType="edit"
        (saveClick)="saveProfileChanges()"
        (backClick)="form.onLeaveForm($event)"
        [isSaveBtnDisabled]="!isFormValid() || !form.isDirty()"
      ></app-form-page-header>
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
              [checked]="checkboxState()"
              (click)="onCheckboxClick()"
              #educationShow
            />
            <label
              class="ml-10px text-emphasis-tx"
              for="education-check"
              (click)="onCheckboxClick()"
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
          [inputValue]="userInfo()?.country"
          (inputChange)="onInputChange($event)"
          [isRequired]="true"
          [clearable]="true"
          #country
          (dirty)="form.isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="location"
          [inputValue]="locationData()"
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
export default class EditProfilePage {
  _console = console;
  userInfoService = inject(UserInfoService);
  userService = inject(UserService);
  profileService = inject(ProfileService);
  toastService = inject(ToastNotificationService);
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
  saving = signal(false);
  checkboxState = computed(() => {
    return this.userInfo()?.showEducation;
  });
  locationData = computed(() => {
    return [this.userInfo()?.country, this.userInfo()?.location];
  });

  vcf = inject(ViewContainerRef);

  formDirective = viewChild.required('form', { read: FormDirective });
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
      firstName: this.firstNameInput().inputValue() as string,
      lastName: this.lastNameInput().inputValue() as string,
      headline: this.headlineInput().inputValue() as string,
      education: this.educationList().find(
        (item) => item.id === this.educationInput()?.selectedEducationId(),
      ),
      showEducation: this.educationShowInput()?.nativeElement.checked || false,
      industry: this.industryInput().inputValue() as Industry,
      country: {
        id: (this.countryInput().inputValue() as Country).id,
        name: (this.countryInput().inputValue() as Country).name,
      },
      location: this.locationInput().inputValue() as Location,
    };
    this.saving.set(true);
    this.userService.updateUserInfo(userInfo).subscribe((response) => {
      if (response) {
        this.saving.set(false);
        this.formDirective().isDirty.set(false);
        this.userInfoService.changedSinceLastRetrieve.set(true);
        this.toastService.create(this.vcf, {
          type: response.status === 'success' ? 'success' : 'error',
          message: response.message,
          closeBy: 'swiping',
        });
      }
    });
  }

  onCheckboxClick() {
    this.formDirective().isDirty.set(true);
    this.userInfo.update((value) => {
      if (value) {
        return {
          ...value,
          showEducation: !value.showEducation,
        };
      }
      return value;
    });
  }

  constructor() {
    this.userInfoService.getUserInfo().subscribe((data) => {
      this.userInfo.set(data);
    });

    this.profileService.getEducations().subscribe((data) => {
      this.educationList.set(data.data);
    });
  }

  onInputChange(inputChangeV: unknown) {
    this.userInfo.update((value) => {
      if (!value) return value;
      return {
        ...value,
        country: inputChangeV as Country,
        location: '',
      };
    });
  }
}
