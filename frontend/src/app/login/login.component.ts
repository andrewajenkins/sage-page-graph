import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit(): void {
    this.http
      .post('/api/token/', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response: any) => {
          // Save the JWT token
          const token = response.access;
          const refreshToken = response.refresh;

          this.authService.saveToken(token);
          this.authService.saveRefreshToken(refreshToken);

          // Optionally, decode the token to extract user group information
          const decodedToken = this.decodeToken(token);
          console.log('Logged in as:', decodedToken.username);
          console.log('User group:', decodedToken.group);

          // Redirect to the main app page
          this.router.navigate(['/app']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Invalid username or password');
        },
      });
  }

  /**
   * Utility method to decode a JWT token
   * @param token The JWT token
   * @returns The decoded token payload
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
}
