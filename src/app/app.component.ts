import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet></router-outlet>`,
  host: {
    class: 'text-small',
  },
})
export class AppComponent {
  title = 'linkedin-like-project-v5';
}
