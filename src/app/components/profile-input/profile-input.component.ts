import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Nullable, Optional } from '../../models';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Education } from '../../services/models/education';
import UserInfoService from '../../services/user-info.service';
import TwMergePipe from '../../pipes/tw-merge.pipe';
import FloatingButtonInputComponent from '../../directives/floating-button-input.component';
import FloatingInputLabelDirective from '../../directives/floating-input-label.directive';
import OverlayDirective from '../overlay/overlay.component';
import DialogComponent from '../dialog/dialog.component';
import ComboboxSelectComponentDialog from '../combobox-select-dialog/combobox-select-dialog.component';
import { Industry } from '../../services/models/industry';
import { Country } from '../../services/models/country';
import { Location } from '../../services/models/location';

export type FieldType =
  | 'firstName'
  | 'lastName'
  | 'headline'
  | 'education'
  | 'industry'
  | 'location'
  | 'country'
  | 'about'
  | 'featured-name'
  | 'featured-description'
  | 'link';

export type TextBoxInputType = 'input' | 'textarea';

@Component({
  selector: 'app-profile-input',
  imports: [
    SvgIconComponent,
    FormsModule,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    TwMergePipe,
    FloatingButtonInputComponent,
    FloatingInputLabelDirective,
    OverlayDirective,
    DialogComponent,
    ComboboxSelectComponentDialog,
  ],
  template: `
    <ng-container>
      <div
        #inputContainer
        [class]="
          [
            'relative rounded-xs border-[1.5px] border-[rgba(0,0,0,0.6)]',
            shouldShowInputError() ? 'border-error' : '',
          ] | twMerge
        "
        #educationDropdownBtn="cdkOverlayOrigin"
        cdkOverlayOrigin
        (click)="isEducationDropdownOpen.set(true)"
      >
        @if (textBoxType() === 'input') {
          <input
            [id]="type()"
            [ngModel]="inputPopulatedValue()"
            (ngModelChange)="onInput($event)"
            #input
            autocomplete="off"
            type="text"
            [class]="
              [
                'text-emphasis-tx pt-20px pb-10px pl-15px pr-50px text-medium w-full',
                shouldShowInputError() ? 'outline-error' : '',
              ] | twMerge
            "
            (blur)="lossFocus.set(true)"
            (focus)="onInputFocus()"
            [name]="type()"
            *appFloatingInputLabel="
              textConfigs().label;
              labelFor: type();
              shouldFloatLabel: shouldFloatLabel()
            "
          />
        } @else {
          <!-- need to add align-middle to remove the space under the input (the space is dedicated for letters such as q, y p, g) -->
          <textarea
            rows="5"
            [id]="type()"
            [ngModel]="inputPopulatedValue()"
            (ngModelChange)="onInput($event)"
            #input
            autocomplete="off"
            [class]="
              [
                'text-emphasis-tx pt-20px pb-10px pl-15px pr-50px w-full align-middle',
                shouldShowInputError() ? 'outline-error' : '',
              ] | twMerge
            "
            (blur)="lossFocus.set(true)"
            (focus)="onInputFocus()"
            [name]="type()"
            *appFloatingInputLabel="
              textConfigs().label;
              labelFor: type();
              shouldFloatLabel: shouldFloatLabel()
            "
          ></textarea>
        }
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
          >
            <div
              class="text-small px-15px py-20px border-separator-line block max-h-[300px] w-[250px] rounded-xs border bg-white shadow-2xl"
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
          @if (shouldShowInputError()) {
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
      @if (shouldShowInputError() && textConfigs().error) {
        <span class="text-error text-xs-small ml-15px">{{
          textConfigs().error
        }}</span>
      }
    </ng-container>
    @if (
      type() === 'industry' || type() === 'country' || type() === 'location'
    ) {
      <div appOverlay>
        <app-dialog [isVisible]="false">
          <app-combobox-select-dialog
            #comboboxSelectDialog
            [inputType]="type()"
            [(inputValue)]="inputValue"
            (inputValueChange)="
              inputChange.emit(inputValue()); _console.log(inputValue())
            "
            [inputPopulatedValue]="inputPopulatedValue()"
          ></app-combobox-select-dialog>
        </app-dialog>
      </div>
    }
  `,
  host: { class: 'block not-first:mt-10px' },
})
export default class ProfileInputComponent {
  _console = console;
  textBoxType = input<TextBoxInputType>('input');
  userInfoService = inject(UserInfoService);
  inputValue = model<unknown>();
  inputPopulatedValue = computed(() => {
    switch (this.type()) {
      case 'industry':
        return this.inputValue() as Industry;
      case 'country':
        return (this.inputValue() as Nullable<Country>)?.name ?? '';
      case 'location':
        return (this.inputValue() as [Nullable<Country>, Location])[1] ?? '';
      case 'firstName':
        return this.inputValue() as string;
      default:
        return this.inputValue() as string;
    }
  });

  inputContainerEle =
    viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  inputEleRef = viewChild.required<ElementRef<HTMLElement>>('input');
  comboboxSelectDialog = viewChild('comboboxSelectDialog', {
    read: ComboboxSelectComponentDialog,
  });

  inputChange = output<unknown>();
  type = input.required<FieldType>();
  isRequired = input(false);
  clearable = input<boolean>(false);
  lossFocus = signal(true);
  isEducationDropdownOpen = signal(false);
  educationList = input<Education[]>([]);
  selectedEducationId = model<Optional<string>>(undefined);
  dirty = output();
  isValid = computed(
    () => !this.isRequired() || (this.isRequired() && !!this.inputValue()),
  );
  valid = output();
  shouldFloatLabel = computed(() => {
    if (this.type() === 'location')
      return !!(
        (this.inputValue() as [Nullable<Country>, Location])[1] ||
        (!this.lossFocus() &&
          !(this.inputValue() as [Nullable<Country>, Location])[1])
      );
    else {
      return !!(this.inputValue() || (!this.lossFocus() && !this.inputValue()));
    }
  });
  shouldShowInputError = computed(
    () => this.isRequired() && this.lossFocus() && !this.inputValue(),
  );
  textConfigs = computed(() => {
    const field = this.type();
    const configs: Record<FieldType, { label: string; error?: string }> = {
      firstName: {
        label: 'First name',
        error: 'Please enter your first name.',
      },
      lastName: { label: 'Last name', error: 'Please enter your last name.' },
      headline: { label: 'Headline' },
      education: { label: 'Education', error: 'Please select an education' },
      country: {
        label: 'Country/Region',
        error: 'Please select a country/region.',
      },
      industry: { label: 'Industry', error: 'Please select your industry.' },
      location: { label: 'Locations in this Country/Region', error: '' },
      about: {
        label: 'Summary',
      },
      'featured-name': {
        label: 'Title',
        error: 'Please enter the title',
      },
      'featured-description': {
        label: 'Description (optional)',
      },
      link: {
        label: 'Link',
      },
    };
    return configs[field] || { label: '', error: '' };
  });

  notifyChanges() {
    this.dirty.emit();
    // this.inputChange.emit(this.inputValue());
    if (this.isValid()) {
      this.valid.emit();
    }
  }

  onLabelClick() {
    this.lossFocus.set(false);
    this.inputEleRef().nativeElement.focus();
  }

  clearInput() {
    this.inputValue.set('');
    this.inputEleRef().nativeElement.focus();
    this.lossFocus.set(false);
    this.notifyChanges();
  }

  onInput(value: string) {
    this.inputValue.set(value);
    this.notifyChanges();
  }

  onDropdownSelect(selected: Education) {
    if (selected.id !== this.selectedEducationId()) {
      this.selectedEducationId.set(selected.id);
      this.inputValue.set(selected.institution.educationName);
      this.notifyChanges();
    }
  }

  onInputFocus() {
    this.lossFocus.set(false);
    this.comboboxSelectDialog()?.dialogComponent.isVisible.set(true);
  }

  constructor() {
    this.userInfoService.getUserInfo().subscribe((data) => {
      this.selectedEducationId.set(data.education?.id);
    });
  }
}
