import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trip-card.component.html'
})
export class TripCardComponent {
  @Input({ required: true }) trip!: Trip;
  @Output() delete = new EventEmitter<Trip>();

  readonly imageBaseUrl = `${window.location.protocol}//${window.location.hostname}:3000/images/`;
}
