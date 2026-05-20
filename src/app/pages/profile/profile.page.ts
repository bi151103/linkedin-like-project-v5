import { Component } from '@angular/core';
import HeaderComponent from '../../components/header/header.component';
import OverlayComponent from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    OverlayComponent,
    DialogComponent,
    SearchComboboxDialogComponent,
  ],
  template: `
    <app-header></app-header>
    <app-overlay [hasBackdrop]="false">
      <app-dialog [isVisible]="false">
        <app-search-combobox-dialog></app-search-combobox-dialog>
      </app-dialog>
    </app-overlay>
  `,
})
export class ProfilePage {}
