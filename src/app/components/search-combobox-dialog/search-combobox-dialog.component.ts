import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import DialogComponent from '../dialog/dialog.component';
import ProfileService from '../../services/profile.service';
import { SvgIconComponent } from 'angular-svg-icon';
import OverlayDirective from '../overlay/overlay.component';
import IconButtonComponent from '../icon-button/icon-button.component';
import ToastNotificationService from '../../services/toast-notification.service';

@Component({
  selector: 'app-search-combobox-dialog',
  imports: [
    SvgIconComponent,
    OverlayDirective,
    DialogComponent,
    IconButtonComponent,
  ],
  template: `
    <ng-container>
      <div class="h-50px flex items-center">
        <button
          appIconButton
          iconSize="30"
          (click)="onCloseDialog()"
          addClass="min-w-md-img w-md-img"
          btnType="back"
        >
          <img
            src="assets/images/icons8-left-100.png"
            class="aspect-square w-3/5"
          />
        </button>
        <input
          #searchInput
          placeholder="Search"
          class="pl-20px pr-10px text-medium text-emphasis-tx basis-[calc(100%-100px)] rounded-[2px] pt-[4px] font-bold focus:outline-2"
        />
      </div>
      <div class="p-15px flex justify-between">
        <h3 class="text-emphasis-tx font-medium">Recent search</h3>
        @if (recentSearch() && recentSearch().length > 0) {
          <button (click)="clearSearchDialogVisible.set(true)" class="px-10px">
            Clear
          </button>
        }
      </div>
      <ul class="mt-10px">
        @for (item of recentSearch().slice(0, 5); track item) {
          <li
            class="border-separator-line py-8px pr-15px flex min-h-[56px] w-full items-center border-b"
          >
            <svg-icon
              src="assets/icons/time-01.svg"
              class="mx-[32px]"
            ></svg-icon>
            <span class="text-medium w-full truncate">{{ item }}</span>
          </li>
        }
      </ul>
      @if (!recentSearch() || (recentSearch() && recentSearch().length === 0)) {
        <div class="py-20px m-auto max-h-[100px] w-full text-center">
          <img
            src="assets/images/icons8-empty-100.png"
            class="w-md-img h-md-img"
          />
          <p class="text-medium-bold mt-5px text-3xl">Nothing here yet</p>
        </div>
      }
    </ng-container>
    <div appOverlay [hasBackdrop]="true">
      <app-dialog
        [isVisible]="clearSearchDialogVisible()"
        (closeDialog)="clearSearchDialogVisible.set(false)"
        [closableOnBackdropCLick]="true"
      >
        <div
          class="p-24px fixed top-0 right-0 bottom-0 left-0 z-1003 m-auto h-min max-h-[70vh] w-[70vw] min-w-[300px] overflow-y-auto rounded-[8px] bg-white"
        >
          <h1 class="text-emphasis-tx font-medium">Clear history?</h1>
          <p class="mt-10px text-medium text-emphasis-tx">
            Your search history is only visible to you, and it helps us to show
            you better results. Are you sure you want to clear it?
          </p>
          <div
            class="mt-15px *:h:[48px] text-medium flex justify-end *:inline-block *:px-[24px] *:py-[12px] *:text-inherit"
          >
            <button (click)="clearSearchDialogVisible.set(false)">
              Cancel
            </button>
            <button (click)="onContinue()">Continue</button>
          </div>
        </div>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'h-screen w-screen bg-white',
  },
})
export default class SearchComboboxDialogComponent {
  dialogComponent = inject(DialogComponent);
  profileService = inject(ProfileService);
  toastService = inject(ToastNotificationService);
  vcf = inject(ViewContainerRef);

  searchInput = viewChild.required<ElementRef<HTMLElement>>('searchInput');

  closeDialogOutput = output<boolean>();

  recentSearch = signal<string[]>([]);
  clearSearchDialogVisible = signal(false);

  constructor() {
    effect(() => {
      if (this.dialogComponent.isVisible()) {
        this.searchInput().nativeElement.focus();
        this.profileService.getRecentSearch().subscribe((data) => {
          this.recentSearch.set(data.data);
        });
      }
    });
  }

  onCloseDialog() {
    this.dialogComponent.isVisible.set(false);
    this.closeDialogOutput.emit(true);
  }

  async onContinue() {
    this.profileService
      .clearRecentSearch(this.recentSearch())
      .subscribe((response) => {
        if (response.status === 'success') {
          this.recentSearch.set([]);
        } else {
          this.toastService.create(this.vcf, {
            type: 'error',
            message: response.message,
          });
        }
      });
    this.clearSearchDialogVisible.set(false);
  }
}
