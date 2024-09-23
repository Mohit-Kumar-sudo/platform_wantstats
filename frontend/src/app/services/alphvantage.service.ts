import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { APIEndPoints, ConstantKeys } from 'src/app/constants/mfr.constants';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AlphaVantageService {

    stockBtn = new EventEmitter();
    tickerSymbol = new EventEmitter();
    constructor(
        private http: HttpClient
    ) { }

    getStockDetails(symbol) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http
            .get(`${APIEndPoints.ALPHA_VANTAGE}GLOBAL_QUOTE&symbol=${symbol}&apikey=${ConstantKeys.ALPHA_VANTAGE_KEY}`, { headers })
            .pipe(
                map(ele => ele),
                catchError(this.handleError)
            );
    }
    getStockDailyDetails(symbol: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this.http
        .get(`${APIEndPoints.ALPHA_VANTAGE}TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=compact&apikey=${ConstantKeys.ALPHA_VANTAGE_KEY}`, { headers })
        .pipe(
          map(response => response),
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        errorMessage = error.error['Error Message'] || `Server returned code ${error.status}: ${error.statusText}`;
      }
      return throwError(errorMessage);
    }

    getStockYearlyDetails(symbol) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'

        });
        return this.http
            .get(`${APIEndPoints.ALPHA_VANTAGE}TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=compact&apikey=${ConstantKeys.ALPHA_VANTAGE_KEY}`, { headers })
            .pipe(
                map(ele => ele),
                catchError(this.handleError)
            );
    }

    getStockMonthlyDetails(symbol) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'

        });
        return this.http
            .get(`${APIEndPoints.ALPHA_VANTAGE}TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ConstantKeys.ALPHA_VANTAGE_KEY}`, { headers })
            .pipe(
                map(ele => ele),
                catchError(this.handleError)
            );
    }

    stockSearchService(searchText) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http
            .get<any>(`${APIEndPoints.ALPHA_VANTAGE}SYMBOL_SEARCH&keywords=${searchText}&apikey=${ConstantKeys.ALPHA_VANTAGE_KEY}`, { headers })
            .pipe(
                map(ele => ele),
                catchError(this.handleError)
            );
    }
    // private handleError(error: HttpErrorResponse) {
    //   let errorMessage = 'An unknown error occurred!';
    //   if (error.error instanceof ErrorEvent) {
    //     // A client-side or network error occurred
    //     errorMessage = `An error occurred: ${error.error.message}`;
    //   } else {
    //     // The backend returned an unsuccessful response code
    //     if (error.error['Error Message']) {
    //       errorMessage = error.error['Error Message'];
    //     } else {
    //       errorMessage = `Backend returned code ${error.status}, ` +
    //                     `body was: ${error.error}`;
    //     }
    //   }
    //   console.error(errorMessage); // Log to console
    //   return throwError(errorMessage);
    // }

    stockButton(event) {
        this.stockBtn.emit(event)
    }

    getTickerEmitter(symbol) {
        this.tickerSymbol.emit(symbol)
    }

    getSearchFiling(value) {
        return fetch(`${APIEndPoints.BASE_URL}api/v1/cik/${value}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        }).then(response => response.json())
    }
}
