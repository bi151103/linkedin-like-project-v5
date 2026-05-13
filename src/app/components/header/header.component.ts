import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="w-50px h-3/5">
      <a href="#">
        <img
          class="block aspect-square h-full justify-self-center"
          src="assets/images/icons8-profile-100.png"
        />
      </a>
    </div>
    <div class="flex h-3/5 basis-[calc(100%-100px)] items-center bg-[#edf3f8]">
      <img
        class="ml-10px aspect-square h-3/5"
        src="assets/images/icons8-search-100.png"
      />
      <input
        type="text"
        name="search"
        class="pl-5px pr-10px text-medium pt-[4px] font-bold outline-none"
        placeholder="Search"
      />
    </div>
    <div class="w-50px h-3/5">
      <a href="#" class="relative">
        <img
          class="block aspect-square h-full justify-self-center"
          src="assets/images/icons8-chat-bubble-100.png"
        />
        <img
          src="assets/images/icons8-circled-1-100.png"
          class="w-sm-noti-bubble h-sm-noti-bubble absolute top-0 right-[2px] rounded-full border border-double border-white"
        />
      </a>
    </div>
  `,
  standalone: true,
  host: {
    class:
      'h-50px border-separator-line fixed top-0 z-999 flex w-full items-center border-b bg-white',
  },
})
export default class HeaderComponent {}
