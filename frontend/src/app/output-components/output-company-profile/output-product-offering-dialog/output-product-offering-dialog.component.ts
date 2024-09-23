import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;
declare var JSONLoop: any;
import * as html2canvas from 'html2canvas';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-output-product-offering-dialog',
  templateUrl: './output-product-offering-dialog.component.html',
  styleUrls: ['./output-product-offering-dialog.component.scss']
})
export class OutputProductOfferingDialogComponent implements OnInit {

  currentReport: any;
  currentCompany: any;
  proData: any;

  analyzeData: any;
  reportId = "";
  permissions: any;


  constructor(
    public dialogRef: MatDialogRef<OutputProductOfferingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private authService: AuthService
  ) { }

  @ViewChild('screen') screenPie: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  getReportDetails() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.currentCompany = this.proData.cpName;
    this.reportId = this.currentReport._id;
    window.scroll(0,0)
  }

  ngOnInit() {
    $.ready;
    this.proData = this.data
    this.getReportDetails();
    this.orgCharts();
    this.permissions = this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "Product/Services offering",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  orgCharts() {

    let temporaryThis = this;
    (function ($) {
      $(function () {
        var oc = $('#chart-container1').orgchart({
          'data': temporaryThis.proData.datasource,
          'chartClass': 'edit-state',
          'zoom': true,
          'pan': true,
          'parentNodeSymbol': 'fa-th-large'
        });
      });
    })($);
  }

  doClose() {
    this.dialogRef.close();
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screenPie.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'product offering.png';
      this.downloadLink.nativeElement.click();
    });
  }

}
