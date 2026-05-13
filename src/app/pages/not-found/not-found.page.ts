import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="px-15px flex h-[80px] items-center *:text-[calc(1vw+1.5rem)]">
      <a routerLink="/" class="h-50px">
        <img
          src="assets/images/icons8-linkedin-100.png"
          class="h-50px aspect-square"
        />
      </a>
    </div>
    <div class="px-10px text-center">
      <img
        src="assets/images/naruto-funny-chibi.png"
        class="aspect-auto h-[100px] max-h-[100px]"
      />
      <p class="mt-10px font-medium">Page not found</p>
      <p class="mt-10px font-normal">
        The page you want to visit is temporarily non-functional
      </p>
    </div>
    <div class="mt-40px *:mx-10px text-center">
      <a
        routerLink=""
        class="py-10px bg-primary-bg hover:bg-primary-tx rounded-xl px-[10px] text-white hover:text-yellow-500"
      >
        Home
      </a>
      or
      <a
        target="_blank"
        href="https://www.linkedin.com/in/dang-phan-minh-phuc/"
        class="py-10px bg-primary-bg hover:bg-primary-tx rounded-xl px-[10px] text-white hover:text-yellow-500"
      >
        Home
      </a>
    </div>
  `,
  host: {
    class: 'text-[16px] block',
  },
  standalone: true,
})
export default class NotFoundPage {}
