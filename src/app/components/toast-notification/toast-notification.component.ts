import {
  afterNextRender,
  afterRender,
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import OverlayDirective from '../overlay/overlay.component';
import DialogComponent from '../dialog/dialog.component';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import TwMergePipe from '../../directives/tw-merge.directive';
import TimeMilToSecPipe from '../../pipes/time-mili-to-sec.pipe';
import { SvgIconComponent } from 'angular-svg-icon';

export type ToastNotificationType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-toast-notification',
  imports: [
    OverlayDirective,
    DialogComponent,
    CdkDrag,
    TwMergePipe,
    TimeMilToSecPipe,
    SvgIconComponent,
  ],
  template: `
    <ng-container>
      <div appOverlay [hasBackdrop]="false" id="toast">
        <app-dialog [isVisible]="true">
          @if (closeBy() === 'swiping') {
            <div
              [class]="
                [
                  'h-50px bottom-40px text-success fixed right-0 left-0 mx-auto flex w-[80vw] items-center bg-white font-medium shadow-2xl duration-500',
                  timer > 0 && isVisible()
                    ? 'translate-0 opacity-100'
                    : 'translate-y-[100px] opacity-0',
                  shouldRemoveDurationClass() ? 'duration-0' : '',
                ] | twMerge
              "
              cdkDrag
              [cdkDragBoundary]="dragBoundary"
              [cdkDragDisabled]="false"
              (cdkDragMoved)="onDragMoved()"
              (cdkDragEnded)="onDropped()"
              #toastContainer
            >
              <span class="w-5px bg-success mr-auto h-full"></span>
              <span class="ml-10px px-10px grow">{{ message() }}</span>
              <span class="mr-20px text-emphasis-tx"
                >{{ timer | timeMilToSec }}
              </span>
            </div>
          } @else {
            <div
              [class]="
                [
                  'h-50px bottom-40px text-success fixed right-0 left-0 mx-auto flex w-[80vw] translate-0 items-center bg-white font-medium opacity-100 shadow-2xl duration-500',
                  timer > 0 && isVisible()
                    ? 'translate-0 opacity-100'
                    : 'translate-y-[100px] opacity-0',
                ] | twMerge
              "
              #toastContainer
            >
              <span class="w-5px bg-success mr-auto h-full"></span>
              <span class="ml-10px px-10px grow">{{ message() }}</span>
              <button class="mr-20px" (click)="closeToast.emit()">
                <svg-icon src="assets/icons/close-01.svg"></svg-icon>
              </button>
            </div>
          }
        </app-dialog>
        <div
          class="fixed bottom-[-40px] left-[calc(20vw/2)] h-[130px] w-[80vw]"
          #dragBoundary
        ></div>
      </div>
    </ng-container>
  `,
  styles: ``,
  host: {},
})
export default class ToastNotificationComponent {
  isVisible = model(false);
  closeBy = input.required<'swiping' | 'clickingCloseBtn'>();
  type = model.required<ToastNotificationType>();
  message = model<string>('');
  toastEleRef = viewChild.required<ElementRef<HTMLElement>>('toastContainer');
  screenHeight = window.innerHeight;
  timer = 0;
  closeToast = output();
  shouldRemoveDurationClass = signal(false);
  fromOriginalPosition = signal(false);

  constructor() {
    effect((onCleanUp) => {
      let intervalId: number;
      if (this.isVisible()) {
        if (this.closeBy() === 'swiping') {
          requestAnimationFrame(() => {
            const timer = 5000; //ms
            this.timer = timer;

            intervalId = setInterval(() => {
              this.timer = this.timer - 1000;
              if (this.timer <= 0) {
                this.closeToast.emit();
                this.timer = 0;
              }
            }, 1000);
          });
        } else {
          requestAnimationFrame(() => {
            this.timer = 1000;
          });
        }
      } else {
        this.timer = 0;
        this.shouldRemoveDurationClass.set(false);
      }
      onCleanUp(() => {
        clearInterval(intervalId);
      });
    });
  }

  onDragMoved() {
    this.shouldRemoveDurationClass.set(true);
  }

  onDropped() {
    this.shouldRemoveDurationClass.set(false);
    const toastEle = this.toastEleRef().nativeElement;
    const boundingBox = toastEle.getBoundingClientRect();
    if (
      boundingBox &&
      boundingBox.top &&
      boundingBox.top > this.screenHeight - 50
    ) {
      this.closeToast.emit();
    }
  }
}
