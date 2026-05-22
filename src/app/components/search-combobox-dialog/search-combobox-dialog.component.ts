import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import DialogComponent from '../dialog/dialog.component';
import ProfileService from '../../services/profile.service';
import { RecentSearchResponse } from '../../services/models';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-search-combobox-dialog',
  imports: [SvgIconComponent],
  template: `
    <ng-container>
      <div class="h-50px flex items-center">
        <button
          (click)="onCloseDialog()"
          class="min-w-md-img w-md-img flex h-full items-center justify-center"
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
        @if (recentSearch && recentSearch.length > 0) {
          <button class="px-10px">Clear</button>
        }
      </div>
      <ul class="mt-10px">
        @for (item of recentSearch; track item) {
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
      @if (!recentSearch || (recentSearch && recentSearch.length === 0)) {
        <div class="py-20px m-auto max-h-[100px] w-full text-center">
          <img
            src="/assets/images/icons8-empty-100.png"
            class="w-md-img h-md-img"
          />
          <p class="text-medium-bold mt-5px text-3xl">Nothing here yet</p>
        </div>
      }
    </ng-container>
  `,
  host: {
    class: 'h-screen w-screen bg-white',
  },
})
export default class SearchComboboxDialogComponent {
  dialogComponent = inject(DialogComponent);
  searchInput = viewChild.required<ElementRef<HTMLElement>>('searchInput');
  closeDialogOutput = output<boolean>();
  profileService = inject(ProfileService);
  recentSearch: string[] = [];

  constructor() {
    effect(() => {
      if (this.dialogComponent.isVisible()) {
        this.searchInput().nativeElement.focus();
        this.profileService.getRecentSearch().then((data) => {
          this.recentSearch = data.data;
        });
      }
    });
  }

  onCloseDialog() {
    this.dialogComponent.isVisible.set(false);
    this.closeDialogOutput.emit(true);
  }
}
