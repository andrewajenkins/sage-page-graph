import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { DialogModule } from 'primeng/dialog';
import { filter } from 'rxjs';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, RouterModule, Ripple],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sage-page-graph';
  isAppRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Check if the current route is part of your app pages
        console.log(event.urlAfterRedirects);
        this.isAppRoute = event.urlAfterRedirects.startsWith('/app/');
      });
  }
}
