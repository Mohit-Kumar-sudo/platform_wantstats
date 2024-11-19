import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { APIEndPoints } from '../constants/mfr.constants';

@Injectable({
  providedIn: 'root'
})
export class YoutubeApiService {
  keys1 = "AIzaSyCyvTWyXGu4lvbCBbUnIK9Qs5fCBmECNeA";
  keys = [
    "AIzaSyB5MbNMzLpE_JecMM9aAZwoczp44MgmmIM",
    "AIzaSyDFFRtIHjHuZ-tC9gfzZFaceqP4QtCVI08",
    "AIzaSyB6N53jRJlCcrGuZ24TBMoK4rTvWhHvi1I",
    "AIzaSyCXldh4SWkVBuEg1LgVkHiYvzs7EKSGVM8",
    "AIzaSyCo2V7Au8SfSCEPZwWN9BJTKbbNAarffm8",
    "AIzaSyCtIt6Xu-IzSaJCCDZbaeR5s1T4mE7WwFk",
    "AIzaSyAop15AOkF47TxjxuJw_Mpdck95mgNsQ0s",
    "AIzaSyALfD97hiAeaWb3zab54iV3HSfh4fE3Pbc",
    "AIzaSyCrHn8z5z1Fi3-vlrGeSxroLfX0QiXBk4Q",
    "AIzaSyAEZKlFUk_yZrNz-HPR1wPdTKwSFdphhcg",
  ];
  apiUrl: string = "https://www.googleapis.com/youtube/v3/search";
  maxResults: number = 10;
  requestsPerMinute: number = 10;
  interval: number = 60000;
  currentKeyIndex: number = 0;
  lastFetchTime: number;

  private serviceAllVideos = APIEndPoints.BASE_URL + "videos-filter";
  private serviceEndPoint = `https://www.googleapis.com/youtube/v3/search?key=${this.keys1}&part=snippet&maxResults=20&relevanceLanguage=EN&order=date&publishedAfter=2022-01-01T00:00:00Z`;

  constructor(private httpClient: HttpClient) {}

  fetchWithKey(key: string, searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}?key=${key}&part=snippet&maxResults=${this.maxResults}&relevanceLanguage=EN&q=${searchQuery}&type=video&order=date&publishedAfter=2022-01-01T00:00:00Z`;
    return this.httpClient.get(url).pipe(
      catchError((error) => {
        console.error(`Failed to fetch data using key ${key}:`, error);
        return throwError(error);
      })
    );
  }

  getAll(searchQuery: string): Observable<any> {
    const key = this.keys[this.currentKeyIndex];
    const startTime = Date.now();
    const elapsedTime = startTime - this.lastFetchTime;
    if (elapsedTime < this.interval / this.requestsPerMinute) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    }
    return this.fetchWithKey(key, searchQuery).pipe(
      catchError((error) => {
        if (this.currentKeyIndex === this.keys.length - 1) {
          return throwError(
            "Exceeded quota for all keys or failed to fetch data using all keys"
          );
        } else {
          this.currentKeyIndex++;
          return this.getAll(searchQuery); // Retry with the next key
        }
      })
    );
  }

  getYoutubeResultsForAll(): Observable<any> {
    return this.httpClient.get(this.serviceAllVideos);
  }

  getResultsOnScroll(searchQuery, pageToken): Observable<any> {
    return this.httpClient.get(
      `${this.serviceEndPoint}` +
        "pageToken=" +
        pageToken +
        "&q=" +
        searchQuery +
        "&type=video"
    );
  }
}
