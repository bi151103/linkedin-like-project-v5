import { Directive, computed, inject, input } from '@angular/core';
import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  PositionStrategy,
} from '@angular/cdk/overlay';

@Directive({
  selector: '[appOverlay]',
})
export default class OverlayDirective {
  overlayService = inject(Overlay);
  overlayContainer = inject(OverlayContainer);

  constructor() {
    this.overlayContainer.getContainerElement().classList.add('text-small');
  }

  position = input<PositionStrategy>(this.overlayService.position().global());
  hasBackdrop = input(false);

  config = computed(() => {
    const overlayConfig: OverlayConfig = {
      hasBackdrop: this.hasBackdrop(),
      positionStrategy: this.position(),
    };
    return overlayConfig;
  });
}
