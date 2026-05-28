import { Component, computed, input, output } from '@angular/core';
import IconButtonComponent from '../icon-button/icon-button.component';
import { AddFeaturedType } from '../../pages/add-feature/add-feature.page';

export type EditPageType = 'edit-profile' | 'edit-about' | AddFeaturedType;

export type FormType = 'add' | 'edit';

@Component({
  selector: 'app-form-page-header',
  imports: [IconButtonComponent],
  template: `
    <ng-container>
      <div
        class="h-50px border-separator-line fixed top-0 flex w-full items-center justify-center border-b bg-white"
      >
        <button
          addClass="min-w-md-img w-md-img h-md-img"
          appIconButton
          iconSize="30"
          btnType="back"
          (click)="backClick.emit(contentConfigs().backTo)"
        ></button>
        <h1 class="text-emphasis-tx px-15px">{{ contentConfigs().title }}</h1>
        <button
          [disabled]="isSaveBtnDisabled()"
          class="min-w-50px px-15px disabled:text-disabled-tx ml-auto text-inherit"
          (click)="saveClick.emit()"
        >
          {{ formType() === 'add' ? 'Add' : 'Save' }}
        </button>
      </div>
    </ng-container>
  `,
  host: {},
})
export default class FormPageHeaderComponent {
  type = input.required<EditPageType>();
  formType = input.required<FormType>();
  isSaveBtnDisabled = input.required<boolean>();
  contentConfigs = computed(() => {
    const configs: Record<EditPageType, { backTo: string; title: string }> = {
      'edit-profile': {
        backTo: '/',
        title: 'Edit Intro',
      },
      'edit-about': {
        backTo: '/',
        title: 'Edit about',
      },
      'add-featured-image': {
        backTo: '/',
        title: 'Add media',
      },
      'add-featured-document': {
        backTo: '/',
        title: 'Add media',
      },
      'add-featured-link': {
        backTo: '/',
        title: 'Add a link',
      },
    };
    return configs[this.type()];
  });
  backClick = output<string>();
  saveClick = output();
}
