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
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        // Assuming authService handles token saving internally
        console.log('Login successful!');

        // Decode the token to extract user group information (if needed)
        // const decodedToken = this.authService.decodeToken();
        // if (decodedToken) {
        //   console.log('Logged in as:', decodedToken.username);
        //   console.log('User group:', decodedToken.group);
        // }

        // Redirect to the main app page
        this.router.navigate(['/app']);
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Invalid username or password');
      },
    });
  }

  onRegister() {
    this.router.navigate(['register']);
  }
}
