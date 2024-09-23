import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedInteconnectService {

  interConnectData = {
    'section': '',
    'data': []
  }
  reportConnectData: any;
  fillingConnect = [];
  contents: any = [];
  finalNews: any = [];
  reportId = '';

  private searchText = new BehaviorSubject('Corona Economy');
  sharedText = this.searchText.asObservable();

  nextText(searchText: string) {
    this.searchText.next(searchText)
  }
  constructor() { }


}