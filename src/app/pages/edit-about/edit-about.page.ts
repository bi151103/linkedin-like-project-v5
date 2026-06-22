import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import FormPageHeaderComponent from '../../components/form-page-header/form-page-header.component';
import ProfileInputComponent from '../../components/profile-input/profile-input.component';
import ProfileService from '../../services/profile.service';
import FormDirective from '../../directives/form.directive';
import { About } from '../../services/models/about';
import FullscreenLoadingComponent from '../../components/fullscreen-loading/fullscreen-loading.component';
import { UpdateResponse } from '../../services/models/update-response';
import ToastNotificationService from '../../services/toast-notification.service';

@Component({
  selector: 'app-edit-about',
  imports: [
    FormPageHeaderComponent,
    FormDirective,
    ProfileInputComponent,
    FullscreenLoadingComponent,
  ],
  template: `
    <app-fullscreen-loading [isVisible]="saving()"></app-fullscreen-loading>
    <ng-container>
      <app-form-page-header
        type="edit-about"
        formType="edit"
        [isSaveBtnDisabled]="!isFormValid() || !form.isDirty()"
        (backClick)="form.onLeaveForm($event)"
        (saveClick)="saveAboutChanges()"
      ></app-form-page-header>
      <form class="px-15px py-10px bg-white" appForm #form="appForm">
        <app-profile-input
          type="about"
          [inputValue]="aboutData()"
          #about
          (dirty)="form.isDirty.set(true)"
          textBoxType="textarea"
        ></app-profile-input>
      </form>
    </ng-container>
  `,
  host: {
    class: 'block pt-50px h-screen bg-white',
  },
})
export default class EditAboutPage {
  profileService = inject(ProfileService);
  aboutData = signal<string>('');
  saving = signal<boolean>(false);
  isFormValid = computed(() => this.aboutInput().isValid());

  toastService = inject(ToastNotificationService);
  vcf = inject(ViewContainerRef);

  form = viewChild.required('form', { read: FormDirective });
  aboutInput = viewChild.required<ProfileInputComponent>('about');

  async saveAboutChanges() {
    const aboutData: About = {
      data: this.aboutInput().inputValue() as string,
    };
    this.saving.set(true);
    this.profileService.updateAboutData(aboutData).subscribe((response) => {
      if (response) {
        this.saving.set(false);
        this.form().isDirty.set(false);

        this.toastService.create(this.vcf, {
          type: response.status === 'success' ? 'success' : 'error',
          message: response.message,
          closeBy: 'swiping',
        });
      }
    });
  }

  constructor() {
    this.profileService.getAboutData().subscribe((data) => {
      this.aboutData.set(data.data);
    });
  }
}
