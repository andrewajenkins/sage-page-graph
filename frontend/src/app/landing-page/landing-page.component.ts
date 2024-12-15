import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    ButtonDirective,
    Ripple,
    AvatarGroupModule,
    AvatarModule,
    AccordionModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/app']); // Redirect to the main app page if already logged in
    }
  }
  onLoginClick() {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  onRegisterClick() {
    this.router.navigate(['/register']); // Navigate to the register page
  }
}
