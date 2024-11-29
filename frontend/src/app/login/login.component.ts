import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormField, FormsModule, MatInput, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.http
      .post('/api/login/', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // Redirect to your app's main page
        },
        error: (err) => {
          this.errorMessage = 'Invalid username or password';
        },
      });
  }
}
