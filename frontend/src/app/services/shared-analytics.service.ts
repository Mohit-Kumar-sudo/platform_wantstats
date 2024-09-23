import { Injectable } from '@angular/core';
import { AnalyticsModel } from '../models/analytics.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedAnalyticsService {

  data: AnalyticsModel;
  isReload = false;

  private reportSource = new BehaviorSubject<string>("default report");
  currentReport = this.reportSource.asObservable();

  constructor() {
   }

  getReload(){
    return this.isReload
  }

  setReload(reload:boolean){
    this.isReload = reload
  }

}
