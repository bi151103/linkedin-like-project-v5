import {
  AfterViewInit,
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
import IconButtonComponent from '../icon-button/icon-button.component';
import DialogComponent from '../dialog/dialog.component';
import { FieldType } from '../profile-input/profile-input.component';
import TwMergePipe from '../../pipes/tw-merge.pipe';
import { Industry } from '../../services/models/industry';
import { Country } from '../../services/models/country';
import ProfileService from '../../services/profile.service';
import {
  debounceTime,
  defer,
  fromEvent,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Location } from '../../services/models/location';
import { IndustryResponse } from '../../services/models/industry-response';
import { CountryResponse } from '../../services/models/country-response';
import { AsyncPipe } from '@angular/common';
import { LocationResponse } from '../../services/models/location-response';
import { SvgIconComponent } from 'angular-svg-icon';
import { Nullable } from '../../models';
import { P } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-combobox-select-dialog',
  imports: [
    IconButtonComponent,
    TwMergePipe,
    AsyncPipe,
    SvgIconComponent,
    FormsModule,
  ],
  template: `
    <ng-container>
      @let locationTemp$ = location$ | async;
      @let countryTemp$ = country$ | async;
      @let industryTemp$ = industry$ | async;
      <div class="h-50px flex items-center">
        <button
          appIconButton
          iconSize="30"
          (click)="onCloseDialog()"
          addClass="min-w-md-img w-md-img"
          btnType="back"
        ></button
        ><input
          #input
          [value]="inputPopulatedValue()"
          (input)="onInput($event)"
          [placeholder]="
            'Search for ' +
            (inputType() === 'industry'
              ? 'industry'
              : inputType() === 'country'
                ? 'country/region'
                : 'locations') +
            '...'
          "
          class="pl-20px pr-10px text-medium text-emphasis-tx basis-[calc(100%-100px)] rounded-[2px] pt-[4px] font-bold focus:outline-2"
        />
        <button
          appIconButton
          iconSize="sm-img"
          btnType="x-close"
          [addClass]="
            ['min-w-md-img w-md-img', inputValue() ? '' : 'hidden'] | twMerge
          "
          (click)="onClearSearch()"
        ></button>
      </div>
      <ul>
        @if (inputType() === 'country') {
          @for (item of countryTemp$; track item.id) {
            <li
              (click)="onOptionSelect(item, inputType())"
              class="py-8px pr-15p text-medium text-emphasis-tx border-separator-line flex items-center border-b first:border-t"
            >
              <svg-icon
                src="assets/icons/icons8-location-100.svg"
                class="min-w-sm-img mx-15px"
              ></svg-icon>
              <span class="ml-15px">
                {{ item.name }}
              </span>
            </li>
          }
        } @else if (inputType() === 'industry') {
          @for (item of industryTemp$; track item) {
            <li
              (click)="onOptionSelect(item, inputType())"
              class="py-8px pr-15p text-medium text-emphasis-tx border-separator-line flex items-center border-b first:border-t"
            >
              <span class="ml-15px">
                {{ item }}
              </span>
            </li>
          }
        } @else if (inputType() === 'location') {
          @for (item of locationTemp$; track item) {
            <li
              (click)="onOptionSelect(item, inputType())"
              class="py-8px pr-15p text-medium text-emphasis-tx border-separator-line flex items-center border-b first:border-t"
            >
              <span class="ml-15px">
                {{ item }}
              </span>
            </li>
          }
        }
      </ul>
    </ng-container>
  `,
  host: {
    class: 'h-screen w-screen bg-white',
  },
})
export default class ComboboxSelectComponentDialog {
  dialogComponent = inject(DialogComponent);

  profileService = inject(ProfileService);

  input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  inputValue = model<unknown>();

  inputPopulatedValue = model('');
  // computed(() => {
  //   switch (this.inputType()) {
  //     case 'industry':
  //       return this.inputValue() as Industry;
  //     case 'country':
  //       return (this.inputValue() as Country)?.name;
  //     case 'location':
  //       return (this.inputValue() as [Country, Location])[1];
  //     default:
  //       return this.inputValue() as string;
  //   }
  // });

  inputType = input.required<FieldType>();

  onCloseDialog() {
    this.dialogComponent.isVisible.set(false);
  }

  onClearSearch() {
    this.inputPopulatedValue.set('');
  }

  onInput(e: Event) {
    this.inputPopulatedValue.set((e.target as HTMLInputElement).value);
  }

  inputChange$ = toObservable(this.inputPopulatedValue).pipe(debounceTime(500));
  location$?: Observable<Location[]>;
  country$?: Observable<Country[]>;
  industry$?: Observable<Industry[]>;

  constructor() {
    effect(() => {
      if (this.dialogComponent.isVisible()) {
        this.input().nativeElement.focus();
      }
    });
  }

  ngOnInit() {
    if (this.inputType() === 'location') {
      this.location$ = this.inputChange$.pipe(
        switchMap(() =>
          this.profileService
            .getLocations(
              (this.inputValue() as [Nullable<Country>, Location])[0]?.id ?? '',
              this.inputPopulatedValue(),
            )
            .pipe(map<LocationResponse, Location[]>((e) => e.data)),
        ),
      );
    } else if (this.inputType() === 'industry') {
      this.industry$ = this.inputChange$.pipe(
        switchMap(() =>
          this.profileService
            .getIndustries(this.inputPopulatedValue())
            .pipe(map<IndustryResponse, Industry[]>((e) => e.data)),
        ),
      );
    } else if (this.inputType() === 'country') {
      this.country$ = this.inputChange$.pipe(
        switchMap(() =>
          this.profileService.getCountries(this.inputPopulatedValue()).pipe(
            map<CountryResponse, Country[]>((e) => {
              return e.data;
            }),
          ),
        ),
      );
    }
  }

  onOptionSelect(item: unknown, type: FieldType) {
    if (type === 'country') {
      if (
        (item as Country).id === (this.inputValue() as Country).id &&
        this.inputPopulatedValue().length
      ) {
        return;
      } else {
        this.inputValue.set(item as Nullable<Country>);
        this.inputPopulatedValue.set((item as Nullable<Country>)?.name ?? '');
      }
    } else if (type === 'industry') {
      if (item === this.inputValue() && this.inputPopulatedValue().length) {
        return;
      } else {
        this.inputValue.set(item as string);
        this.inputPopulatedValue.set(item as Industry);
      }
    } else if (type === 'location') {
      if (
        item === (this.inputValue() as [Nullable<Country>, Location])[1] &&
        this.inputPopulatedValue().length
      ) {
        return;
      } else {
        this.inputValue.set([
          (this.inputValue() as [Nullable<Country>, Location])[0],
          item,
        ]);
        this.inputPopulatedValue.set(item as Location);
      }
    }
  }
}
