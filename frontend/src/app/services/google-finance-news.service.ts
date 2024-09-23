import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {APIEndPoints} from 'src/app/constants/mfr.constants'

@Injectable({
  providedIn: 'root'
})
export class GoogleFinanceNewsService {

  apiBaseUrl = APIEndPoints.BASE_URL;
	private serviceEndPoint = this.apiBaseUrl + 'finance-news';
	private postUrl = this.apiBaseUrl + 'all-finance-news';

	constructor(private httpClient: HttpClient) {
	}

	getAll(searchQuery): Observable<any> {
		return this
			.httpClient
			.get(`${this.serviceEndPoint}/${searchQuery}`)
	}

	getFinanceNewsForAll(content): Observable<any> {
		let results = [];
		return new Observable(observer => {
			let requests = content.map((item, index) => {
				let searchQuery = item.news;
				return this.httpClient.get(`${this.serviceEndPoint}/${searchQuery}`).toPromise().then(data => {
					results.push(data);
					if (index === content.length - 1) {
						observer.next(results);
						observer.complete();
					}
				});
			});
	
			Promise.all(requests).catch(error => {
				observer.error(error);
			});
		});
	}
	

	post(content) {
		// console.log("All",content);

		let data = {
			content: content
		};

		fetch(this.postUrl, {
			method:'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				data
			})
		}).then(response => response.json())
			.then(data => {
				// console.log(data);

			}).catch(error => {
				console.log("error", error);

			})

	}
}
