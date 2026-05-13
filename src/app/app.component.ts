import { Component } from '@angular/core';
import { ProfilePage } from './pages/profile/profile.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfilePage],
  template: ` <app-profile></app-profile>`,
})
export class AppComponent {
  title = 'linkedin-like-project-v5';
}
