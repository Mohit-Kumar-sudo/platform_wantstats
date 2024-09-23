import { Component, OnInit, ElementRef, ViewChild, OnChanges, Input, ViewEncapsulation, SimpleChanges, SimpleChange, TemplateRef,Inject } from '@angular/core';
import { RadarChartService } from 'src/app/services/radar-chart.service';
import { RadarModules } from '../../../models/radar/radar.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import * as html2canvas from 'html2canvas';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-porters-radar-output-dialog',
  templateUrl: './porters-radar-output-dialog.component.html',
  styleUrls: ['./porters-radar-output-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortersRadarOutputDialogComponent implements OnInit {
  reportData: ReportDataElement[];
  reportId = "";
  cnt: number;
  showYear: any;
  reportName: any;
  endYear: any;
  startYear: any;
  types: any;
  private portersModules: Array<RadarModules> = [];
  private htmlElement: HTMLElement;
  result: any;
  permissions: any;

  analyzeData:any;
  @ViewChild('container1') element: ElementRef;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  ngOnInit() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    // const currentReport = JSON.parse('{"_id":"5d95c79343759d0004219d04","status":"NOT STARTED","title":"1111 report demo","category":"tech","vertical":"SEMI","me":{"start_year":2016,"end_year":2019,"base_year":2018},"tocList":[{"section_id":"1","section_name":"MARKET ESTIMATION","section_key":"MARKET_ESTIMATION","urlpattern":"market-estimation","is_main_section_only":false},{"section_id":"2","section_name":"EXECUTIVE SUMMARY","section_key":"EXECUTIVE_SUMMARY","urlpattern":"executive-summary","is_main_section_only":true},{"section_id":"3","section_name":"MARKET INTRODUCTION","section_key":"MARKET_INTRODUCTION","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"4","section_name":"RESEARCH METHODOLOGY","section_key":"RESEARCH_METHODOLOGY","urlpattern":"research-methodology","is_main_section_only":true},{"section_id":"5","section_name":"MARKET DYNAMICS","section_key":"MARKET_DYNAMICS","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"6","section_name":"MARKET FACTOR ANALYSIS","section_key":"MARKET_FACTOR_ANALYSIS","urlpattern":"market-factor-analysis","is_main_section_only":false},{"section_id":"7","section_name":"MARKET OVERVIEW","section_key":"MARKET_OVERVIEW","urlpattern":"market-overview","is_main_section_only":false},{"section_id":"8","section_name":"COMPETITIVE LANDSCAPE","section_key":"COMPETITIVE_LANDSCAPE","urlpattern":"competitive-landscape","is_main_section_only":false},{"section_id":"9","section_name":"COMPANY PROFILES","section_key":"COMPANY_PROFILES","urlpattern":"company-profile","is_main_section_only":false},{"section_id":0,"section_name":"ABC","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"XYZ","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D1","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D2","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D3","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D4","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"AS","is_main_section_only":true,"urlpattern":"other-module"}],"owner":"5cd66952c2ee07f440988b60"}');
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.portersModules = this.data;
    this.reportId = currentReport._id;
   window.scroll(0,0)
    this.permissions= this.authService.getUserPermissions();
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.chartService.setup(this.htmlElement);
    this.chartService.populate(this.portersModules);
  }


  analyze() {
    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "Porter's 5",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  generateImage() {

    console.log(45);

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }

    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Chart.png';
      this.downloadLink.nativeElement.click();
    });
  }



  constructor(
    public dialogRef: MatDialogRef<PortersRadarOutputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private chartService: RadarChartService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private authService: AuthService
  ) { }

    doClose() {
    this.dialogRef.close();
  }
}
