import {
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import TwMergePipe from './tw-merge.directive';
import { Nullable } from '../models';

@Directive({
  selector: '[appFloatingInputLabel]',
  providers: [TwMergePipe],
  host: {},
})
export default class FloatingInputLabelDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  twMerge = inject(TwMergePipe);

  viewRef: Nullable<EmbeddedViewRef<unknown>> = null;
  labelEle: Nullable<HTMLLabelElement> = null;

  appFloatingInputLabel = input<string>('');
  appFloatingInputLabelLabelFor = input<string>('');
  appFloatingInputLabelShouldFloatLabel = input.required<boolean>();

  constructor() {
    this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);

    effect(() => {
      if (!this.viewRef) return;
      if (this.labelEle) {
        this.renderer.setAttribute(
          this.labelEle,
          'class',
          this.twMerge.transform([
            'text-low-emphasis-tx top-5px left-15px absolute duration-[0.1s]',
            this.appFloatingInputLabelShouldFloatLabel()
              ? 'text-xs-small'
              : 'text-medium top-[calc(5px+1.2rem)]',
          ]),
        );
        return;
      }

      const inputEle = this.viewRef.rootNodes[0] as HTMLElement;
      const inputContainer = this.renderer.parentNode(inputEle) as HTMLElement;

      this.labelEle = this.renderer.createElement('label') as HTMLLabelElement;
      this.renderer.setAttribute(
        this.labelEle,
        'class',
        this.twMerge.transform([
          'text-low-emphasis-tx top-5px left-15px absolute duration-[0.1s]',
          this.appFloatingInputLabelShouldFloatLabel()
            ? 'text-xs-small'
            : 'text-medium top-[calc(5px+1.2rem)]',
        ]),
      );
      this.renderer.setProperty(
        this.labelEle,
        'textContent',
        this.appFloatingInputLabel(),
      );
      this.renderer.setAttribute(
        this.labelEle,
        'for',
        this.appFloatingInputLabelLabelFor(),
      );
      this.renderer.appendChild(inputContainer, this.labelEle);
      this.renderer.listen(this.labelEle, 'click', () => {
        inputEle.focus();
      });
    });
  }
}
