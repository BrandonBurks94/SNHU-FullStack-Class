import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  formError = '';
  isSubmitting = false;

  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {}

  onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    const user = {
      email: this.credentials.email,
      name: ''
    } as User;

    this.isSubmitting = true;

    this.authenticationService.login(user, this.credentials.password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        this.formError = err.error?.message ?? 'Login failed. Check your credentials and try again.';
        this.isSubmitting = false;
      }
    });
  }
}
