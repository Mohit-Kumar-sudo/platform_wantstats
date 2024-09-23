import { Component, OnInit } from '@angular/core';
import { ConstantKeys, ProjectConstants } from 'src/app/constants/mfr.constants';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {

  regions: any;
  currentReport: any;

  constructor(
    private localStorageService:LocalStorageService
  ) {
    this.regions = ProjectConstants.REGIONS;
  }

  ngOnInit() {
     this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
  }
}
