import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import FormLeavingConfirmationDialogComponent from '../components/form-leaving-confirmation-dialog/form-leaving-confirmation-dialog.component';
import { Nullable } from '../models';

@Directive({ selector: '[appForm]', host: {}, exportAs: 'appForm' })
export default class FormDirective {
  vcf = inject(ViewContainerRef);
  formEleRef: ElementRef<HTMLFormElement> = inject(ElementRef<HTMLFormElement>);
  private renderer = inject(Renderer2);
  formLeavingConfirmationDialogComponentRef: Nullable<
    ComponentRef<FormLeavingConfirmationDialogComponent>
  > = null;

  router = inject(Router);
  isDirty = signal<boolean>(false);
  confirmOnLeavingDialogVisible = signal(false);

  constructor() {
    this.renderer.listen(
      this.formEleRef.nativeElement,
      'click',
      (e: SubmitEvent) => {
        e.preventDefault();
      },
    );
    if (this.formLeavingConfirmationDialogComponentRef) return;
    this.formLeavingConfirmationDialogComponentRef = this.vcf.createComponent(
      FormLeavingConfirmationDialogComponent,
    );
    this.formLeavingConfirmationDialogComponentRef.setInput('form', this);
  }

  onLeaveForm(backToPath: string) {
    if (this.isDirty()) {
      this.confirmOnLeavingDialogVisible.set(true);
    } else {
      this.router.navigate([backToPath]);
    }
  }
}
