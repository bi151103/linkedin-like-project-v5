import { Component, computed, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

export type ButtonType = 'back';

@Component({
  selector: 'button[appIconButton]',
  imports: [SvgIconComponent],
  template: `
    <ng-container>
      <svg-icon
        src="{{ srcMapConfig().src }}"
        class="aspect-square w-3/5"
        svgClass="h-full w-full"
      ></svg-icon>
    </ng-container>
  `,
  host: {
    class:
      'min-w-md-img w-md-img h-md-img flex h-full items-center justify-center',
  },
})
export default class IconButtonComponent {
  btnType = input.required<ButtonType>();

  srcMapConfig = computed(() => {
    const config: Record<ButtonType, { src: string }> = {
      back: {
        src: 'assets/icons/icons8-left-100.svg',
      },
    };
    return config[this.btnType()];
  });
}
