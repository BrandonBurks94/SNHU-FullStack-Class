import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { AuthenticationService } from '../../services/authentication.service';
import { TripDataService } from '../../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCardComponent],
  templateUrl: './trip-list.component.html'
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  isLoading = false;
  statusMessage = '';
  errorMessage = '';

  constructor(
    private readonly tripDataService: TripDataService,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tripDataService.getTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Unable to retrieve trips.';
        this.isLoading = false;
      }
    });
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Delete ${trip.name}?`)) {
      return;
    }

    this.tripDataService.deleteTrip(trip.code).subscribe({
      next: () => {
        this.statusMessage = `${trip.name} deleted.`;
        this.loadTrips();
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Unable to delete trip.';
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
