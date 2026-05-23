import { Component, signal } from '@angular/core';
import HeaderComponent from '../../components/header/header.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import FooterComponent from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
    RouterLink,
  ],
  template: `
    <app-header
      (onShowSearchComboboxDialog)="showSearchComboboxDialog()"
    ></app-header>
    <ng-container>
      <section class="relative">
        <img
          src="assets/images/background-image-cut.jpg"
          class="w-full bg-white align-middle"
        />
        <a routerLink="/my-preference"
          ><img
            src="assets/images/icons8-setting-100.png"
            class="p-5px absolute top-0 right-0 mt-[15px] mr-[15px] aspect-square w-[25px] rounded-full bg-white"
        /></a>
      </section>
    </ng-container>
    <app-footer></app-footer>
    <div appOverlay>
      <app-dialog
        [isVisible]="searchDialogVisible()"
        (closeDialog)="hideSearchComboboxDialog()"
      >
        <app-search-combobox-dialog></app-search-combobox-dialog>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'block py-50px',
  },
})
export class ProfilePage {
  searchDialogVisible = signal(false);
  showSearchComboboxDialog() {
    this.searchDialogVisible.set(true);
  }
  hideSearchComboboxDialog() {
    this.searchDialogVisible.set(false);
  }
}
