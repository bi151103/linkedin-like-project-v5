import {
  Component,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Optional } from '../../models';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';

export type fieldType =
  | 'firstName'
  | 'lastName'
  | 'headline'
  | 'education'
  | 'industry'
  | 'location'
  | 'country';

@Component({
  selector: 'app-profile-input',
  imports: [SvgIconComponent, FormsModule],
  template: `
    <ng-container>
      <div
        #inputContainer
        class="relative rounded-[4px] border-[1.5px] border-[rgba(0,0,0,0.6)]"
      >
        <input
          [(ngModel)]="inputValue"
          #input
          autocomplete="off"
          type="text"
          class="text-emphasis-tx pt-20px pb-10px pl-15px pr-50px text-medium w-full"
          value="{{ inputValue() }}"
          (blur)="isDirty.set(true)"
        />
        <label
          #label
          class="text-low-emphasis-tx top-5px left-15px absolute duration-[0.1s]"
          >{{ labelText() }}</label
        >
        <button
          class="right-15px absolute top-0 bottom-0"
          (click)="clearInput()"
        >
          @if (isRequired() && !inputValue() && isDirty()) {
            <img
              src="assets/images/icons8-forbidden-100.png"
              class="h-sm-img w-sm-img"
            />
          } @else {
            <svg-icon
              [src]="'assets/icons/close-01.svg'"
              class="w-25px aspect-square"
            ></svg-icon>
          }
        </button>
      </div>
      @if (isRequired() && !inputValue() && isDirty()) {
        <span class="text-error text-xs-small ml-15px">{{
          errorMsgText()
        }}</span>
      }
    </ng-container>
  `,
  host: { class: 'block not-first:mt-10px' },
})
export default class ProfileInputComponent {
  inputValue = model<Optional<string>>('');
  inputContainerEle =
    viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  labelEle = viewChild.required<ElementRef<HTMLLabelElement>>('label');
  inputEle = viewChild.required<ElementRef<HTMLInputElement>>('input');
  labelText = signal<string>('');
  type = input.required<fieldType>();
  isRequired = input(false);
  errorMsgText = signal<string>('');
  isDirty = signal(false);

  constructor() {
    effect(() => {
      if (this.inputValue()) {
        this.labelEle().nativeElement.classList.add('text-xs-small');
        this.labelEle().nativeElement.classList.remove(
          'text-medium',
          'top-[calc(5px+1.2rem)]',
        );
        if (this.isRequired() && this.isDirty()) {
          this.inputContainerEle().nativeElement.classList.remove(
            'border-error',
          );
          this.inputEle().nativeElement.classList.remove('outline-error');
        }
        this.isDirty.set(false);
      } else {
        this.labelEle().nativeElement.classList.remove('text-xs-small');
        this.labelEle().nativeElement.classList.add(
          'text-medium',
          'top-[calc(5px+1.2rem)]',
        );
        if (this.isRequired() && this.isDirty()) {
          this.inputContainerEle().nativeElement.classList.add('border-error');
          this.inputEle().nativeElement.classList.add('outline-error');
        }
      }
      switch (this.type()) {
        case 'firstName':
          this.labelText.set('First name');
          this.errorMsgText.set('Please enter your first name.');
          break;
        case 'lastName':
          this.labelText.set('Last name');
          this.errorMsgText.set('Please enter your last name.');
          break;
        case 'headline':
          this.labelText.set('Headline');
          break;
        case 'education':
          this.labelText.set('Education');
          break;
        case 'country':
          this.labelText.set('Country/Region');
          this.errorMsgText.set('Please select a country/region.');
          break;
        case 'industry':
          this.labelText.set('Industry');
          this.errorMsgText.set('Please select your industry.');
          break;
        case 'location':
          this.labelText.set('Locations in this Country/Region');
          break;
        default:
      }
    });
  }

  clearInput() {
    if (this.isRequired() && !this.inputValue() && this.isDirty()) {
      return;
    }
    if (this.isDirty()) {
      this.isDirty.set(false);
    }
    this.inputEle().nativeElement.focus();
    this.inputValue.set('');
  }
}
