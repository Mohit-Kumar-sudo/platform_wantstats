import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MarketEstimationService } from './market-estimation.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketBreakupService {
  constructor(private http: HttpClient,
    private marketEstimationService: MarketEstimationService) { }

  public getMarketBreakupRegionDataService(reportId, region): Observable<any[]> {

    let response = []
    if (region) {
      region.children.forEach((element, i) => {
        response.push(this.marketEstimationService.getMeDataByRegion(reportId, element.id))
      });
    }
    return forkJoin([...response]);
  }

  public getMarketBreakupSegmentDataService(reportId, treeData): Observable<any[]> {
    let response = []

    if (treeData && treeData.children) {
      treeData.children.forEach((element, i) => {
        response.push(this.marketEstimationService.getMeDataBySegment(reportId, element.id))
      });
    }
    return forkJoin([...response])
  }

  public getMarketBreakupDataService(reportId, region, treeData): Observable<any[]> {

    let response1 = this.getMarketBreakupRegionDataService(reportId, region)
    let response2 = this.getMarketBreakupSegmentDataService(reportId, treeData)
    return forkJoin([response1, response2]);
  }
}
