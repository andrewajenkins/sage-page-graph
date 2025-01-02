import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app/app.component';
import { StoreComponent } from './store/store.component';
import { InfoComponent } from './info/info.component';
import { SettingsComponent } from './settings/settings.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './services/auth-guard';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent, // Default route with menu layout
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Default to landing page
      { path: 'login', component: LoginComponent },
      { path: 'landing', component: LandingPageComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'about', component: AboutComponent },
      { path: 'privacy', component: PrivacyComponent },
    ],
  },
  {
    path: 'app',
    component: AppLayoutComponent, // App layout without menu
    canActivate: [AuthGuard],
    children: [{ path: 'app', component: AppComponent }],
  },
];
