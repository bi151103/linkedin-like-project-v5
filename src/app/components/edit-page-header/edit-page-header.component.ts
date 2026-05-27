import { Component, computed, input, output } from '@angular/core';
import ButtonComponent from '../button/button.component';

export type EditPageType = 'edit-profile' | 'edit-about';

@Component({
  selector: 'app-edit-page-header',
  imports: [ButtonComponent],
  template: `
    <ng-container>
      <div
        class="h-50px border-separator-line fixed top-0 flex w-full items-center border-b bg-white"
      >
        <button appButton btnType="back" (click)="backClick.emit()"></button>
        <h1 class="text-emphasis-tx px-15px">{{ contentConfigs().title }}</h1>
        <button
          [disabled]="isSaveBtnDisabled()"
          class="min-w-50px px-15px disabled:text-disabled-tx ml-auto text-inherit"
          (click)="saveClick.emit()"
        >
          Save
        </button>
      </div>
    </ng-container>
  `,
  host: {},
})
export default class EditPageHeaderComponent {
  type = input.required<EditPageType>();
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
    };
    return configs[this.type()];
  });
  backClick = output();
  saveClick = output();
}
