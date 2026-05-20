import { Routes } from '@angular/router';
import NotFoundPage from './pages/not-found/not-found.page';
import { ProfilePage } from './pages/profile/profile.page';

export const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
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
