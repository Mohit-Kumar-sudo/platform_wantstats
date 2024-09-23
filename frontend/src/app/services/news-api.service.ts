import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIEndPoints } from 'src/app/constants/mfr.constants';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  // For supply chain node
  private serviceEndPoint = APIEndPoints.BASE_URL+ 'scrape';
  private statusServiceEndPoint = APIEndPoints.BASE_URL+ 'scrape-status';

  constructor(private httpClient: HttpClient) {
  }

  getAll(searchQuery, pageNo): Observable<any> {
    return this
      .httpClient
      .get(`${this.serviceEndPoint}/${searchQuery}/${pageNo}`);
  }

  getStatus(searchQuery, pageNo): Observable<any> {
    return this
      .httpClient
      .get(`${this.statusServiceEndPoint}/${searchQuery}/${pageNo}`);
  }
}