import { Injectable } from '@angular/core';
import BaseService from './base-service';
import { RecentSearchResponse } from './models';

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
}
