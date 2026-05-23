import { Component } from '@angular/core';

@Component({
  selector: 'button[appButton]',
  template: `<img
    src="assets/images/icons8-left-100.png"
    class="aspect-square w-3/5"
  />`,
  host: {
    class: 'min-w-md-img w-md-img flex h-full items-center justify-center',
  },
})
export default class ButtonComponent {}
