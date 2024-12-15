import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  // username: string = '';
  // password: string = '';
  // confirmPassword: string = '';
  // key: string = '';
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // Initialize the form with FormControl
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required, Validators.minLength(32)]),
    });
  }

  onSubmit() {
    if (
      this.registerForm.get('password')!.value !==
      this.registerForm.get('confirmPassword')!.value
    ) {
      alert('Passwords do not match');
      return;
    }
    this.authService
      .register(
        this.registerForm.get('username')!.value,
        this.registerForm.get('password')!.value,
        this.registerForm.get('key')!.value,
      )
      .subscribe({
        next: (response: any) => {
          // Assuming authService handles token saving internally
          console.log('Registration successful!');

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

  onSignIn() {
    this.router.navigate(['login']);
  }
}

export function validateEqual(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.parent?.get('password');
  const confirmPassword = control;

  if (password && confirmPassword) {
    return password.value === confirmPassword.value
      ? null
      : { validateEqual: true };
  }
  return null;
}
