import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { RecentSearchResponse } from './models';
import { ExperienceData } from './models/experience-data';
import { ConnectionResponse } from './models/connection-response';
import { MessageNotificationResponse } from './models/message-notification-response';
import { NetworkNotificationResponse } from './models/network-notification-response';
import { GeneralNotificationResponse } from './models/general-notification-response';
import { EducationResponse } from './models/education-response';

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
}
