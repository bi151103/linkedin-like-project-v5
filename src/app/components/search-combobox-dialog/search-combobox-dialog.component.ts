import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import DialogComponent from '../dialog/dialog.component';
import ProfileService from '../../services/profile.service';
import { SvgIconComponent } from 'angular-svg-icon';
import OverlayDirective from '../overlay/overlay.component';
import IconButtonComponent from '../icon-button/icon-button.component';
import ToastNotificationService from '../../services/toast-notification.service';
import {
  debounce,
  debounceTime,
  defer,
  from,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  reduce,
  scan,
  shareReplay,
  switchAll,
  switchMap,
  tap,
} from 'rxjs';
import TwMergePipe from '../../pipes/tw-merge.pipe';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Job } from '../../services/models/job';
import { Group } from '../../services/models/group';
import { Institution } from '../../services/models/institution';
import { Person } from '../../services/models/person';
import SearchService from '../../services/search.service';
import { InstitutionResponse } from '../../services/models/institution-response';
import { GroupResponse } from '../../services/models/group-response';
import { JobResponse } from '../../services/models/job-response';
import { PeopleResponse } from '../../services/models/people-response';
import { CompanyResponse } from '../../services/models/company-response';
import ProfileNamePipe from '../../pipes/profile-name.pipe';
import RelationshipToConnectionPipe from '../../pipes/relationship-to-connection.pipe';

export type SearchResType = 'pplRes' | 'insRes' | 'companyRes';
export type SearchItem = {
  type: SearchResType;
  id: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText?: string;
  companyLogoSrc?: string;
  avatarUrl?: string;
  educationLogoSrc?: string;
};

@Component({
  selector: 'app-search-combobox-dialog',
  imports: [
    SvgIconComponent,
    OverlayDirective,
    DialogComponent,
    IconButtonComponent,
    TwMergePipe,
    AsyncPipe,
  ],
  providers: [ProfileNamePipe, RelationshipToConnectionPipe],
  template: `
    <ng-container>
      @let recentSearch$ = recentResultChangeFromInput$ | async;
      @let searchCombobox$ = searchComboboxResult$ | async;
      <div class="h-50px flex items-center">
        <button
          appIconButton
          iconSize="30"
          (click)="onCloseDialog()"
          addClass="min-w-md-img w-md-img"
          btnType="back"
        >
          <img
            src="assets/images/icons8-left-100.png"
            class="aspect-square w-3/5"
          />
        </button>
        <input
          #searchInput
          (input)="onSearchInput()"
          (keydown.enter)="onSearchEnter()"
          [value]="searchInputValue()"
          placeholder="Search"
          class="pl-20px pr-10px text-medium text-emphasis-tx basis-[calc(100%-100px)] rounded-[2px] pt-[4px] font-bold focus:outline-2"
        />
        <button
          appIconButton
          iconSize="sm-img"
          btnType="x-close"
          [addClass]="
            ['min-w-md-img w-md-img', searchInputValue() ? '' : 'hidden']
              | twMerge
          "
          (click)="onClearSearch()"
        ></button>
      </div>
      @if (recentSearch().length && !!!searchInputValue()) {
        <ng-container>
          <div class="p-15px flex justify-between">
            <h3 class="text-emphasis-tx font-medium">Recent search</h3>
            @if (recentSearch() && recentSearch().length > 0) {
              <button
                (click)="clearSearchDialogVisible.set(true)"
                class="px-10px"
              >
                Clear
              </button>
            }
          </div>
          <ul class="mt-10px">
            @for (
              item of recentSearch().slice(
                0,
                _Math.min(5, recentSearch().length)
              );
              track item
            ) {
              <li
                class="border-separator-line py-8px pr-15px flex min-h-[56px] w-full items-center border-b"
              >
                <svg-icon
                  src="assets/icons/time-01.svg"
                  class="mx-[32px]"
                ></svg-icon>
                <span class="text-medium w-full truncate">{{ item }}</span>
              </li>
            }
          </ul>
          @if (
            !recentSearch() || (recentSearch() && recentSearch().length === 0)
          ) {
            <div class="py-20px m-auto max-h-[100px] w-full text-center">
              <img
                src="assets/images/icons8-empty-100.png"
                class="w-md-img h-md-img"
              />
              <p class="text-medium-bold mt-5px text-3xl">Nothing here yet</p>
            </div>
          }
        </ng-container>
      }
      @if (searchInputValue()) {
        <ng-container>
          <ul class="mt-10px">
            @for (recentSearchItem of recentSearch$; track recentSearchItem) {
              @if ($index < _Math.min($count, 3)) {
                <li
                  class="border-separator-line py-8px pr-15px flex min-h-[56px] w-full items-center border-b"
                >
                  <svg-icon
                    src="assets/icons/icons8-search-100.svg"
                    class="mx-[32px]"
                  ></svg-icon>
                  <span class="text-medium w-full truncate">{{
                    recentSearchItem
                  }}</span>
                </li>
              }
            }
            @for (searchItem of searchCombobox$; track searchItem.id) {
              @if (
                $index <
                _Math.min(
                  $count,
                  _Math.max(5, 8 - _Math.min(recentSearch$?.length ?? 0, 3))
                )
              ) {
                <li
                  class="border-separator-line py-8px pr-15px flex min-h-[56px] w-full items-center border-b"
                >
                  <div class="text-medium w-full truncate">
                    @if (searchItem.type === 'companyRes') {
                      @if (searchItem.companyLogoSrc) {
                        <img
                          [src]="searchItem.companyLogoSrc"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      } @else {
                        <img
                          src="assets/images/icons8-company-100.png"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      }
                    } @else if (searchItem.type === 'pplRes') {
                      @if (searchItem.avatarUrl) {
                        <img
                          [src]="searchItem.avatarUrl"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      } @else {
                        <img
                          src="assets/images/icons8-profile-100.png"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      }
                    } @else {
                      @if (searchItem.educationLogoSrc) {
                        <img
                          [src]="searchItem.educationLogoSrc"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      } @else {
                        <img
                          src="assets/images/icons8-company-100.png"
                          class="mx-[32px] h-[32px] w-[32px]"
                        />
                      }
                    }
                    <span class="text-medium text-emphasis-tx">{{
                      searchItem.primaryText
                    }}</span>
                    <span class="text-small">
                      {{ searchItem.secondaryText }} <span class="dot"></span>
                      {{ searchItem.tertiaryText }}
                    </span>
                  </div>
                </li>
              }
            }
            <li
              class="border-separator-line py-8px pr-15px flex min-h-[56px] w-full items-center border-b"
              (click)="
                router.navigateByUrl(
                  'search/result?keyword=' + searchInputValue(),
                  {
                    onSameUrlNavigation: 'reload',
                  }
                )
              "
            >
              <svg-icon
                src="assets/icons/icons8-search-100.svg"
                class="mx-[32px]"
              ></svg-icon>
              <span class="text-medium text-primary-bg w-full truncate"
                >See all result for '{{ searchInputValue() }}'</span
              >
            </li>
          </ul>
        </ng-container>
      }
    </ng-container>
    <div appOverlay [hasBackdrop]="true">
      <app-dialog
        [isVisible]="clearSearchDialogVisible()"
        (closeDialog)="clearSearchDialogVisible.set(false)"
        [closableOnBackdropCLick]="true"
      >
        <div
          class="p-24px fixed top-0 right-0 bottom-0 left-0 z-1003 m-auto h-min max-h-[70vh] w-[70vw] min-w-[300px] overflow-y-auto rounded-[8px] bg-white"
        >
          <h1 class="text-emphasis-tx font-medium">Clear history?</h1>
          <p class="mt-10px text-medium text-emphasis-tx">
            Your search history is only visible to you, and it helps us to show
            you better results. Are you sure you want to clear it?
          </p>
          <div
            class="mt-15px *:h:[48px] text-medium flex justify-end *:inline-block *:px-[24px] *:py-[12px] *:text-inherit"
          >
            <button (click)="clearSearchDialogVisible.set(false)">
              Cancel
            </button>
            <button (click)="onContinue()">Continue</button>
          </div>
        </div>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'h-screen w-screen bg-white',
  },
})
export default class SearchComboboxDialogComponent {
  _Math = Math;
  router = inject(Router);
  profileName = inject(ProfileNamePipe);
  relationshipToConnection = inject(RelationshipToConnectionPipe);
  dialogComponent = inject(DialogComponent);
  profileService = inject(ProfileService);
  toastService = inject(ToastNotificationService);
  searchService = inject(SearchService);
  vcf = inject(ViewContainerRef);
  searchInputValue = signal('');

  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  closeDialogOutput = output<boolean>();

  recentSearch = signal<string[]>([]);
  clearSearchDialogVisible = signal(false);

  searchChange$?: Observable<Event>;
  recentResultChangeFromInput$: Observable<string[]> = of([]);
  searchComboboxResult$: Observable<SearchItem[]> = of([]);

  constructor() {
    effect(() => {
      if (this.dialogComponent.isVisible()) {
        this.searchInput().nativeElement.focus();
        this.profileService.getRecentSearch().subscribe((data) => {
          this.recentSearch.set(data.data);
        });
      }
    });
  }

  onCloseDialog() {
    this.dialogComponent.isVisible.set(false);
    this.closeDialogOutput.emit(true);
  }

  onContinue() {
    this.profileService
      .clearRecentSearch(this.recentSearch())
      .subscribe((response) => {
        if (response.status === 'success') {
          this.recentSearch.set([]);
        } else {
          this.toastService.create(this.vcf, {
            type: 'error',
            message: response.message,
          });
        }
      });
    this.clearSearchDialogVisible.set(false);
  }

  onSearchEnter() {
    if (this.searchInputValue())
      this.router.navigateByUrl(
        `search/result?keyword=${this.searchInputValue()}`,
      );
  }

  onSearchInput() {
    this.searchInputValue.set(this.searchInput().nativeElement.value);
  }

  onClearSearch() {
    this.searchInput().nativeElement.dispatchEvent(new Event('input'));
    this.searchInputValue.set('');
  }

  ngOnInit() {
    this.searchChange$ = fromEvent(
      this.searchInput().nativeElement,
      'input',
    ).pipe(debounceTime(500));

    this.recentResultChangeFromInput$ = this.searchChange$.pipe(
      switchMap(() =>
        of(
          this.recentSearch().filter((v) =>
            v.startsWith(this.searchInputValue()),
          ),
        ),
      ),
    );

    this.searchComboboxResult$ = this.searchChange$.pipe(
      switchMap(() =>
        defer(() => {
          return merge(
            defer(() => {
              if (this.searchInputValue()) {
                return this.searchService
                  .getPeople(this.searchInputValue())
                  .pipe(
                    map<
                      PeopleResponse,
                      { type: 'pplRes'; data: PeopleResponse }
                    >((data) => {
                      return {
                        type: 'pplRes',
                        data,
                      };
                    }),
                  );
              } else {
                return of<{ type: 'pplRes'; data: PeopleResponse }>({
                  type: 'pplRes',
                  data: {
                    count: 0,
                    data: [],
                  },
                });
              }
            }),
            defer(() => {
              if (this.searchInputValue()) {
                return this.searchService
                  .getCompanies(this.searchInputValue())
                  .pipe(
                    map<
                      CompanyResponse,
                      { type: 'companyRes'; data: CompanyResponse }
                    >((data) => {
                      return {
                        type: 'companyRes',
                        data,
                      };
                    }),
                  );
              } else {
                return of<{ type: 'companyRes'; data: CompanyResponse }>({
                  type: 'companyRes',
                  data: {
                    count: 0,
                    data: [],
                  },
                });
              }
            }),
            defer(() => {
              if (this.searchInputValue()) {
                return this.searchService
                  .getInstitutions(this.searchInputValue())
                  .pipe(
                    map<
                      InstitutionResponse,
                      { type: 'insRes'; data: InstitutionResponse }
                    >((data) => {
                      return {
                        type: 'insRes',
                        data,
                      };
                    }),
                  );
              } else {
                return of<{ type: 'insRes'; data: InstitutionResponse }>({
                  type: 'insRes',
                  data: {
                    count: 0,
                    data: [],
                  },
                });
              }
            }),
          );
        }),
      ),
      map((e) => {
        if (e.type === 'pplRes') {
          return {
            data: e.data.data.map<SearchItem>(
              ({
                firstName,
                lastName,
                id,
                relationship,
                headline,
                avatarUrl,
              }) => {
                return {
                  type: e.type,
                  id,
                  primaryText: this.profileName.transform({
                    firstName,
                    lastName,
                  }),
                  secondaryText:
                    this.relationshipToConnection.transform(relationship),
                  tertiaryText: headline,
                  avatarUrl,
                };
              },
            ),
          };
        } else if (e.type === 'companyRes') {
          return {
            data: e.data.data.map<SearchItem>(
              ({ companyId, companyName, companyIndustry, companyLogoSrc }) => {
                return {
                  type: e.type,
                  id: companyId,
                  primaryText: companyName,
                  secondaryText: 'Company',
                  tertiaryText: companyIndustry,
                  companyLogoSrc,
                };
              },
            ),
          };
        } else {
          return {
            data: e.data.data.map<SearchItem>(
              ({ id, educationName, educationLogoSrc }) => {
                return {
                  type: e.type,
                  id,
                  primaryText: educationName,
                  secondaryText: 'School',
                  tertiaryText: 'location',
                  educationLogoSrc,
                };
              },
            ),
          };
        }
      }),
      //I believe this logic to merge the search apis should be handled at the BE side as the FE side should not handle this kind of business stuff (it's not display-related logic) (as per brother Thanh and Dat). I've implemented it here just to practice with RxJS data streams and operators
      scan((acc: SearchItem[], cur, index) => {
        if (index % 3 === 0) {
          acc = [...cur.data];
        } else {
          acc = [...acc, ...cur.data];
        }
        return acc;
      }, []),
    );
  }
}
