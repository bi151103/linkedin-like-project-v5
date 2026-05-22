import {
  Component,
  computed,
  effect,
  inject,
  model,
  output,
  viewChild,
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import OverlayComponent from '../overlay/overlay.component';
import { Nullable } from '../../models';

@Component({
  imports: [CdkPortal],
  selector: 'app-dialog',
  template: `
    <ng-template cdkPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export default class DialogComponent {
  overlayComponent = inject(OverlayComponent);
  private overlayRef: Nullable<OverlayRef> = null;
  cdkPortal = viewChild.required(CdkPortal);
  isVisible = model(false);
  closeDialog = output();

  constructor() {
    effect(() => {
      if (this.isVisible()) {
        this.attachDialog();
      } else {
        this.detachDialog();
      }
    });
  }

  attachDialog() {
    const overlayConfig = this.overlayComponent.config();

    if (!this.overlayRef) {
      this.overlayRef =
        this.overlayComponent.overlayService.create(overlayConfig);
    }
    this.overlayRef.attach<CdkPortal>(this.cdkPortal());
  }

  detachDialog() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.closeDialog.emit();
    }
  }
}
