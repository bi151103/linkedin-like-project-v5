import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <div></div>`,
})
export class AppComponent {
  title = 'linkedin-like-project-v5';
}
