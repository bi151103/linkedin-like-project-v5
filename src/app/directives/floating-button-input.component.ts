import {
  Component,
  effect,
  inject,
  input,
  Renderer2,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

export type FloatingButtonInputType = 'clear' | 'dropdown';

@Component({
  selector: 'button[appFloatingButtonInput]',
  template: `
    <svg-icon
      [src]="
        floatingType() === 'clear'
          ? 'assets/icons/close-01.svg'
          : 'assets/icons/icons8-sort-down-100.svg'
      "
      class="w-25px aspect-square"
    ></svg-icon>
  `,
  imports: [SvgIconComponent],
  host: {
    class: 'inline-block right-15px absolute top-0 bottom-0',
  },
})
export default class FloatingButtonInputComponent {
  floatingType = input<FloatingButtonInputType>('clear');
}
