import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ReportLayoutComponent } from './layouts/report-layout/report-layout.component';
import { CompanyLayoutComponent } from './layouts/company-layout/company-layout.component';
import { AuthguardService } from '../app/services/authguard.service'; // Import the auth guard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthguardService], // Protect the user layout routes
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/user-layout/user-layout.module').then(
            (m) => m.UserLayoutModule
          ),
      },
    ],
  },
  {
    path: '',
    component: ReportLayoutComponent,
    canActivate: [AuthguardService], // Protect the report layout routes
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/report-layout/report-layout.module').then(
            (m) => m.ReportLayoutModule
          ),
      },
    ],
  },
  {
    path: '',
    component: CompanyLayoutComponent,
    canActivate: [AuthguardService], // Protect the company layout routes
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/company-layout/company-layout.module').then(
            (m) => m.CompanyLayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
