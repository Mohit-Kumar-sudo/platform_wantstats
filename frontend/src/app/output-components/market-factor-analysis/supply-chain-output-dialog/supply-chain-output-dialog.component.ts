import { Component, OnInit, ElementRef, ViewChild, OnChanges, Input, ViewEncapsulation, SimpleChanges, SimpleChange, TemplateRef,Inject } from '@angular/core';
import { RadarChartService } from 'src/app/services/radar-chart.service';
import { RadarModules } from '../../../models/radar/radar.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PortersApiService } from 'src/app/services/porters/porters-api.service';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { ReportSectionService } from 'src/app/services/report-section.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import * as html2canvas from 'html2canvas';
import * as mermaid from 'mermaid';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-supply-chain-output-dialog',
  templateUrl: './supply-chain-output-dialog.component.html',
  styleUrls: ['./supply-chain-output-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupplyChainOutputDialogComponent implements OnInit {
  @ViewChild('mermaidId') mermaidId: ElementRef;
  cnt: number;
  showYear: any;
  reportName: any;
  endYear: any;
  startYear: any;
  types: any;
  chainType = '';

  chartText: String = '';
  output = '';
  element: any;
  svgCode: any = '';

  reportData: ReportDataElement[];
  reportId = "";
  private portersModules: Array<RadarModules> = [];
  result: any;

  analyzeData:any;
  permissions: any;

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;


  constructor(
    public dialogRef: MatDialogRef<SupplyChainOutputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private authService: AuthService
  ) {
  }


  ngOnInit() {
    this.sharedAnalyticsService.setReload(true)
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    // const currentReport = JSON.parse('{"_id":"5d95c79343759d0004219d04","status":"NOT STARTED","title":"1111 report demo","category":"tech","vertical":"SEMI","me":{"start_year":2016,"end_year":2019,"base_year":2018},"tocList":[{"section_id":"1","section_name":"MARKET ESTIMATION","section_key":"MARKET_ESTIMATION","urlpattern":"market-estimation","is_main_section_only":false},{"section_id":"2","section_name":"EXECUTIVE SUMMARY","section_key":"EXECUTIVE_SUMMARY","urlpattern":"executive-summary","is_main_section_only":true},{"section_id":"3","section_name":"MARKET INTRODUCTION","section_key":"MARKET_INTRODUCTION","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"4","section_name":"RESEARCH METHODOLOGY","section_key":"RESEARCH_METHODOLOGY","urlpattern":"research-methodology","is_main_section_only":true},{"section_id":"5","section_name":"MARKET DYNAMICS","section_key":"MARKET_DYNAMICS","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"6","section_name":"MARKET FACTOR ANALYSIS","section_key":"MARKET_FACTOR_ANALYSIS","urlpattern":"market-factor-analysis","is_main_section_only":false},{"section_id":"7","section_name":"MARKET OVERVIEW","section_key":"MARKET_OVERVIEW","urlpattern":"market-overview","is_main_section_only":false},{"section_id":"8","section_name":"COMPETITIVE LANDSCAPE","section_key":"COMPETITIVE_LANDSCAPE","urlpattern":"competitive-landscape","is_main_section_only":false},{"section_id":"9","section_name":"COMPANY PROFILES","section_key":"COMPANY_PROFILES","urlpattern":"company-profile","is_main_section_only":false},{"section_id":0,"section_name":"ABC","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"XYZ","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D1","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D2","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D3","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D4","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"AS","is_main_section_only":true,"urlpattern":"other-module"}],"owner":"5cd66952c2ee07f440988b60"}');
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    const element: any = this.mermaidId.nativeElement;
    element.innerHTML = this.data.svgCode;
    this.chainType  = this.data.chainType;
   window.scroll(0,0)
  //  this.generateChart();
    this.permissions = this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "Supply/Value chain",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  ngAfterViewInit() {


    mermaid.initialize(
      {  theme: 'forest',
        startOnLoad: false,
        securityLevel: 'loose',
        cloneCssStyles: true,
        flowchart: {
          htmlLabels: false,
          useMaxWidth:false
        },
       });
  }

  generateChart() {

    this.chartText = this.data;
    this.svgCode = '';
    if (!this.chartText) {
      this.chartText = 'graph TD;';
    }
    const element: any = this.mermaidId.nativeElement;
    const graphDefinition = this.chartText;
    mermaid.render('graphDiv', graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
    });


  }

  generateImage() {

    console.log(678);

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

  doClose() {
    this.dialogRef.close();
  }
}

