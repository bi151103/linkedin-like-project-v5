import {
  Component,
  computed,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import FormPageHeaderComponent from '../../components/form-page-header/form-page-header.component';
import AddFeaturedStoreService from '../../services/add-featured-store.service';
import FormDirective from '../../directives/form.directive';
import ProfileInputComponent from '../../components/profile-input/profile-input.component';
import { Router } from '@angular/router';
import FullscreenLoadingComponent from '../../components/fullscreen-loading/fullscreen-loading.component';
import { CreateFeatureRequest } from '../../services/models/create-feature-request';
import { UpdateResponse } from '../../services/models/update-response';
import ProfileService from '../../services/profile.service';
import ToastNotificationService from '../../services/toast-notification.service';

export type AddFeaturedType =
  | 'add-featured-image'
  | 'add-featured-document'
  | 'add-featured-link';

@Component({
  selector: 'app-add-featured',
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
        [type]="type()"
        formType="add"
        [isSaveBtnDisabled]="!isFormValid()"
        (backClick)="form.onLeaveForm($event)"
        (saveClick)="handleAddFeatured()"
      ></app-form-page-header>
      <div class="px-15px py-10px">
        <img
          [src]="blobPreviewSrc()"
          class="aspect-[2] h-[171px] object-cover"
        />
        <form class="mt-[24px] bg-white" appForm #form="appForm">
          <app-profile-input
            type="featured-name"
            [inputValue]="featuredName()"
            #featureNameInput
            [isRequired]="true"
            [clearable]="true"
            textBoxType="input"
          ></app-profile-input
          ><app-profile-input
            type="featured-description"
            [inputValue]="description()"
            #descriptionInput
            textBoxType="textarea"
          ></app-profile-input>
        </form>
      </div>
    </ng-container>
  `,
  host: {
    class: 'block pt-50px h-screen bg-white',
  },
})
export default class AddFeaturedPage implements OnInit, OnDestroy {
  profileService = inject(ProfileService);
  addFeatureStoreService = inject(AddFeaturedStoreService);
  router = inject(Router);
  vcf = inject(ViewContainerRef);
  toastService = inject(ToastNotificationService);
  type = signal<AddFeaturedType>('add-featured-image');
  featuredName = model('');
  blobPreviewSrc = signal('');
  description = signal('');
  saving = signal(false);

  isFormValid = computed(() => this.featuredNameInput().isValid());

  form = viewChild.required('form', { read: FormDirective });
  featuredNameInput =
    viewChild.required<ProfileInputComponent>('featureNameInput');
  descInput = viewChild.required<ProfileInputComponent>('descriptionInput');

  ngOnInit() {
    if (this.addFeatureStoreService.profilePageVisited()) {
      const imgInputFile = this.addFeatureStoreService.imgInputFile();
      const docInputFile = this.addFeatureStoreService.docInputFile();
      if (imgInputFile) {
        this.type.set('add-featured-image');
        this.blobPreviewSrc.set(URL.createObjectURL(imgInputFile));
        this.featuredName.set(imgInputFile.name);
        this.form().isDirty.set(true);
      } else if (docInputFile) {
        this.type.set('add-featured-document');
        this.blobPreviewSrc.set(URL.createObjectURL(docInputFile));
        this.featuredName.set(docInputFile.name);
        this.form().isDirty.set(true);
      } else {
        this.type.set('add-featured-link');
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  async handleAddFeatured() {
    const createFeatureReq: CreateFeatureRequest = {
      name: this.featuredNameInput().inputValue(),
      description: this.descInput().inputValue(),
      type: ['add-featured-image', 'add-featured-document'].includes(
        this.type(),
      )
        ? 'media'
        : 'link',
      value: this.featuredNameInput().inputValue(),
      file:
        this.type() === 'add-featured-image'
          ? this.addFeatureStoreService.imgInputFile()
          : this.type() === 'add-featured-document'
            ? this.addFeatureStoreService.docInputFile()
            : undefined,
    };
    this.saving.set(true);
    const response: UpdateResponse =
      await this.profileService.addFeature(createFeatureReq);
    if (response) {
      this.saving.set(false);
      this.router.navigate(['/']);

      this.toastService.create(this.vcf, {
        type: response.status === 'success' ? 'success' : 'error',
        message: response.message,
        closeBy: 'clickingCloseBtn',
      });
    }
  }

  ngOnDestroy() {
    this.addFeatureStoreService.profilePageVisited.set(false);
    this.addFeatureStoreService.imgInputFile.set(null);
    this.addFeatureStoreService.docInputFile.set(null);
  }
}
