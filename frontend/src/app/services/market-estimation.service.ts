import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { APIEndPoints } from '../constants/mfr.constants';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MarketEstimationService {

  constructor(private httpClient: HttpClient) {
  }

  public getMeData(reportId): Observable<any> {
    return this.httpClient.get<any>(APIEndPoints.REPORT_API + `/${reportId}/` + `me`);
  }
  
  public getMeDataBySegment(reportId, segementId): Observable<any> {
    return this.httpClient.get<any>(APIEndPoints.ME_API + `/${reportId}/views?key=MARKET_BY_SEGMENT&value=${segementId}`);
  }

  public getMeDataByRegion(reportId, regionId): Observable<any> {
    return this.httpClient.get<any>(APIEndPoints.ME_API + `/${reportId}/views?key=MARKET_BY_REGION&value=${regionId}`);
  }

  public getDataSegOrReg(reportId, regionId, key) {
    return this.httpClient.get<any>(APIEndPoints.ME_API + `/${reportId}/views?key=${key}&value=${regionId}`);
  }

  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }

  replacedTxtWithSegName(segment){
    if (segment) {
      segment = _.toLower(segment)
    }
    return segment.replace(/&/ig,'and')
    .replace(/-/ig,' ')
    .replace(/_/ig,' ')
    .split('.').join('')
    .split('(').join('')
    .split(')').join('')
    .split(',').join('')
  }

  getTitle(t, segments) {
    if (t && segments && segments.length) {
      let title = _.toLower(t);
      title = title.split('_').join(' ')
      if (title.includes(' by regions')) {
        title = title.replace(' by regions', "")
        segments.forEach(d => {
          if (title == this.replacedTxtWithSegName(_.toLower(d.name))) {
            title = title.replace(title, d.name);
            if (title.includes("_")) {
              title = title.split("_")[1]
            }
            title = title + " By Regions"
            return title
          }
        })
        return title
      } else if (title.includes(' by sub-segments')) {
        title = title.replace(' by sub-segments', "")
        title = title.split('_').join(' ')
        segments.forEach(d => {
          if (title == this.replacedTxtWithSegName(_.toLower(d.name))) {
            title = title.replace(title, d.name);
            if (title.includes("_")) {
              title = title.split("_")[1]
            }
            return title
          }
        })
        return title
      }
      return title
    }
    return t
  }
  getRegionTitle(t, segments) {
    let title = t
    if (title && segments && segments.length) {
      if (title.includes(' BY ')) {
        let sub_title = t.split(" BY ")[1]
        let main_title = t.split(" BY ")[0]
        main_title = main_title.replace(/\w+/g, _.capitalize);
        sub_title = _.toLower(sub_title);
        sub_title = sub_title.split('_').join(' ')
        segments.forEach(d => {
          if (sub_title == this.replacedTxtWithSegName(_.toLower(d.name))) {
            sub_title = sub_title.replace(sub_title, d.name);
            if (sub_title.includes("_")) {
              sub_title = sub_title.split("_")[1]
            }
            title = main_title + " by " + sub_title
            return title
          }
        })
        return title
      }
      return title
    }
    return title
  }
}
