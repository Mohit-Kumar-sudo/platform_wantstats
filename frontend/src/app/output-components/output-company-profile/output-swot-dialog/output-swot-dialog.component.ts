import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConstantKeys} from '../../../constants/mfr.constants';
import {LocalStorageService} from '../../../services/localstorage.service';
import * as html2canvas from 'html2canvas';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-output-swot-dialog',
  templateUrl: './output-swot-dialog.component.html',
  styleUrls: ['./output-swot-dialog.component.scss']
})
export class OutputSwotDialogComponent implements OnInit {

  currentReport: any;
  swotData: any = [];
  strength: any;
  weakness: any;
  opportunity: any;
  threat: any;

  analyzeData:any;
  reportId = "";

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  currentCompany: any;
  permissions: any;

  constructor(
    public dialogRef: MatDialogRef<OutputSwotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportId = this.currentReport._id;
    this.swotData = this.data;
    this.categorizedData(this.swotData);
  window.scroll(0,0)
    this.permissions = this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "SWOT",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  categorizedData(data) {
    data.swot.map(d => {
      if (d.key === 'STRENGTH') {
        this.strength = d.value;
      }
      if (d.key === 'WEAKNESS') {
        this.weakness = d.value;
      }
      if (d.key === 'OPPORTUNITIES') {
        this.opportunity = d.value;
      }
      if (d.key === 'THREAT') {
        this.threat = d.value;
      }
    });
  }

  doClose() {
    this.dialogRef.close();
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'swot.png';
      this.downloadLink.nativeElement.click();
    });
  }
}
