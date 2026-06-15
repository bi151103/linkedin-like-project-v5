import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { Observable } from 'rxjs';
import { JobResponse } from './models/job-response';
import { PeopleResponse } from './models/people-response';
import { GroupResponse } from './models/group-response';
import { InstitutionResponse } from './models/institution-response';
import { CompanyResponse } from './models/company-response';

@Injectable({ providedIn: 'root' })
export default class SearchService extends BaseService {
  getJobs(searchKey: string): Observable<JobResponse> {
    const apiUrl = `${this.rootUrl}/jobs`;
    return this.http.get<JobResponse>(apiUrl, {
      params: {
        searchKey,
      },
    });
  }

  getPeople(searchKey: string): Observable<PeopleResponse> {
    const apiUrl = `${this.rootUrl}/people`;
    return this.http.get<PeopleResponse>(apiUrl, {
      params: {
        searchKey,
      },
    });
  }

  getGroups(searchKey: string): Observable<GroupResponse> {
    const apiUrl = `${this.rootUrl}/groups`;
    return this.http.get<GroupResponse>(apiUrl, {
      params: {
        searchKey,
      },
    });
  }

  getInstitutions(searchKey: string): Observable<InstitutionResponse> {
    const apiUrl = `${this.rootUrl}/education-institutions`;
    return this.http.get<InstitutionResponse>(apiUrl, {
      params: {
        searchKey,
      },
    });
  }

  getCompanies(searchKey: string): Observable<CompanyResponse> {
    const apiUrl = `${this.rootUrl}/companies`;
    return this.http.get<CompanyResponse>(apiUrl, {
      params: {
        searchKey,
      },
    });
  }
}
