import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserToken} from '../models/auth';
import {APIEndPoints, AuthInfoData, SubscriptionMessages} from 'src/app/constants/mfr.constants';
import {LocalStorageService} from './localstorage.service';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdminLogin = new EventEmitter();
  private redirectMessage: string = '';

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router, private localStorageService: LocalStorageService) {
  }

  isLogin = new EventEmitter();

  login(userCreds: UserToken): Observable<UserToken> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<UserToken>(APIEndPoints.AUTH_TOKEN, userCreds, {headers});
  }

  showNotSubscribedMsg() {
    alert(SubscriptionMessages.FEATURE_NOT_AVAILABLE);
  }

  setSession(userData) {
    this.localStorageService.set(AuthInfoData.TOKEN_NAME, userData.data.token.split(' ')[1]);
    this.localStorageService.set(AuthInfoData.USER, userData.data);
    this.router.navigate(['']);
  }

  logout(): void {
    this.localStorageService.removeAll();
    // this.localStorageService.remove(AuthInfoData.TOKEN_NAME);
    // this.localStorageService.remove(AuthInfoData.USER);
    this.router.navigate(['login']);
  }

  getToken() {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params && params['token']) {
      this.setToken(params['token']);
      return params['token'];
    } else {
      return this.localStorageService.get(AuthInfoData.TOKEN_NAME);
    }
  }

  setToken(token) {
    return this.localStorageService.set(AuthInfoData.TOKEN_NAME, token);
  }

  getUserPermissions() {
    return jwtDecode(this.getToken());
  }

  isAuthenticated(): boolean {
    const tokenValue = !!this.getToken();
    this.isLoggedIn(tokenValue);
    return tokenValue;
  }

  register(userData) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(AuthInfoData.REGISTER, userData, {headers});
  }

  sendVerifyEmail(userData) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(AuthInfoData.USERS + 'verify', userData, {headers});
  }

  getVerifyEmail(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(AuthInfoData.USERS + `verify/${id}`, {headers});
  }

  confrimEmail(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(AuthInfoData.USERS + `verify/${id}`, {headers});
  }

  isLoggedIn(data) {
    this.isLogin.emit(data);
  }

  isAdmin() {
    console.log('getUserPermissions', this.getUserPermissions());
    const user = this.localStorageService.get(AuthInfoData.USER);
    const returnValue = user.email === 'mrfradmin@gmail.com';
    this.isAdminLoggedIn(returnValue);
    return returnValue;
  }

  isAdminLoggedIn(data) {
    this.isAdminLogin.emit(data);
  }
}
