import { Component } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { Router, RouterOutlet } from '@angular/router';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [Ripple, RouterOutlet, BadgeModule],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.scss',
})
export class MenuLayoutComponent {
  constructor(private router: Router) {}
  goToLandingPage() {
    this.router.navigate(['/landing']); // Navigate to the landing page
  }

  goToAboutPage() {
    this.router.navigate(['/about']); // Navigate to the about page
  }
}
