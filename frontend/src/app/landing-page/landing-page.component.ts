import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}
  onLoginClick() {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  onRegisterClick() {
    this.router.navigate(['/register']); // Navigate to the register page
  }
}
