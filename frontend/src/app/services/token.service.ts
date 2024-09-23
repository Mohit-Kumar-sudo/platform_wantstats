import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private router: Router
  ) { }

  getAuthorizationAccessToken() {
    return localStorage.getItem('secure_token');
  }

  getAuthorizationRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  getCurrentUser() {
    const masterData = localStorage.getItem('master') as string;
    return JSON.parse(masterData);
}

  setCurrentUser(master:any) {
    return localStorage.setItem('master', JSON.stringify(master));
  }

  setAuthorizationAccessToken(token:any) {
    localStorage.setItem('secure_token', token);
  }

  setAuthorizationRefreshToken(token:any) {
    localStorage.setItem('refresh_token', token);
  }

  logout() {
    localStorage.removeItem('secure_token');
    localStorage.removeItem('master');
    this.router.navigate(['/login']);
  }
}
