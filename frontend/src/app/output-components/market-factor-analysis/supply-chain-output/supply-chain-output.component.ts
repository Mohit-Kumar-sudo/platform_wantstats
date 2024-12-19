import {Component, OnInit, ElementRef, ViewChild, TemplateRef} from '@angular/core';
import mermaid from 'mermaid';
import {MatDialog} from '@angular/material/dialog';
import * as html2canvas from 'html2canvas';
import {SupplyChainApiService} from 'src/app/services/supplyChain/supply-chain-api.service';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import {RadarChartService} from 'src/app/services/radar-chart.service';
import {PortersApiService} from 'src/app/services/porters/porters-api.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import * as _ from 'lodash';
import {SupplyChainOutputDialogComponent} from '../supply-chain-output-dialog/supply-chain-output-dialog.component';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-supply-chain-output',
  templateUrl: './supply-chain-output.component.html',
  styleUrls: ['./supply-chain-output.component.scss']
})
export class SupplyChainOutputComponent implements OnInit {

  @ViewChild('mermaidId') mermaidId: ElementRef;
  nodes: any;
  modules = {};
  paths: any = [];
  chartText = '';
  output = '';
  element: any;
  svgCode: any = '';
  chainType = '';

  reportData: ReportDataElement[];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';

  analyzeData: any;

  keyword:any;

  interConnectData =  {
    'section' : '',
    'data' : []
  }
  reportConnectData = {
    'section' : '',
    'data' : []
  }
  overlaps : any;
  permissions: any;

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(
    private supplyChainApiService: SupplyChainApiService,
    private chartService: RadarChartService,
    private portersApiService: PortersApiService,
    private routes: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private reportService: ReportService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private sharedAnalyticsService: SharedAnalyticsService,
    public activateRoutes: ActivatedRoute) {
  }

  generateImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.chainType + ', ' + this.reportName + ' [' + this.startYear + '-' + this.endYear + ']';
      this.downloadLink.nativeElement.click();
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.permissions = this.authService.getUserPermissions();
    this.getReportDetails();
  }
  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: 'Supply/Value chain',
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    const sectionData = this.localStorageService.get(ConstantKeys.CURRENT_SECTION);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if(currentReport.overlaps){
      this.overlaps = currentReport.overlaps;

      let interConnect = this.overlaps.filter(e => e.section_name == 'Suuply / Value Chain Analysis')

      if (interConnect.length){
        let dt = {
          'section' : '',
          'data' : []
        }
        if(interConnect[0].data && interConnect[0].data.length){
          if(interConnect[0].section_name) {
            dt.section = interConnect[0].section_name
            for(let i=0;i<interConnect[0].data.length && i<2;i++){
              dt.data.push(interConnect[0].data[i])
            }
          }
        }

        this.interConnectData = dt

      }
      let reportConnect = this.overlaps.filter(e => e.section_name == 'Report')

      if (reportConnect.length){
        let dt = {
          'section' : '',
          'data' : []
        }
        if(reportConnect[0].data && reportConnect[0].data.length){
          if(reportConnect[0].section_name) {
            dt.section = reportConnect[0].section_name
            for(let i=0;i<reportConnect[0].data.length && i<2;i++){
              dt.data.push(reportConnect[0].data[i])
            }
          }
        }

        this.reportConnectData = dt
      }
    }

    if (this.activateRoutes.snapshot.queryParams) {
      if (this.activateRoutes.snapshot.queryParams['reportId']) {
        this.reportId = this.activateRoutes.snapshot.queryParams['reportId'];
        // console.log('reportId', this.reportId)
        this.reportService.setReportData(this.reportId);
      }
      if (this.activateRoutes.snapshot.queryParams['reportName']) {
        this.reportName = this.activateRoutes.snapshot.queryParams['reportName'];
      }
    }

    this.reportService.getSectionKeyDetials(this.reportId, 'MARKET_FACTOR_ANALYSIS').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
    });
  }

  getReportDetailsSuccess(data: any) {
    // console.log("data",data)
    data.forEach(d => {
      if (d.meta_info.section_key === 'supply-chain') {
        this.chainType = d.meta.chain_type;
        this.chainType = _.upperFirst(_.toLower(this.chainType));
        this.getSupplyChainDataSuccess(d.meta.data, d.content);

      }
    });
    this.spinner.hide();
  }

  getSupplyChainDataSuccess(data, nodes) {
    this.paths = data;
    this.nodes = nodes;
    this.generateChart();
  }


  ngAfterViewInit() {
    mermaid.initialize(
      {
        theme: 'forest',
        startOnLoad: false,
        securityLevel: 'loose',
        cloneCssStyles: true,
        flowchart: {
          htmlLabels: false,
          useMaxWidth: false
        },
      });
    window.scrollTo(0, 0);
  }

  generateChart() {
    let text = 'graph LR;';
    for (let i = 0; i < this.paths.length; i++) {

      let from_title = this.paths[i].from.title;
      let to_title = this.paths[i].to.title;

      from_title = from_title.replace(/(.{20}[^\s]*)/g, "$1<br>");
      to_title = to_title.replace(/(.{20}[^\s]*)/g, "$1<br>");

      text += this.paths[i].from.order_id + '[' + "\"" + from_title +  "\"" + '] -->'
        + this.paths[i].to.order_id + '[' + "\"" +  to_title + "\"" + '];';
    }
    this.chartText = text;
    this.svgCode = '';
    if (!this.chartText) {
      this.chartText = 'graph TD;';
    }
    const element: any = this.mermaidId.nativeElement;
    // console.log("element",element)
    const graphDefinition = this.chartText;
    mermaid.render('graphDiv', graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      this.svgCode = svgCode;
      document.getElementById('graphDiv').style.maxWidth = ""
    });


  }

  openDroctDialog() {
    let sendData = {
      svgCode: this.svgCode,
      chainType: this.chainType
    };
    const dialogRef = this.dialog.open(SupplyChainOutputDialogComponent, {
      width: '99%',
      // maxWidth: '800px',
      data: sendData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
