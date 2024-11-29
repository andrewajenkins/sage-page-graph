import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app/app.component';
import { StoreComponent } from './store/store.component';
import { InfoComponent } from './info/info.component';
import { SettingsComponent } from './settings/settings.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: 'store', component: StoreComponent },
  { path: 'info', component: InfoComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'app', component: AppComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
