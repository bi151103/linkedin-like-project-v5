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

@Injectable({ providedIn: 'root' })
export default class ProfileService extends BaseService {
  async getRecentSearch(): Promise<RecentSearchResponse> {
    const apiUrl = `${this.rootUrl}/recent-search`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as RecentSearchResponse;
    return json;
  }

  async clearRecentSearch(recentSearch: string[]): Promise<void> {
    const apiUrl = `${this.rootUrl}/remove-recent-search`;
    const request = new Request(apiUrl, {
      body: JSON.stringify(recentSearch),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetch(request);
  }

  async getExperiences(): Promise<ExperienceData[]> {
    const apiUrl = `${this.rootUrl}/experiences`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as ExperienceData[];
    return json;
  }

  async getConnections(): Promise<ConnectionResponse> {
    const apiUrl = `${this.rootUrl}/connections`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as ConnectionResponse;
    return json;
  }

  async getMessageNotifications(): Promise<MessageNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/messages`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as MessageNotificationResponse;
    return json;
  }

  async getNetworkNotifications(): Promise<NetworkNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/network`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as NetworkNotificationResponse;
    return json;
  }

  async getGeneralNotifications(): Promise<GeneralNotificationResponse> {
    const apiUrl = `${this.rootUrl}/notifications/general`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as GeneralNotificationResponse;
    return json;
  }

  async getEducations(): Promise<EducationResponse> {
    const apiUrl = `${this.rootUrl}/educations`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as EducationResponse;
    return json;
  }

  async getAboutData(): Promise<About> {
    const apiUrl = `${this.rootUrl}/about`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as About;
    return json;
  }

  async updateAboutData(about: About): Promise<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/about`;
    const request = new Request(apiUrl, {
      body: JSON.stringify(about),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await fetch(request);
    const json = (await response.json()) as UpdateResponse;
    return json;
  }

  async getFeaturesData(): Promise<FeaturesResponse> {
    const apiUrl = `${this.rootUrl}/features`;
    const response = await fetch(apiUrl);
    const json = (await response.json()) as FeaturesResponse;
    return json;
  }

  async addFeature(input: CreateFeatureRequest): Promise<UpdateResponse> {
    const apiUrl = `${this.rootUrl}/features`;

    const formData = new FormData();
    formData.append('name', input.name);

    if (input.description) {
      formData.append('description', input.description);
    }

    formData.append('type', input.type);

    if (input.type === 'media') {
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

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    return json;
  }
}
