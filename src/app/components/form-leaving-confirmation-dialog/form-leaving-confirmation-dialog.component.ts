import { Component, input, model, viewChild } from '@angular/core';
import OverlayDirective from '../overlay/overlay.component';
import DialogComponent from '../dialog/dialog.component';
import FormDirective from '../../directives/form.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-leaving-confirmation-dialog',
  imports: [OverlayDirective, DialogComponent, RouterLink],
  template: `
    <ng-container>
      <div appOverlay [hasBackdrop]="true">
        <app-dialog
          [isVisible]="form().confirmOnLeavingDialogVisible()"
          (closeDialog)="form().confirmOnLeavingDialogVisible.set(false)"
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
              <button (click)="form().confirmOnLeavingDialogVisible.set(false)">
                Stay
              </button>
              <button [routerLink]="backToPath()">Leave</button>
            </div>
          </div>
        </app-dialog>
      </div>
    </ng-container>
  `,
  host: {},
})
export default class FormLeavingConfirmationDialogComponent {
  backToPath = input.required<string>();
  form = input.required<FormDirective>();
}
