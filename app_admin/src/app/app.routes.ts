import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TripListComponent } from './trips/trip-list/trip-list.component';
import { TripEditComponent } from './trips/trip-edit/trip-edit.component';

export const routes: Routes = [
  {
    path: 'trips',
    component: TripListComponent
  },
  {
    path: 'trips/new',
    component: TripEditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'trips/:tripCode/edit',
    component: TripEditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'trips',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'trips'
  }
];
