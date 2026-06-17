import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/trips">Travlr Getaways Admin</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/trips">Trips</a>
          <a class="nav-link" routerLink="/trips/new" *ngIf="isLoggedIn()">Add Trip</a>
        </div>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/login" *ngIf="!isLoggedIn()">Log In</a>
          <button type="button" class="btn btn-link nav-link px-0" *ngIf="isLoggedIn()" (click)="logout()">Log Out</button>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  constructor(private readonly authenticationService: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
