import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-card.component.html'
})
export class TripCardComponent {
  @Input({ required: true }) trip!: Trip;
  @Output() delete = new EventEmitter<Trip>();

  readonly imageBaseUrl = `${window.location.protocol}//${window.location.hostname}:3000/images/`;

  constructor(private readonly authenticationService: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
