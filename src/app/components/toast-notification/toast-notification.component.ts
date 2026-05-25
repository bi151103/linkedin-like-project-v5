import {
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

export type ToastNotificationType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-toast-notification',
  imports: [
    OverlayDirective,
    DialogComponent,
    CdkDrag,
    TwMergePipe,
    TimeMilToSecPipe,
  ],
  template: `
    <ng-container>
      <div appOverlay [hasBackdrop]="false" id="toast">
        <app-dialog [isVisible]="true">
          <div
            [class]="
              [
                'h-50px bottom-40px text-success fixed right-0 left-0 mx-auto flex w-[80vw] items-center bg-white font-medium shadow-2xl duration-500',
                elapsed() > 0 && isVisible()
                  ? 'translate-0 opacity-100'
                  : 'translate-y-[100px] opacity-0',
                shouldRemoveDurationClass() ? 'duration-0' : '',
              ] | twMerge
            "
            cdkDrag
            [cdkDragBoundary]="dragBoundary"
            [cdkDragDisabled]="false"
            (cdkDragMoved)="onDragMoved($event)"
            (cdkDragEnded)="onDropped()"
            #draggableElement
          >
            <span class="w-5px bg-success mr-auto h-full"></span>
            <span class="ml-10px px-10px grow">{{ message() }}</span>
            <span class="mr-20px text-emphasis-tx"
              >{{ elapsed() | timeMilToSec }}
            </span>
          </div>
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
  _console = console;
  isVisible = model(false);
  closeBy = input.required<'swiping' | 'clickingCloseBtn'>();
  type = model.required<ToastNotificationType>();
  message = model<string>('');
  toastEleRef = viewChild.required<ElementRef<HTMLElement>>('draggableElement');
  toastEleDirective = viewChild.required('draggableElement', { read: CdkDrag });
  screenHeight = window.innerHeight;
  elapsed = signal<number>(0);
  closeToast = output();
  shouldRemoveDurationClass = signal(false);
  intervalId = 0;

  constructor() {
    effect(() => {
      const toastEle = this.toastEleRef().nativeElement;
      if (this.isVisible()) {
        const timer = 5000; //ms
        this.elapsed.set(timer);

        this.intervalId = setInterval(() => {
          this.elapsed.set(this.elapsed() - 1000);
          if (this.elapsed() <= 0) {
            clearInterval(this.intervalId);
            this.closeToast.emit();
            this.elapsed.set(0);
          }
        }, 1000);
        toastEle.style.translate = 'none';
      } else {
        toastEle.style.translate = '0 100px';
        this.shouldRemoveDurationClass.set(false);
      }
    });
  }

  onDragMoved(event: CdkDragMove) {
    const { x, y } = event.distance;
    this.shouldRemoveDurationClass.set(true);
    this.toastEleRef().nativeElement.setAttribute(
      'style',
      `translate: ${x}px ${y}px`,
    );
  }

  onDropped() {
    this.shouldRemoveDurationClass.set(false);
    const toastEle = this.toastEleRef().nativeElement;
    const { top } = toastEle.getBoundingClientRect();
    if (top > this.screenHeight - 50) {
      clearInterval(this.intervalId);
      this.closeToast.emit();
      this.elapsed.set(0);
    }
  }
}
