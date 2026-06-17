import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly tokenKey = 'travlr-token';

  constructor(
    @Inject(BROWSER_STORAGE) private readonly storage: Storage,
    private readonly tripDataService: TripDataService
  ) {}

  getToken(): string {
    return this.storage.getItem(this.tokenKey) ?? '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      return typeof payload.exp === 'number' && payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User {
    const token = this.getToken();
    const payload = JSON.parse(atob(token.split('.')[1])) as User;

    return {
      email: payload.email,
      name: payload.name
    };
  }

  login(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, password).pipe(
      tap((authResponse) => this.saveToken(authResponse.token))
    );
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, password).pipe(
      tap((authResponse) => this.saveToken(authResponse.token))
    );
  }
}
