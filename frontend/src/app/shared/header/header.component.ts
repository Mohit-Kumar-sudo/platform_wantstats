import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.isLogin.subscribe((d) => {
      this.isLoggedIn = d;
    });
  }

  navigate() {
    this.router.navigateByUrl('/');
  }
  logoutMe() {
    this.authService.logout();
  }
  handleClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/home']); // Redirect to home if logged in
    } else {
      this.router.navigate(['/login']); // Redirect to login if not logged in
    }
  }
}
