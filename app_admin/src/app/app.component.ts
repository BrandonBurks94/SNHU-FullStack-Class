import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/trips">Travlr Getaways Admin</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/trips">Trips</a>
          <a class="nav-link" routerLink="/trips/new">Add Trip</a>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
