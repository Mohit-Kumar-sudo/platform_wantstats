import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.tokenService.getAuthorizationAccessToken();
    if (authToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: authToken }
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
