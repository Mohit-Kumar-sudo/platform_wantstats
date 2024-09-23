import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private tostr: ToastrService, ) { }
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.tostr.error('Please login to access this page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
  // canActivate(): boolean {
  //   if (this.authService.isAuthenticated()) {
  //     return true; // Allow navigation
  //   } else {
  //     this.snackBar.open('Please login to access this page', 'Close', {
  //       duration: 3000, // Adjust duration as needed
  //     });
  //     this.router.navigate(['/login']); // Redirect to login page
  //     return false; // Deny navigation
  //   }
  // }
}
