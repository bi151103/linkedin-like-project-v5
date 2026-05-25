import { Component, input } from '@angular/core';
import OverlayDirective from '../overlay/overlay.component';
import DialogComponent from '../dialog/dialog.component';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-fullscreen-loading',
  imports: [OverlayDirective, DialogComponent, SvgIconComponent],
  template: `
    <ng-container>
      <div appOverlay [hasBackdrop]="true">
        <app-dialog [isVisible]="isVisible()" [closableOnBackdropCLick]="false">
          <div
            class="w-40px h-40px fixed top-[64px] right-0 left-0 mx-auto rounded-full bg-white"
          >
            <svg-icon
              src="assets/icons/loading-01.svg"
              class="stroke-low-emphasis-tx circle-loader loader-icon fill-transparent stroke-[3px]"
            ></svg-icon>
          </div>
        </app-dialog>
      </div>
    </ng-container>
  `,
  styles: `
    .loader-icon svg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      align-items: center;
      animation:
        dash 2s ease infinite,
        spin 2s linear infinite;
      transform-origin: center;
      transform-box: fill-box;
    }
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 70;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 63, 70;
        stroke-dashoffset: -18;
      }
      100% {
        stroke-dasharray: 63, 70;
        stroke-dashoffset: -67;
      }
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  host: {},
})
export default class FullscreenLoadingComponent {
  isVisible = input(false);
}
