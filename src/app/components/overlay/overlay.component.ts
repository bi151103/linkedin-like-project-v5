import { Component, computed, inject, input } from '@angular/core';
import { Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';

@Component({ selector: 'app-overlay', template: `` })
export default class OverlayComponent {
  overlayService = inject(Overlay);

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
