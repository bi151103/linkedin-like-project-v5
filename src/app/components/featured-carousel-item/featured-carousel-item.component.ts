import {
  Component,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { FeatureType } from '../../services/models/feature-type';
import * as pdfjsLib from 'pdfjs-dist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-carousel-item',
  template: `
    <ng-container>
      @if (type() === 'placeholder') {
        <div
          class="mb-5px border-separator-line flex h-[160px] w-full items-center justify-center rounded-xl border"
          routerLink="/edit-featured"
        >
          <p class="text-medium-bold text-center">See all</p>
        </div>
      } @else {
        <div class="relative">
          <div
            class="bg-secondary-bg mb-5px border-separator-line h-[160px] w-full rounded-xl border"
          >
            <a
              [href]="link()"
              target="_blank"
              class="flex h-full w-full items-center justify-center"
            >
              <canvas class="hidden" #canvas></canvas>
              @if (!!thumbSrc()) {
                <img
                  [src]="thumbSrc()"
                  class="h-full w-full rounded-xl object-cover"
                />
              } @else {
                <img
                  [src]="'assets/images/icons8-image-100.png'"
                  class="w-md-img aspect-square"
                />
              }
              <button
                class="w-40px h-40px border-separator-line absolute right-0 bottom-0 flex items-center justify-center border bg-white"
              >
                <svg-icon
                  [src]="
                    type() === 'link'
                      ? 'assets/icons/icons8-new-tab.svg'
                      : type() === 'image'
                        ? 'assets/icons/icons8-image-100.svg'
                        : 'assets/icons/icons8-blank-document-100.svg'
                  "
                  svgClass="w-25px h-25px"
                >
                </svg-icon>
              </button>
            </a>
          </div>
        </div>
        <p class="text-emphasis-tx line-clamp-1 font-medium">
          <ng-content></ng-content>
        </p>
      }
    </ng-container>
  `,
  host: {
    class: 'block w-[240px] h-full',
  },
  imports: [SvgIconComponent, RouterLink],
})
export default class FeaturedCarouselItemComponent {
  thumbSrc = model('');
  link = input('');
  type = input.required<FeatureType | 'placeholder'>();

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  async ngOnInit() {
    if (this.type() === 'document') {
      const canvasRef = this.canvasRef;
      if (!canvasRef) return;

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';

      const url =
        window.location.protocol === 'https:'
          ? this.thumbSrc().replace('http://', 'https://')
          : this.thumbSrc();

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = canvasRef().nativeElement;
      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) {
        return;
      }
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext,
        viewport,
      }).promise;

      const imageUrl = canvas.toDataURL('image/png');

      this.thumbSrc.set(imageUrl);
    }
  }
}
