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

export const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent, // Default route with menu layout
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Default to landing page
      { path: 'login', component: LoginComponent },
      { path: 'store', component: StoreComponent },
      { path: 'info', component: InfoComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'landing', component: LandingPageComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'app',
    component: AppLayoutComponent, // App layout without menu
    children: [
      { path: 'app', component: AppComponent, canActivate: [AuthGuard] },
    ],
  },
];
