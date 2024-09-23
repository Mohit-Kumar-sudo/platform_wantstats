import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {APIEndPoints} from 'src/app/constants/mfr.constants';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  constructor(private http: HttpClient) { }

  sendWhatsAppMessage(phoneNo): Observable<any> {
    return this.http.get<any>(APIEndPoints.WHATS_APP_API + '?phone=' + phoneNo);
  }
}
