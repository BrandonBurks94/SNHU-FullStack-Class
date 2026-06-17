import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private readonly baseUrl = `${window.location.protocol}//${window.location.hostname}:3000/api`;
  private readonly apiBaseUrl = `${this.baseUrl}/trips`;

  constructor(private readonly http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiBaseUrl);
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiBaseUrl}/${encodeURIComponent(tripCode)}`);
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiBaseUrl, trip);
  }

  updateTrip(originalCode: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiBaseUrl}/${encodeURIComponent(originalCode)}`, trip);
  }

  deleteTrip(tripCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${encodeURIComponent(tripCode)}`);
  }

  login(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, password);
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, password);
  }

  private handleAuthAPICall(endpoint: string, user: User, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, {
      name: user.name,
      email: user.email,
      password
    });
  }
}
