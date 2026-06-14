import { Routes } from '@angular/router';
import NotFoundPage from './pages/not-found/not-found.page';
import { ProfilePage } from './pages/profile/profile.page';
import EditProfilePage from './pages/edit-profile/edit-profile.page';
import EditAboutPage from './pages/edit-about/edit-about.page';
import AddFeaturedPage from './pages/add-feature/add-feature.page';
import SearchResultPage from './pages/search-result/search-result.page';

export const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    title: 'Profile | LinkedIn',
  },
  {
    path: 'search/result',
    component: SearchResultPage,
    title: 'Search | LinkedIn',
  },
  {
    path: 'edit-profile',
    component: EditProfilePage,
    title: 'Edit Intro | LinkedIn',
  },
  {
    path: 'edit-about',
    component: EditAboutPage,
    title: 'Edit About | LinkedIn',
  },
  {
    path: 'add-featured',
    component: AddFeaturedPage,
    title: 'Profile | LinkedIn',
  },
  {
    path: 'not-found',
    component: NotFoundPage,
    title: 'LinkedIn',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
