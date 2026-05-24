import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Optional } from '../../models';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import DialogComponent from '../dialog/dialog.component';
import OverlayDirective from '../overlay/overlay.component';
import { Education } from '../../services/models/education';
import UserInfoService from '../../services/user-info.service';
import TwMergePipe from '../../directives/tw-merge.directive';

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
  ],
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
          (blur)="lossFocus.set(true)"
          (input)="lossFocus.set(false)"
        />
        <label
          #label
          class="text-low-emphasis-tx top-5px left-15px absolute duration-[0.1s]"
          >{{ labelText() }}</label
        >
        @if (type() !== 'education') {
          @if (isRequired() && !inputValue() && lossFocus()) {
            <button class="right-15px absolute top-0 bottom-0">
              <img
                src="assets/images/icons8-forbidden-100.png"
                class="h-sm-img w-sm-img"
              />
            </button>
          } @else {
            <button
              class="right-15px absolute top-0 bottom-0"
              (click)="clearInput()"
            >
              <svg-icon
                [src]="'assets/icons/close-01.svg'"
                class="w-25px aspect-square"
              ></svg-icon>
            </button>
          }
        } @else {
          <button
            #educationDropdownBtn="cdkOverlayOrigin"
            class="right-15px absolute top-0 bottom-0"
            cdkOverlayOrigin
            (click)="isEducationDropdownOpen.set(!isEducationDropdownOpen())"
          >
            <img
              src="assets/images/icons8-sort-down-100.png"
              class="h-sm-img w-sm-img"
            />
          </button>
          <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOpen]="isEducationDropdownOpen()"
            [cdkConnectedOverlayOrigin]="educationDropdownBtn"
            (overlayOutsideClick)="isEducationDropdownOpen.set(false)"
          >
            <div
              class="text-small px-15px py-20px border-separator-line max-h-[300px] w-[250px] rounded-[4px] border bg-white shadow-2xl"
            >
              <ul>
                @for (education of educationList(); track education.id) {
                  <li
                    [class]="
                      [
                        'not-first:mt-15px rounded-[2px] p-[2px]',
                        education.institution.id === selectedEducationId()
                          ? 'bg-gray-200'
                          : '',
                      ] | twMerge
                    "
                    (click)="selectedEducationId.set(education.institution.id)"
                  >
                    {{ education.institution.educationName }}
                  </li>
                }
              </ul>
            </div>
          </ng-template>
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
  userInfoService = inject(UserInfoService);
  inputValue = model<Optional<string>>('');
  inputContainerEle =
    viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  labelEle = viewChild.required<ElementRef<HTMLLabelElement>>('label');
  inputEleRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  labelText = signal<string>('');
  type = input.required<fieldType>();
  isRequired = input(false);
  errorMsgText = signal<string>('');
  lossFocus = signal(false);
  isEducationDropdownOpen = signal(false);
  educationList = input<Education[]>([]);
  currentEducation = signal<
    Optional<{
      id: string;
      institution: {
        id: string;
        educationName: string;
        educationLogoSrc: string;
      };
    }>
  >(undefined);
  selectedEducationId = model<Optional<string>>(undefined);

  constructor() {
    this.userInfoService.getUserInfo().then((data) => {
      this.currentEducation.set(data.education);
      this.selectedEducationId.set(this.currentEducation()?.institution.id);
    });
    effect(() => {
      if (this.inputValue()) {
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
    });
  }

  clearInput() {
    this.lossFocus.set(false);
    this.inputEleRef().nativeElement.focus();
    this.inputValue.set('');
  }
}
