import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import HeaderComponent from '../../components/profile-header/header.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import FooterComponent from '../../components/footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import SearchService from '../../services/search.service';
import { Job } from '../../services/models/job';
import {
  defer,
  distinct,
  forkJoin,
  map,
  merge,
  mergeAll,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { JobResponse } from '../../services/models/job-response';
import { PeopleResponse } from '../../services/models/people-response';
import { Person } from '../../services/models/person';
import { Group } from '../../services/models/group';
import { Institution } from '../../services/models/institution';
import { GroupResponse } from '../../services/models/group-response';
import { InstitutionResponse } from '../../services/models/institution-response';
import { Company } from '../../services/models/company';
import { CompanyResponse } from '../../services/models/company-response';
import { AsyncPipe } from '@angular/common';
import ConvertRelativeDatePipe from '../../pipes/convert-relative-date';
import ProfileNamePipe from '../../pipes/profile-name.pipe';

@Component({
  selector: 'app-search-result',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
    RouterLink,
    ConvertRelativeDatePipe,
    ProfileNamePipe,
  ],
  template: `
    <ng-container>
      <app-header
        (onShowSearchComboboxDialog)="searchDialogVisible.set(true)"
        [searchValue]="searchInputValue()"
      ></app-header>
      @if (jobs().length) {
        <div class="mt-10px p-15px bg-white pr-0">
          <h2 class="text-medium-bold text-emphasis-tx">Jobs</h2>
          <ul class="mt-20px">
            @for (job of jobs().slice(0, 3); track job.id) {
              <li class="not-first:mt-10px not-last:experience-separator-line">
                <a
                  class="pr-15px flex items-start font-normal text-inherit"
                  [routerLink]="'job/view/' + job.id"
                >
                  <img
                    class="w-md-img h-md-img object-cover"
                    [src]="
                      job.company.companyLogoSrc
                        ? job.company.companyLogoSrc
                        : 'assets/images/icons8-building-100.png'
                    "
                  />
                  <div class="ml-10px relative">
                    <p class="text-medium-bold text-emphasis-tx">
                      {{ job.title }}
                    </p>
                    <p class="text-emphasis-tx">
                      {{ job.company.companyName }}
                    </p>
                    <p>{{ job.location }}</p>
                    <span class="text-xs-small">{{
                      job.datePost | convertRelativeDate
                    }}</span>
                  </div>
                </a>
              </li>
            }
          </ul>
        </div>
        <a
          routerLink="job/search"
          class="border-separator-line hover:bg-primary-btn-hover-bg block w-full border-t bg-white text-center leading-[2.5]"
          >See all</a
        >
      }
      @if (people().length) {
        <div class="mt-10px p-15px bg-white pr-0">
          <h2 class="text-medium-bold text-emphasis-tx">People</h2>
          <ul class="mt-20px">
            @for (person of people().slice(0, 3); track person.id) {
              <li class="not-first:mt-10px not-last:experience-separator-line">
                <a
                  class="pr-15px flex items-start font-normal text-inherit"
                  [routerLink]="'job/view/' + person.id"
                >
                  <img
                    class="w-md-img h-md-img object-cover"
                    [src]="
                      person.avatarUrl
                        ? person.avatarUrl
                        : 'assets/images/icons8-profile-100.png'
                    "
                  />
                  <div class="ml-10px relative">
                    <p class="text-medium-bold text-emphasis-tx">
                      {{
                        {
                          firstName: person.firstName,
                          lastName: person.lastName,
                        } | profileName
                      }}
                    </p>
                    <p class="text-emphasis-tx">
                      {{ person.headline }}
                    </p>
                    <span class="text-xs-small"
                      >{{ person.location }}, {{ person.country.name }}</span
                    >
                  </div>
                </a>
              </li>
            }
          </ul>
        </div>
        <a
          routerLink="search/result/people"
          class="border-separator-line hover:bg-primary-btn-hover-bg block w-full border-t bg-white text-center leading-[2.5]"
          >See all</a
        >
      }
      @if (groups().length) {
        <div class="mt-10px p-15px bg-white pr-0">
          <h2 class="text-medium-bold text-emphasis-tx">Groups</h2>
          <ul class="mt-20px">
            @for (group of groups().slice(0, 3); track group.id) {
              <li class="not-first:mt-10px not-last:experience-separator-line">
                <a
                  class="pr-15px flex items-start font-normal text-inherit"
                  [routerLink]="'group/' + group.id"
                >
                  <img
                    class="w-md-img h-md-img object-cover"
                    [src]="
                      group.groupThumbnailUrl
                        ? group.groupThumbnailUrl
                        : 'assets/images/icons8-building-100.png'
                    "
                  />
                  <div class="ml-10px relative">
                    <p class="text-medium-bold text-emphasis-tx">
                      {{ group.groupName }}
                    </p>
                    <p class="text-emphasis-tx">
                      {{ group.membersCount }}
                      {{ group.membersCount === 1 ? 'member' : 'members' }}
                    </p>
                    <span class="text-xs-small line-clamp-2">{{
                      group.description
                    }}</span>
                  </div>
                </a>
              </li>
            }
          </ul>
        </div>
      }
      @if (companies().length) {
        <div class="mt-10px p-15px bg-white pr-0">
          <h2 class="text-medium-bold text-emphasis-tx">Companies</h2>
          <ul class="mt-20px">
            @for (company of companies().slice(0, 3); track company.companyId) {
              <li class="not-first:mt-10px not-last:experience-separator-line">
                <a
                  class="pr-15px flex items-start font-normal text-inherit"
                  [routerLink]="'company/' + company.companyId"
                >
                  <img
                    class="w-md-img h-md-img object-cover"
                    [src]="
                      company.companyLogoSrc
                        ? company.companyLogoSrc
                        : 'assets/images/icons8-building-100.png'
                    "
                  />
                  <div class="ml-10px relative">
                    <p class="text-medium-bold text-emphasis-tx">
                      {{ company.companyName }}
                    </p>
                    <p class="text-emphasis-tx">
                      {{ company.companyIndustry }}
                    </p>
                    <!-- <p>{{ company.location }}</p> -->
                    <!-- <span class="text-xs-small">{{ company.about }}</span> -->
                  </div>
                </a>
              </li>
            }
          </ul>
        </div>
        <a
          routerLink="search/result/company"
          class="border-separator-line hover:bg-primary-btn-hover-bg block w-full border-t bg-white text-center leading-[2.5]"
          >See all</a
        >
      }
      <app-footer></app-footer>
    </ng-container>
    <div appOverlay>
      <app-dialog
        [isVisible]="searchDialogVisible()"
        (closeDialog)="searchDialogVisible.set(false)"
      >
        <app-search-combobox-dialog
          [(searchInputValue)]="searchInputValue"
        ></app-search-combobox-dialog>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'block py-50px',
  },
})
export default class SearchResultPage {
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  searchDialogVisible = signal(false);

  jobs = signal<Job[]>([]);
  people = signal<Person[]>([]);
  groups = signal<Group[]>([]);
  institutions = signal<Institution[]>([]);
  companies = signal<Company[]>([]);

  searchInputValue = signal(this.route.snapshot.queryParams['keyword']);

  constructor() {
    this.route.queryParams
      .pipe(
        switchMap((e) =>
          merge(
            this.searchService.getJobs(e['keyword'] ?? '').pipe(
              map<JobResponse, { type: 'jobRes'; data: JobResponse }>(
                (data) => {
                  return {
                    type: 'jobRes',
                    data,
                  };
                },
              ),
            ),
            this.searchService.getPeople(e['keyword'] ?? '').pipe(
              map<PeopleResponse, { type: 'pplRes'; data: PeopleResponse }>(
                (data) => {
                  return {
                    type: 'pplRes',
                    data,
                  };
                },
              ),
            ),
            this.searchService.getGroups(e['keyword'] ?? '').pipe(
              map<GroupResponse, { type: 'grRes'; data: GroupResponse }>(
                (data) => {
                  return {
                    type: 'grRes',
                    data,
                  };
                },
              ),
            ),
            this.searchService.getInstitutions(e['keyword'] ?? '').pipe(
              map<
                InstitutionResponse,
                { type: 'insRes'; data: InstitutionResponse }
              >((data) => {
                return {
                  type: 'insRes',
                  data,
                };
              }),
            ),
            this.searchService.getCompanies(e['keyword'] ?? '').pipe(
              map<
                CompanyResponse,
                { type: 'companyRes'; data: CompanyResponse }
              >((data) => {
                return {
                  type: 'companyRes',
                  data,
                };
              }),
            ),
          ),
        ),
      )
      .subscribe((data) => {
        switch (data.type) {
          case 'jobRes':
            this.jobs.set(data.data.data);
            break;
          case 'pplRes':
            this.people.set(data.data.data);
            break;
          case 'grRes':
            this.groups.set(data.data.data);
            break;
          case 'insRes':
            this.institutions.set(data.data.data);
            break;
          case 'companyRes':
            this.companies.set(data.data.data);
            break;
          default:
        }
      });
  }
}
