import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import HeaderComponent from '../../components/profile-header/header.component';
import OverlayDirective from '../../components/overlay/overlay.component';
import DialogComponent from '../../components/dialog/dialog.component';
import SearchComboboxDialogComponent from '../../components/search-combobox-dialog/search-combobox-dialog.component';
import FooterComponent from '../../components/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import UserInfoService from '../../services/user-info.service';
import { UserInfo } from '../../services/models/user-info';
import { Nullable } from '../../models';
import ProfileNamePipe from '../../pipes/profile-name.pipe';
import ProfileService from '../../services/profile.service';
import { ExperienceData } from '../../services/models/experience-data';
import { MessageNotificationResponse } from '../../services/models/message-notification-response';
import { NetworkNotificationResponse } from '../../services/models/network-notification-response';
import { GeneralNotificationResponse } from '../../services/models/general-notification-response';
import PrimaryButtonComponent from '../../components/primary-button/primary-button.component';
import { Feature } from '../../services/models/feature';
import IconButtonComponent from '../../components/icon-button/icon-button.component';
import TwMergePipe from '../../pipes/tw-merge.pipe';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import AddFeaturedStoreService from '../../services/add-featured-store.service';
import FeaturedCarouselItemComponent from '../../components/featured-carousel-item/featured-carousel-item.component';

type DotItem = { isActive: boolean; clickAction: () => void };

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    OverlayDirective,
    DialogComponent,
    SearchComboboxDialogComponent,
    FooterComponent,
    RouterLink,
    ProfileNamePipe,
    PrimaryButtonComponent,
    IconButtonComponent,
    TwMergePipe,
    SvgIconComponent,
    FormsModule,
    FeaturedCarouselItemComponent,
  ],
  template: `
    <app-header
      (onShowSearchComboboxDialog)="showSearchComboboxDialog()"
    ></app-header>
    <ng-container>
      <section class="relative">
        <img
          src="assets/images/background-image-cut.jpg"
          class="w-full bg-white align-middle"
        />
        <a routerLink="/my-preference"
          ><img
            src="assets/images/icons8-setting-100.png"
            class="p-5px absolute top-0 right-0 mt-[15px] mr-[15px] aspect-square w-[25px] rounded-full bg-white"
        /></a>
      </section>
    </ng-container>
    <ng-container>
      <section class="flex h-[40px] w-full bg-white">
        <a class="w-min" routerLink="add-profile-photo">
          <div class="relative ml-[15px] h-full w-[120px]">
            <div
              class="border-primary-tx absolute bottom-0 flex h-3/1 w-full flex-col items-center justify-center rounded-full border-2 border-double bg-white"
            >
              <img class="w-50px" src="assets/images/icons8-camera-100.png" />
              <span class="text-[0.8em]">Add Photo</span>
            </div>
          </div>
        </a>
        <div class="ml-auto flex h-full w-[90px] items-end justify-around">
          <button
            #shareBtn
            (click)="shareProfileInfo()"
            [attr.data-title]="'LinkedIn: Profile of Phuc Dang'"
            data-text="'Check out Phuc Dang's profile on LinkedIn'"
            data-url="https://linkedin.com/in/dang-phan-minh-phuc"
          >
            <img
              src="assets/images/icons8-share-100.png"
              class="aspect-square w-[25px]"
            />
          </button>
          <a routerLink="edit-profile">
            <img
              src="assets/images/icons8-edit-100.png"
              class="aspect-square w-[25px]"
            />
          </a>
        </div>
      </section>
    </ng-container>
    <ng-container>
      <section class="px-15px bg-white py-[25px]">
        <h1 class="text-emphasis-tx">
          {{
            { firstName: userInfo()?.firstName, lastName: userInfo()?.lastName }
              | profileName
          }}
        </h1>
        <p>{{ userInfo()?.headline ?? '' }}</p>
        <p>{{ recentCompanyExp() }}</p>
        <p>
          {{ userInfo()?.country }}<span class="dot"></span>
          <a routerLink="connection"
            >{{ connectionCount() }}
            {{ connectionCount() === 1 ? 'Connection' : 'Connections' }}
          </a>
        </p>
      </section>
    </ng-container>
    <ng-container>
      <section class="mt-10px p-15px bg-white">
        <div class="flex">
          <h2>About</h2>
          @if (aboutData()) {
            <a routerLink="edit-about" class="ml-auto">
              <img
                class="h-sm-img w-sm-img"
                src="assets/images/icons8-edit-100.png"
              />
            </a>
          }
        </div>
        @if (aboutData()) {
          <!-- wrap-break-word whitespace-pre-wrap: use this pair of class to preserve the newline character (backslash and n) as a new line in the UI and make long words wrap into a new line -->
          <p class="mt-10px wrap-break-word whitespace-pre-wrap">
            {{ aboutData() }}
          </p>
        } @else {
          <button appPrimaryButton class="mt-10px" routerLink="edit-about">
            Add summary
          </button>
        }
      </section>
    </ng-container>
    <ng-container
      ><section class="mt-10px p-15px relative bg-white">
        <div class="flex">
          <h2>Featured</h2>
          @if (features().length) {
            <a routerLink="/edit-featured" class="ml-auto">
              <img
                class="h-sm-img w-sm-img"
                src="assets/images/icons8-edit-100.png"
              />
            </a>
          }
        </div>
        <p class="mt-10px">
          Some content is only available on desktop or in the LinkedIn App.
          <a href="https://github.com/bi151103" target="_blank">Open in app</a>
        </p>
        <button
          appPrimaryButton
          class="mt-10px"
          (click)="addFeaturedDialogVisible.set(true)"
        >
          Add featured
        </button>
        @if (features().length) {
          <div class="mt-10px">
            <ul
              class="gap-20px flex h-[200px] snap-x snap-mandatory scrollbar-none overflow-y-auto"
              (scroll)="updatePaginatorDotState($event)"
            >
              @for (featured of features(); track featured.id) {
                <li class="block h-full snap-start snap-always" #featuredItem>
                  <app-featured-carousel-item
                    [link]="featured.value"
                    [thumbSrc]="
                      featured.type === 'link'
                        ? (featured.linkThumbPath ?? '')
                        : featured.value
                    "
                    [type]="featured.type"
                  >
                    {{ featured.name }}
                  </app-featured-carousel-item>
                </li>
              }
              @if (shouldShowFeaturedCarouselPlaceholder()) {
                <li class="block h-full snap-start snap-always" #featuredItem>
                  <app-featured-carousel-item type="placeholder">
                    See all
                  </app-featured-carousel-item>
                </li>
              }
            </ul>
          </div>
          <div class="gap-10px mt-5px flex w-full justify-center">
            @for (dot of dotsList(); track $index) {
              <span
                [class]="
                  [
                    'w-8px h-8px rounded-full border border-black',
                    dot.isActive ? 'bg-black' : '',
                  ] | twMerge
                "
                (click)="dot.clickAction()"
              ></span>
            }
          </div>
          <div
            class="right-15px bottom-10px absolute flex items-center font-medium"
            routerLink="/edit-featured"
          >
            See all
            <button
              appIconButton
              btnType="back"
              iconSize="sm-img"
              class="ml-5px *:rotate-180"
            ></button>
          </div>
        }
      </section>
    </ng-container>
    <app-footer></app-footer>
    <div appOverlay>
      <app-dialog
        [isVisible]="searchDialogVisible()"
        (closeDialog)="hideSearchComboboxDialog()"
      >
        <app-search-combobox-dialog></app-search-combobox-dialog>
      </app-dialog>
    </div>
    <div appOverlay [hasBackdrop]="true">
      <app-dialog
        [isVisible]="addFeaturedDialogVisible()"
        (closeDialog)="addFeaturedDialogVisible.set(false)"
        [closableOnBackdropCLick]="true"
      >
        <div
          [class]="
            [
              'absolute bottom-0 h-[240px] w-full rounded-t-[16px] bg-white duration-[0.1s]',
              shouldHideAddFeaturedOverlay()
                ? 'translate-y-[240px]'
                : 'translate-y-0',
            ] | twMerge
          "
        >
          <div class="p-15px flex">
            <h1 class="text-emphasis-tx">Select a file type</h1>
            <button
              class="ml-auto"
              appIconButton
              btnType="x-close"
              iconSize="sm-img"
              (click)="addFeaturedDialogVisible.set(false)"
            ></button>
          </div>
          <ul
            class="p-15px *:py-15px *:w-full *:rounded-[24px] *:hover:bg-[rgba(0,0,0,0.04)]"
          >
            @for (action of addFeaturedActionsList; track action.name) {
              <li class="*:text-inherit">
                <button
                  class="block flex w-full items-center"
                  (click)="action.action()"
                >
                  <svg-icon
                    [src]="action.svgSrc"
                    svgClass="w-sm-img h-sm-img"
                  ></svg-icon>
                  <span class="ml-10px">{{ action.name }}</span>
                </button>
              </li>
            }
          </ul>
          <input
            type="file"
            [hidden]="true"
            accept="image/jpeg,image/jpg,image/png"
            #imageInput
            [(ngModel)]="featureImgInputValue"
          />
          <input
            type="file"
            [hidden]="true"
            accept=".doc,.docx,.pdf"
            [(ngModel)]="featureDocInputValue"
            #documentInput
          />
        </div>
      </app-dialog>
    </div>
  `,
  host: {
    class: 'block py-50px',
  },
})
export class ProfilePage implements OnDestroy {
  readonly NUMBER_OF_CAROUSEL_ITEM_DISPLAYED = 5;
  userInfoService = inject(UserInfoService);
  profileService = inject(ProfileService);
  addFeatureStoreService = inject(AddFeaturedStoreService);
  router = inject(Router);

  userInfo = signal<Nullable<UserInfo>>(null);
  experiences = signal<ExperienceData[]>([]);
  connectionCount = signal<number>(0);
  recentCompanyExp = signal('');
  aboutData = signal<string>('');
  features = signal<Feature[]>([]);
  dotsList = computed<DotItem[]>(() => {
    if (this.features().length === 0) return [];
    let dotsList: DotItem[] = [];
    for (let i = 0; i < this.features().length; i++) {
      dotsList.push({
        isActive: false,
        clickAction: () => {
          const correspondingFeaturedItem =
            this.featuresItems()[i].nativeElement;
          correspondingFeaturedItem.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
          });
        },
      });
    }
    dotsList[0].isActive = true;
    if (this.shouldShowFeaturedCarouselPlaceholder()) {
      dotsList.push({
        isActive: false,
        clickAction: () => {
          const correspondingFeaturedItem =
            this.featuresItems()[this.NUMBER_OF_CAROUSEL_ITEM_DISPLAYED]
              .nativeElement;
          correspondingFeaturedItem.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
          });
        },
      });
    }
    return dotsList;
  });
  shouldShowFeaturedCarouselPlaceholder = signal(false);

  shareProfileBtn = viewChild.required<ElementRef<HTMLElement>>('shareBtn');
  featuresItems = viewChildren<ElementRef<HTMLElement>>('featuredItem');

  searchDialogVisible = signal(false);
  addFeaturedDialogVisible = signal(false);

  shouldHideAddFeaturedOverlay = signal(true);

  addFeaturedImgInput =
    viewChild.required<ElementRef<HTMLInputElement>>('imageInput');
  addFeaturedDocInput =
    viewChild.required<ElementRef<HTMLInputElement>>('documentInput');

  addFeaturedActionsList: {
    name: string;
    svgSrc: string;
    action: () => void;
  }[] = [
    {
      name: 'Add a photo',
      svgSrc: 'assets/icons/icons8-image-100.svg',
      action: () => {
        this.addFeaturedImgInput().nativeElement.click();
      },
    },
    {
      name: 'Upload a document',
      svgSrc: 'assets/icons/icons8-blank-document-100.svg',
      action: () => {
        this.addFeaturedDocInput().nativeElement.click();
      },
    },
    {
      name: 'Add a link',
      svgSrc: 'assets/icons/icons8-link-100.svg',
      action: () => {
        this.router.navigate(['add-featured']);
      },
    },
  ];
  featureImgInputValue = signal<Nullable<File>>(null);
  featureDocInputValue = signal<Nullable<File>>(null);

  constructor() {
    this.userInfoService.getUserInfo().subscribe((data) => {
      this.userInfo.set(data);
    });

    this.profileService.getExperiences().subscribe((data) => {
      this.experiences.set(data);
      this.recentCompanyExp.set(
        this.experiences().sort(
          (a, b) =>
            new Date(b.experiences[0].duration.start).getTime() -
            new Date(a.experiences[0].duration.start).getTime(),
        )[0].company.companyName,
      );
    });

    this.profileService.getConnections().subscribe((data) => {
      this.connectionCount.set(data.count);
    });

    this.profileService.getAboutData().subscribe((data) => {
      this.aboutData.set(data.data);
    });

    this.profileService.getFeaturesData().subscribe((data) => {
      this.features.set(
        data.data.slice(
          0,
          Math.min(this.NUMBER_OF_CAROUSEL_ITEM_DISPLAYED, data.count),
        ),
      );
      if (data.count > this.NUMBER_OF_CAROUSEL_ITEM_DISPLAYED) {
        this.shouldShowFeaturedCarouselPlaceholder.set(true);
      }
    });

    effect((onCleanUp) => {
      const isVisible = this.addFeaturedDialogVisible();

      const rAF = requestAnimationFrame(() => {
        this.shouldHideAddFeaturedOverlay.set(!isVisible);
      });

      onCleanUp(() => {
        cancelAnimationFrame(rAF);
      });
    });

    effect(() => {
      if (this.featureImgInputValue() || this.featureDocInputValue()) {
        const files = this.addFeaturedImgInput().nativeElement.files;
        if (files) {
        }
        this.router.navigate(['/add-featured']);
      }
    });
  }

  showSearchComboboxDialog() {
    this.searchDialogVisible.set(true);
  }

  hideSearchComboboxDialog() {
    this.searchDialogVisible.set(false);
  }

  async shareProfileInfo() {
    try {
      const shareData = {
        title: this.shareProfileBtn().nativeElement.dataset['title'],
        text: this.shareProfileBtn().nativeElement.dataset['text'],
        url: this.shareProfileBtn().nativeElement.dataset['url'],
      };
      await navigator.share(shareData);
    } catch (e) {
      console.error('The browser does not support the sharing with navigator');
    }
  }

  updatePaginatorDotState(event: Event) {
    const target = event.target;
    if (!target) return;
    const featuredItems = (target as HTMLElement).children;
    let firstActiveItemIdx = 0;
    for (; firstActiveItemIdx < featuredItems.length; firstActiveItemIdx++) {
      if (
        (
          featuredItems.item(firstActiveItemIdx) as HTMLElement
        ).getBoundingClientRect().x >= 0
      ) {
        break;
      }
    }
    this.dotsList()[
      this.dotsList().findIndex((e) => e.isActive === true)
    ].isActive = false;
    this.dotsList()[firstActiveItemIdx].isActive = true;
  }

  ngOnDestroy() {
    this.addFeatureStoreService.profilePageVisited.set(true);
    const imgFiles = this.addFeaturedImgInput().nativeElement.files;
    const docFiles = this.addFeaturedDocInput().nativeElement.files;
    if (imgFiles) {
      this.addFeatureStoreService.imgInputFile.set(imgFiles[0]);
    }
    if (docFiles) {
      this.addFeatureStoreService.docInputFile.set(docFiles[0]);
    }
  }
}
