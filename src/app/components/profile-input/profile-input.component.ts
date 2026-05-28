import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
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
import FloatingInputLabelDirective from '../../directives/floating-input-label.directive';

export type FieldType =
  | 'firstName'
  | 'lastName'
  | 'headline'
  | 'education'
  | 'industry'
  | 'location'
  | 'country'
  | 'about';

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
  ],
  template: `
    <ng-container>
      <div
        #inputContainer
        [class]="
          [
            'relative rounded-[4px] border-[1.5px] border-[rgba(0,0,0,0.6)]',
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
            [(ngModel)]="inputValue"
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
            (focus)="lossFocus.set(false)"
            (input)="onInput()"
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
            [(ngModel)]="inputValue"
            #input
            autocomplete="off"
            [class]="
              [
                'text-emphasis-tx pt-20px pb-10px pl-15px pr-50px w-full align-middle',
                shouldShowInputError() ? 'outline-error' : '',
              ] | twMerge
            "
            (blur)="lossFocus.set(true)"
            (focus)="lossFocus.set(false)"
            (input)="onInput()"
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
      @if (shouldShowInputError()) {
        <span class="text-error text-xs-small ml-15px">{{
          textConfigs().error
        }}</span>
      }
    </ng-container>
  `,
  host: { class: 'block not-first:mt-10px' },
})
export default class ProfileInputComponent implements OnInit {
  textBoxType = input<TextBoxInputType>('input');
  userInfoService = inject(UserInfoService);
  inputValue = model.required<string>();
  inputContainerEle =
    viewChild.required<ElementRef<HTMLElement>>('inputContainer');
  inputEleRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
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
  shouldFloatLabel = computed(
    () => !!(this.inputValue() || (!this.lossFocus() && !this.inputValue())),
  );
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
    };
    return configs[field] || { label: '', error: '' };
  });

  notifyChanges() {
    this.dirty.emit();
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

  onInput() {
    this.notifyChanges();
  }

  onDropdownSelect(selected: Education) {
    if (selected.id !== this.selectedEducationId()) {
      this.selectedEducationId.set(selected.id);
      this.inputValue.set(selected.institution.educationName);
      this.notifyChanges();
    }
  }

  async ngOnInit() {
    this.selectedEducationId.set(
      (await this.userInfoService.getUserInfo()).education?.id,
    );
  }
}
