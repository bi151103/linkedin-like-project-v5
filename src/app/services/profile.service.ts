import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { RecentSearchResponse } from './models';
import { ExperienceData } from './models/experience-data';
import { ConnectionResponse } from './models/connection-response';

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
}
