import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleDataService {
  private titleDataSubject = new BehaviorSubject<any[]>([]);
  titleData$ = this.titleDataSubject.asObservable();

  constructor() { }

  setTitleData(data: any[]) {
    // console.log("dataservice",data)
    this.titleDataSubject.next(data);
  }

  getTitleData() {
    return this.titleDataSubject.value;
  }
}
