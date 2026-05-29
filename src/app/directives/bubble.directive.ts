import { computed, Directive, inject, input } from '@angular/core';
import TwMergePipe from '../pipes/tw-merge.pipe';

@Directive({
  selector: 'span[appBubble]',
  providers: [TwMergePipe],
  host: {
    '[class]': 'computedClass()',
  },
})
export class BubbleDirective {
  twMerge = inject(TwMergePipe);
  adjustedRightPositionClass = input<string>('right-15px');

  computedClass = computed(() => {
    return this.twMerge.transform([
      'w-sm-noti-bubble h-sm-noti-bubble flex items-center justify-center top-0 absolute rounded-full bg-[#ce1d23] text-white',
      this.adjustedRightPositionClass(),
    ]);
  });
}
