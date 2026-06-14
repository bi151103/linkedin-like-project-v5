import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { RecentSearchResponse } from './models';
import { ExperienceData } from './models/experience-data';
import { ConnectionResponse } from './models/connection-response';
import { MessageNotificationResponse } from './models/message-notification-response';
import { NetworkNotificationResponse } from './models/network-notification-response';
import { GeneralNotificationResponse } from './models/general-notification-response';
import { EducationResponse } from './models/education-response';
import { About } from './models/about';
import { UpdateResponse } from './models/update-response';
import { FeaturesResponse } from './models/feature-response';
import { CreateFeatureRequest } from './models/create-feature-request';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class ProfileService extends BaseService {
  getRecentSearch(): Observable<RecentSearchResponse> {
    const apiUrl = `${this.rootUrl}/recent-search`;
    return this.http.get<RecentSearchResponse>(apiUrl);
  }

  clearRecentSearch(recentSearch: string[]): Observable<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/remove-recent-search`;
    return this.http.post<UpdateResponse>(apiUrl, recentSearch, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getExperiences(): Observable<ExperienceData[]> {
    const apiUrl = `${this.rootUrl}/experiences`;
    return this.http.get<ExperienceData[]>(apiUrl);
  }

  getConnections(): Observable<ConnectionResponse> {
    const apiUrl = `${this.rootUrl}/connections`;
    return this.http.get<ConnectionResponse>(apiUrl);
  }

  getMessageNotifications(): Observable<MessageNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/messages`;
    return this.http.get<MessageNotificationResponse>(apiUrl);
  }

  getNetworkNotifications(): Observable<NetworkNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/network`;
    return this.http.get<NetworkNotificationResponse>(apiUrl);
  }

  getGeneralNotifications(): Observable<GeneralNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/general`;
    return this.http.get<GeneralNotificationResponse>(apiUrl);
  }

  getEducations(): Observable<EducationResponse> {
    const apiUrl = `${this.rootUrl}/educations`;
    return this.http.get<EducationResponse>(apiUrl);
  }

  getAboutData(): Observable<About> {
    const apiUrl = `${this.rootUrl}/about`;
    return this.http.get<About>(apiUrl);
  }

  updateAboutData(about: About): Observable<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/about`;
    return this.http.post<UpdateResponse>(apiUrl, about, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getFeaturesData(): Observable<FeaturesResponse> {
    const apiUrl = `${this.rootUrl}/features`;
    return this.http.get<FeaturesResponse>(apiUrl);
  }

  addFeature(input: CreateFeatureRequest): Observable<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/features`;

    const formData = new FormData();
    formData.append('name', input.name);

    if (input.description) {
      formData.append('description', input.description);
    }

    formData.append('type', input.type);

    if (input.type === 'image' || input.type === 'document') {
      if (!input.file) {
        throw new Error('Missing file');
      }
      formData.append('file', input.file);
    } else if (input.type === 'link') {
      if (!input.value) {
        throw new Error('Missing link');
      }
      formData.append('value', input.value);
    }

    return this.http.post<UpdateResponse>(apiUrl, formData);
  }
}
