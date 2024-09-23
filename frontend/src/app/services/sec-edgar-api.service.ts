import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, map, catchError } from 'rxjs';
import { APIEndPoints, AuthInfoData } from '../constants/mfr.constants';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class SecEdgarApiService {
  //For supply chain node
  private serviceEndPoint =
    'https://searchwww.sec.gov/EDGARFSClient/jsp/EDGAR_MainAccess.jsp?search_text=%22Significant%20Accounting%20Policies%22&sort=Date&formType=Form10K&isAdv=true&stemming=true&numResults=10&queryCo=apple&numResults=10';
  private scrapeUrl = APIEndPoints.BASE_URL + 'sec-data';
  private searchUrl = APIEndPoints.BASE_URL + 'sec-search';
  private rawUrl = APIEndPoints.BASE_URL + 'sec-raw-data';
  private documentUrl = APIEndPoints.BASE_URL + 'sec-document';
  private newSecSearchUrl = APIEndPoints.BASE_URL + 'sec-search-new';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }

  getRawData(): Observable<any> {
    return this.httpClient.get(`${this.rawUrl}`);
  }

  getEdgarData(searchQuery): Observable<any> {
    return this.httpClient.get(`${this.scrapeUrl}/${searchQuery}`);
  }

  getSearchResult(
    searchText,
    formType,
    company_name,
    from_date,
    to_date,
    page
  ): Observable<any> {
    if (from_date)
      from_date = from_date._d.toLocaleDateString().replace(/\//g, '-');
    if (to_date) to_date = to_date._d.toLocaleDateString().replace(/\//g, '-');
    if (!searchText) searchText = '*';
    if (!formType) formType = 'All Forms';
    return this.httpClient.get(
      `${this.searchUrl}/${searchText}/${formType}/${company_name}/${from_date}/${to_date}/${page}`
    );
  }

  openSecDocument(url, keyword): Observable<any> {
    let data = {
      url: url,
      keyword: keyword,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient.post(this.documentUrl, data, { headers }).pipe(
      map((ele) => {
        return ele;
      }),
      catchError(this.handleError)
    );

    // fetch(this.documentUrl, {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: data
    // })
    //     .then(response => {
    //       console.log(response);
    //     })
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err))
  }

  getAll() {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyurl + this.serviceEndPoint, {
      method: 'get',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data) {
          fetch(this.scrapeUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
            .then((response) => response.text())
            .then((data) => {
              // console.log(data)
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

  getCikDoc(cik) {
    return <any>fetch(`${APIEndPoints.BASE_URL}sec-cik?cik=${cik}`, {
      method: 'get',
      headers: new Headers({
        Authorization: this.localStorageService.get(AuthInfoData.USER).token,
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json());
  }

  getDBCikDoc(cik) {
    return <any>fetch(`${APIEndPoints.BASE_URL}sec-cik/${cik}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    }).then((response) => response.json());
  }
  
  getNewSecData(data): Observable<any> {
    return this.httpClient.post(this.newSecSearchUrl, data).pipe(
      map((ele) => {
        return ele;
      }),
      catchError(this.handleError)
    );
  }
}
