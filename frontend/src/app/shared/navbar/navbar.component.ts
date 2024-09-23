import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: any;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isAuthenticated();
    // console.log("this.isLoggedIn",this.isLoggedIn)
  }

  ngOnInit(): void {}
}
