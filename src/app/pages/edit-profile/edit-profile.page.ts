import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import UserInfoService from '../../services/user-info.service';
import { Nullable } from '../../models';
import { UserInfo } from '../../services/models/user-info';
import ButtonComponent from '../../components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import ProfileInputComponent from '../../components/profile-input/profile-input.component';
import ProfileService from '../../services/profile.service';
import { Education } from '../../services/models/education';
import UserService from '../../services/user.service';
import OverlayDirective from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import FullscreenLoadingComponent from '../../components/fullscreen-loading/fullscreen-loading.component';
import { UpdateResponse } from '../../services/models/update-response';
import ToastNotificationComponent from '../../components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-edit-profile',
  imports: [
    ButtonComponent,
    RouterLink,
    ProfileInputComponent,
    OverlayDirective,
    DialogComponent,
    FullscreenLoadingComponent,
    ToastNotificationComponent,
  ],
  template: `
    <app-fullscreen-loading [isVisible]="saving()"></app-fullscreen-loading>
    <ng-container>
      <div
        class="h-50px border-separator-line fixed top-0 flex w-full items-center border-b bg-white"
      >
        <button appButton (click)="onLeaveForm()"></button>
        <h1 class="text-emphasis-tx px-15px">Edit Intro</h1>
        <button
          [disabled]="!isFormValid() || !isDirty()"
          class="min-w-50px px-15px disabled:text-disabled-tx ml-auto text-inherit"
          (click)="saveProfileChanges()"
        >
          Save
        </button>
      </div>
      <form class="px-15px py-10px bg-white" (submit)="$event.preventDefault()">
        <app-profile-input
          type="firstName"
          [inputValue]="userInfo()?.firstName ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #firstName
          (dirty)="isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="lastName"
          [inputValue]="userInfo()?.lastName ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #lastName
          (dirty)="isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="headline"
          [inputValue]="userInfo()?.headline ?? ''"
          [clearable]="true"
          (dirty)="isDirty.set(true)"
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
            (dirty)="isDirty.set(true)"
          ></app-profile-input>
          <div class="mt-10px px-5px flex items-center">
            <input
              id="education-check"
              class="h-[2rem] w-[2rem] align-middle"
              type="checkbox"
              name="educationShow"
              (change)="isDirty.set(true)"
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
          (dirty)="isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="country"
          [inputValue]="userInfo()?.country ?? ''"
          [isRequired]="true"
          [clearable]="true"
          #country
          (dirty)="isDirty.set(true)"
        ></app-profile-input>
        <app-profile-input
          type="location"
          [inputValue]="userInfo()?.location ?? ''"
          [clearable]="true"
          #location
          (dirty)="isDirty.set(true)"
        ></app-profile-input>
      </form>
    </ng-container>
    <ng-container>
      <div appOverlay [hasBackdrop]="true">
        <app-dialog
          [isVisible]="confirmOnLeavingDialogVisible()"
          (closeDialog)="confirmOnLeavingDialogVisible.set(false)"
          [closableOnBackdropCLick]="true"
        >
          <div
            class="p-24px fixed top-0 right-0 bottom-0 left-0 z-1003 m-auto h-min max-h-[70vh] w-[70vw] min-w-[300px] overflow-y-auto rounded-[8px] bg-white"
          >
            <h1 class="text-emphasis-tx font-medium">Leaving?</h1>
            <p class="mt-10px text-medium text-emphasis-tx">
              Are you sure to discard the changes?
            </p>
            <div
              class="mt-15px *:h:[48px] text-medium flex justify-end *:inline-block *:px-[24px] *:py-[12px] *:text-inherit"
            >
              <button (click)="confirmOnLeavingDialogVisible.set(false)">
                Stay
              </button>
              <button routerLink="/">Leave</button>
            </div>
          </div>
        </app-dialog>
      </div>
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
  isDirty = signal(false);
  isFormValid = computed(
    () =>
      this.firstNameInput().isValid() &&
      this.lastNameInput().isValid() &&
      this.educationInput()?.isValid() &&
      this.industryInput().isValid() &&
      this.countryInput().isValid() &&
      this.locationInput().isValid(),
  );
  confirmOnLeavingDialogVisible = signal(false);
  router = inject(Router);
  saving = signal(false);
  receiveResponse = signal(false);

  vcf = inject(ViewContainerRef);

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

      const compRef = this.vcf.createComponent(ToastNotificationComponent);
      compRef.instance.message.set(response.message);
      compRef.instance.type.set(
        response.status === 'success' ? 'success' : 'error',
      );
      compRef.setInput('closeBy', 'swiping');
      compRef.instance.closeToast.subscribe(() => {
        compRef.instance.isVisible.set(false);
      });
      requestAnimationFrame(() => {
        compRef.instance.isVisible.set(true);
      });
    }
  }

  onLeaveForm() {
    if (this.isDirty()) {
      this.confirmOnLeavingDialogVisible.set(true);
    } else {
      this.router.navigate(['/']);
    }
  }

  async ngOnInit() {
    this.userInfo.set(await this.userInfoService.getUserInfo());
    this.educationList.set((await this.profileService.getEducations()).data);
  }
}
