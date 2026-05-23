import { Component, signal } from '@angular/core';
import HeaderComponent from '../../components/header/header.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import FooterComponent from '../../components/footer/footer.component';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
  ],
  template: `
    <app-header
      (onShowSearchComboboxDialog)="showSearchComboboxDialog()"
    ></app-header>
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
