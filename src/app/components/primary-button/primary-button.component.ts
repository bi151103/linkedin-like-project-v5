import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'button[appPrimaryButton]',
  imports: [SvgIconComponent],
  template: `
    <ng-container>
      <svg-icon
        src="assets/icons/icons8-plus-100.svg"
        class="mr-5px"
        svgClass="w-[1.5rem] h-[1.5rem]"
      ></svg-icon>
      <ng-content></ng-content>
    </ng-container>
  `,
  host: {
    class: 'flex items-center',
  },
})
export default class PrimaryButtonComponent {}
