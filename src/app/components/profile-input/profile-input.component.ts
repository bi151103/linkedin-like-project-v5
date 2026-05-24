import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Optional } from '../../models';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Education } from '../../services/models/education';
import UserInfoService from '../../services/user-info.service';
import TwMergePipe from '../../directives/tw-merge.directive';
import FloatingButtonInputComponent from '../../directives/floating-button-input.component';

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
  imports: [
    SvgIconComponent,
    FormsModule,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    TwMergePipe,
    FloatingButtonInputComponent,
  ],
  template: `
    <ng-container>
      <div
        #inputContainer
        class="relative rounded-[4px] border-[1.5px] border-[rgba(0,0,0,0.6)]"
        #educationDropdownBtn="cdkOverlayOrigin"
        cdkOverlayOrigin
        (click)="isEducationDropdownOpen.set(!isEducationDropdownOpen())"
      >
        <input
          [(ngModel)]="inputValue"
          #input
          autocomplete="off"
          type="text"
          class="text-emphasis-tx pt-20px pb-10px pl-15px pr-50px text-medium w-full"
          (blur)="lossFocus.set(true)"
          (focus)="lossFocus.set(false)"
          (input)="onInput()"
          [name]="type()"
        />
        <label
          #label
          class="text-low-emphasis-tx top-5px left-15px absolute duration-[0.1s]"
          (click)="onLabelClick()"
          >{{ labelText() }}</label
        >
        @if (type() === 'education') {
          <button
            class="right-15px absolute top-0 bottom-0"
            appFloatingButtonInput
            floatingType="dropdown"
          ></button>
          <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOpen]="isEducationDropdownOpen()"
            [cdkConnectedOverlayOrigin]="educationDropdownBtn"
            (overlayOutsideClick)="isEducationDropdownOpen.set(false)"
            [cdkConnectedOverlayHasBackdrop]="true"
            [cdkConnectedOverlayBackdropClass]="'bg-transparent'"
          >
            <div
              class="text-small px-15px py-20px border-separator-line block max-h-[300px] w-[250px] rounded-[4px] border bg-white shadow-2xl"
            >
              <ul>
                @for (education of educationList(); track education.id) {
                  <li
                    [class]="
                      [
                        'not-first:mt-15px rounded-[2px] p-[2px]',
                        education.id === selectedEducationId()
                          ? 'bg-gray-200'
                          : '',
                      ] | twMerge
                    "
                    (click)="onDropdownSelect(education)"
                  >
                    {{ education.institution.educationName }}
                  </li>
                }
              </ul>
            </div>
          </ng-template>
        } @else if (clearable()) {
          @if (isRequired() && !inputValue() && lossFocus()) {
            <svg-icon
              class="right-15px h-sm-img w-sm-img absolute top-0 bottom-0 my-auto"
              src="assets/icons/icons8-forbidden-100.svg"
            ></svg-icon>
          } @else {
            <button
              appFloatingButtonInput
              floatingType="clear"
              (click)="clearInput()"
            ></button>
          }
        }
      </div>
      @if (isRequired() && !inputValue() && lossFocus()) {
        <span class="text-error text-xs-small ml-15px">{{
          errorMsgText()
        }}</span>
      }
    </ng-container>
  `,
  host: { class: 'block not-first:mt-10px' },
})
export default class ProfileInputComponent {
  _console = console;
  userInfoService = inject(UserInfoService);
  inputValue = model.required<string>();
  inputContainerEle =
    viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  labelEle = viewChild.required<ElementRef<HTMLLabelElement>>('label');
  inputEleRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  labelText = signal<string>('');
  type = input.required<fieldType>();
  isRequired = input(false);
  clearable = input<boolean>();
  errorMsgText = signal<string>('');
  lossFocus = signal(true);
  isEducationDropdownOpen = signal(false);
  educationList = input<Education[]>([]);
  currentEducation = signal<Optional<Education>>(undefined);
  selectedEducationId = model<Optional<string>>(undefined);
  isDirty = signal(false);
  dirty = output();
  isValid = signal(false);
  valid = output();

  onDirty() {
    this.dirty.emit();
    if (this.isValid()) {
      this.valid.emit();
    }
  }

  constructor() {
    this.userInfoService.getUserInfo().then((data) => {
      this.currentEducation.set(data.education);
      this.selectedEducationId.set(this.currentEducation()?.id);
    });
    effect(() => {
      if (this.inputValue() || (!this.lossFocus() && !this.inputValue())) {
        this.labelEle().nativeElement.classList.add('text-xs-small');
        this.labelEle().nativeElement.classList.remove(
          'text-medium',
          'top-[calc(5px+1.2rem)]',
        );
      } else {
        this.labelEle().nativeElement.classList.remove('text-xs-small');
        this.labelEle().nativeElement.classList.add(
          'text-medium',
          'top-[calc(5px+1.2rem)]',
        );
      }
      if (this.isRequired() && this.lossFocus() && !this.inputValue()) {
        this.inputContainerEle().nativeElement.classList.add('border-error');
        this.inputEleRef().nativeElement.classList.add('outline-error');
      } else {
        this.inputContainerEle().nativeElement.classList.remove('border-error');
        this.inputEleRef().nativeElement.classList.remove('outline-error');
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
      this.isValid.set(
        !this.isRequired() || (this.isRequired() && !!this.inputValue()),
      );
    });
  }

  onLabelClick() {
    this.lossFocus.set(false);
    this.inputEleRef().nativeElement.focus();
  }

  clearInput() {
    this.isDirty.set(true);
    this.onDirty();
    this.lossFocus.set(false);
    this.inputEleRef().nativeElement.focus();
    this.inputValue.set('');
  }

  onInput() {
    this.isDirty.set(true);
    this.onDirty();
  }

  onDropdownSelect(selected: Education) {
    if (selected.id !== this.selectedEducationId()) {
      this.selectedEducationId.set(selected.id);
      this.inputValue.set(selected.institution.educationName);
      this.isDirty.set(true);
      this.onDirty();
    }
  }
}
