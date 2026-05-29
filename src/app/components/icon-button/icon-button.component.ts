import { Component, computed, inject, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import TwMergePipe from '../../pipes/tw-merge.pipe';

export type IconButtonType = 'back' | 'x-close';

export type IconButtonSize = string;

@Component({
  selector: 'button[appIconButton]',
  imports: [SvgIconComponent],
  providers: [TwMergePipe],
  template: `
    <ng-container>
      <svg-icon
        src="{{ srcMapConfig().src }}"
        [class]="iconSizeMap()"
        svgClass="h-full w-full"
      ></svg-icon>
    </ng-container>
  `,
  host: {
    '[class]': 'hostComputedClass()',
  },
})
export default class IconButtonComponent {
  twMerge = inject(TwMergePipe);

  iconSize = input.required<IconButtonSize>();

  btnType = input.required<IconButtonType>();
  addClass = input<string>('');

  srcMapConfig = computed(() => {
    const config: Record<IconButtonType, { src: string }> = {
      back: {
        src: 'assets/icons/icons8-left-100.svg',
      },
      'x-close': {
        src: 'assets/icons/icons8-close-100.svg',
      },
    };
    return config[this.btnType()];
  });
  iconSizeMap = computed(() => {
    const map: Record<IconButtonSize, string> = {
      'md-img': 'min-w-md-img w-md-img h-md-img',
      'sm-img': 'min-w-sm-img w-sm-img h-sm-img',
    };
    return (
      map[this.iconSize()] ??
      `w-[${this.iconSize()}px] h-[${this.iconSize()}px]`
    );
  });

  hostComputedClass = computed(() => {
    return this.twMerge.transform([
      'flex h-full items-center justify-center',
      this.addClass(),
    ]);
  });
}
