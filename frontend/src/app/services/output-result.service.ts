import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIEndPoints } from 'src/app/constants/mfr.constants';
import { BehaviorSubject, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OutputResultsService {

  private loadingIndicator = new BehaviorSubject<boolean>(false);
  loadingIndicator$ = this.loadingIndicator.asObservable();

  constructor(private httpClient: HttpClient) {}

  searchTablesChartsImagesByStr(type: string, terms: string[]) {
    this.loadingIndicator.next(true);
    if (terms.length === 1 && terms[0] === '') {
      terms = ['Iot']; 
    }
    const headers = new HttpHeaders({
      "Content-Type": "text/plain",
    });
    return this.httpClient.get<any>(
      APIEndPoints.ES_API + "/" + type + "?q=" + terms,
      { headers }
    )
    .pipe(
      finalize(() => this.loadingIndicator.next(false)) // Set loading indicator to false after response
    );
  }

  searchImagesByStr(str) {}

  searchChartsByStr(str) {}
}
