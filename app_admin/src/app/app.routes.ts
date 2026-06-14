import { Routes } from '@angular/router';
import { TripListComponent } from './trips/trip-list/trip-list.component';
import { TripEditComponent } from './trips/trip-edit/trip-edit.component';

export const routes: Routes = [
  {
    path: 'trips',
    component: TripListComponent
  },
  {
    path: 'trips/new',
    component: TripEditComponent
  },
  {
    path: 'trips/:tripCode/edit',
    component: TripEditComponent
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
