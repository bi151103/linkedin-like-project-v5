import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import EditPageHeaderComponent from '../../components/edit-page-header/edit-page-header.component';
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
    EditPageHeaderComponent,
    FormDirective,
    ProfileInputComponent,
    FullscreenLoadingComponent,
  ],
  template: `
    <app-fullscreen-loading [isVisible]="saving()"></app-fullscreen-loading>
    <ng-container>
      <app-edit-page-header
        type="edit-about"
        [isSaveBtnDisabled]="!isFormValid() || !form.isDirty()"
        (backClick)="form.onLeaveForm($event)"
        (saveClick)="saveAboutChanges()"
      ></app-edit-page-header>
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
export default class EditAboutPage implements OnInit {
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
      data: this.aboutInput().inputValue(),
    };
    this.saving.set(true);
    const response: UpdateResponse =
      await this.profileService.updateAboutData(aboutData);
    if (response) {
      this.saving.set(false);
      this.form().isDirty.set(false);

      this.toastService.create(this.vcf, {
        type: response.status === 'success' ? 'success' : 'error',
        message: response.message,
        closeBy: 'swiping',
      });
    }
  }

  async ngOnInit() {
    this.aboutData.set((await this.profileService.getAboutData()).data);
  }
}
