import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export default abstract class BaseService {
  protected http = inject(HttpClient);
  readonly rootUrl =
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost'
      ? 'http://127.0.0.1:3000/api'
      : 'https://linkedin-like-project-v4-server.onrender.com/api';
}
