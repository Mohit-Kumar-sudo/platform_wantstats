import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { APIEndPoints } from '../constants/mfr.constants';
import { catchError } from 'rxjs/operators';
import { parse } from 'path';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  toastr: any;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer your-jwt-token', // replace with your actual JWT token
    });
  }

  getHistory(userId) {
    return this.http.get<any>(APIEndPoints.History_Lists + '/' + userId);
  }

  getReportsList(): Observable<any> {
    return this.http.get<any>(APIEndPoints.Report_Access + '/getReportsList');
  }

  addReportsToActivity(activityList: any): Observable<any> {
    return this.http
      .post<any>(APIEndPoints.Report_Access + '/addReports', activityList)
      .pipe(
        catchError((error) => {
          console.error('Error adding reports to activity:', error);
          throw error;
        })
      );
  }

  updateReport(reportList: any): Observable<any> {
    return this.http
      .post<any>(APIEndPoints.Report_Access + '/updateReportsList', reportList)
      .pipe(
        catchError((error) => {
          console.error('Error updating reports to activity:', error);
          throw error;
        })
      );
  }

  addCharts(chart: any): Observable<any> {
    console.log('chart', chart)
    return this.http
      .post<any>(APIEndPoints.Report_Access + '/addCharts', chart)
      .pipe(
        catchError((error) => {
          console.error('Error adding reports to activity:', error);
          throw error;
        })
      );
  }

  updateChart(chart:any): Observable<any>{
    return this.http
    .post<any>(APIEndPoints.Report_Access + '/updateCharts', chart)
    .pipe(
      catchError((error) => {
        console.error('Error updating reports to activity:', error);
        throw error;
      })
    );
  }


  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(error.error.errors || 'Server error');
  }
}
