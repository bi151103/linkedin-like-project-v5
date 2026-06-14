import { Component, inject, signal } from '@angular/core';
import HeaderComponent from '../../components/profile-header/header.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import FooterComponent from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import SearchService from '../../services/search.service';
import { Job } from '../../services/models/job';
import {
  forkJoin,
  map,
  merge,
  mergeAll,
  mergeMap,
  switchMap,
  toArray,
} from 'rxjs';
import { JobResponse } from '../../services/models/job-response';
import { PeopleResponse } from '../../services/models/people-response';
import { Person } from '../../services/models/person';
import { Group } from '../../services/models/group';
import { Institution } from '../../services/models/institution';
import { GroupResponse } from '../../services/models/group-response';
import { InstitutionResponse } from '../../services/models/institution-response';

@Component({
  selector: 'app-search-result',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
  ],
  template: `
    <ng-container>
      <app-header
        (onShowSearchComboboxDialog)="searchDialogVisible.set(true)"
      ></app-header>
      <app-footer></app-footer>
    </ng-container>
    <div appOverlay>
      <app-dialog
        [isVisible]="searchDialogVisible()"
        (closeDialog)="searchDialogVisible.set(false)"
      >
        <app-search-combobox-dialog></app-search-combobox-dialog>
      </app-dialog>
    </div>
  `,
})
export default class SearchResultPage {
  route = inject(ActivatedRoute);
  searchService = inject(SearchService);
  searchDialogVisible = signal(false);

  jobs = signal<Job[]>([]);
  people = signal<Person[]>([]);
  groups = signal<Group[]>([]);
  institution = signal<Institution[]>([]);

  constructor() {
    this.route.queryParams
      .pipe(
        switchMap((e) =>
          merge(
            this.searchService.getJobs(e['keyword'] ?? '').pipe(
              map((data) => {
                return {
                  type: 'jobRes',
                  data,
                };
              }),
            ),
            this.searchService.getPeople(e['keyword'] ?? '').pipe(
              map((data) => {
                return {
                  type: 'pplRes',
                  data,
                };
              }),
            ),
            this.searchService.getGroups(e['keyword'] ?? '').pipe(
              map((data) => {
                return {
                  type: 'grRes',
                  data,
                };
              }),
            ),
            this.searchService.getInstitutions(e['keyword'] ?? '').pipe(
              map((data) => {
                return {
                  type: 'insRes',
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
            this.jobs.set((data.data as JobResponse).data);
            break;
          case 'pplRes':
            this.people.set((data.data as PeopleResponse).data);
            break;
          case 'grRes':
            this.groups.set((data.data as GroupResponse).data);
            break;
          case 'grRes':
            this.institution.set((data.data as InstitutionResponse).data);
            break;
          default:
        }
      });
  }
}
