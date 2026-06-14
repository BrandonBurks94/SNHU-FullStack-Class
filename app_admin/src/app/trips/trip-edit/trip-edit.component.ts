import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { TripDataService } from '../../services/trip-data.service';

const emptyTrip = (): Trip => ({
  code: '',
  name: '',
  image: '',
  duration: '',
  price: '',
  description: '',
  details: ''
});

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './trip-edit.component.html'
})
export class TripEditComponent implements OnInit {
  trip: Trip = emptyTrip();
  originalTripCode = '';
  isNewTrip = true;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = this.route.snapshot.paramMap.get('tripCode');

    if (!tripCode) {
      return;
    }

    this.isNewTrip = false;
    this.originalTripCode = tripCode;
    this.isLoading = true;

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Unable to load trip.';
        this.isLoading = false;
      }
    });
  }

  saveTrip(): void {
    this.errorMessage = '';
    this.isSaving = true;

    const request = this.isNewTrip
      ? this.tripDataService.addTrip(this.trip)
      : this.tripDataService.updateTrip(this.originalTripCode, this.trip);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Unable to save trip.';
        this.isSaving = false;
      }
    });
  }
}
