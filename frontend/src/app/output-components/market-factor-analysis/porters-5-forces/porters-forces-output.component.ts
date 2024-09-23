import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  TemplateRef
} from '@angular/core';
import {RadarChartService} from 'src/app/services/radar-chart.service';
import {RadarModules} from '../../../models/radar/radar.model';
import {MatDialog} from '@angular/material/dialog';
import {PortersApiService} from 'src/app/services/porters/porters-api.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import {PortersRadarOutputDialogComponent} from '../porters-radar-output-dialog/porters-radar-output-dialog.component';
import * as html2canvas from 'html2canvas';
import {Porters5DiagramComponent} from '../porters5-diagram/porters5-diagram.component';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-porters-forces-output',
  templateUrl: './porters-forces-output.component.html',
  styleUrls: ['./porters-forces-output.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortersForcesOutputComponent implements OnInit {


  reportData: ReportDataElement[];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';
  conclusion = '';
  private portersModules: Array<RadarModules> = [];

  data = [
    {
      id: '1',
      name: 'Threat of New Entrants',
      children: []
    },
    {
      id: '2',
      name: 'Bargaining Power of Suppliers',
      children: []
    },
    {
      id: '3',
      name: 'Threat of Substitutes',
      children: []
    },
    {
      id: '4',
      name: 'Bargaining Power of Buyers',
      children: []
    },
    {
      id: '5',
      name: 'Segment Rivalry',
      children: []
    }
  ];

  @ViewChild('container') element: ElementRef;
  htmlElement: HTMLElement;

  bargainingPowerOfBuyersRating = [];
  bargainingPowerOfSuppliersRating = [];
  segmentRivalryRating = [];
  threatOfNewEntrantsRating = [];
  threatOfSubstitutesRating = [];

  modulesData = [{
    bargainingPowerOfBuyersRating: 0,
    bargainingPowerOfSuppliersRating: 0,
    name: '',
    segmentRivalryRating: 0,
    threatOfNewEntrantsRating: 0,
    threatOfSubstitutesRating: 0
  }];

  result: any;
  impact: any;

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('porters') porters: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  substitutes: string;
  buyers: string;
  segments: string;
  suppliers: string;
  threats: string;
  analyzeData: any;
  permissions: any;
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

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if(currentReport.overlaps){
      this.overlaps = currentReport.overlaps;

      let interConnect = this.overlaps.filter(e => e.section_name == 'Porters')

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
      this.spinner.hide();
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'porter') {
          this.getPortersDataSuccess(d.meta);
          if (d.content) {
            this.conclusion = d.content[0].data.content;
          }
        }
      });
    }
    this.spinner.hide();
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'Porter\'s 5 Forces, ' + this.reportName + ' [' + this.startYear + '-' + this.endYear + ']';
      this.downloadLink.nativeElement.click();
    });
  }

  generatePortersImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.porters.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      // this.downloadLink.nativeElement.download = 'porters.png';
      this.downloadLink.nativeElement.download = 'Porter\'s 5 Forces, ' + this.reportName + ' [' + this.startYear + '-' + this.endYear + ']';
      this.downloadLink.nativeElement.click();
    });
  }

  constructor(private chartService: RadarChartService,
              private portersApiService: PortersApiService,
              private routes: Router,
              private authService: AuthService,
              public dialog: MatDialog,
              private reportService: ReportService,
              private reportSectionService: ReportSectionService,
              private spinner: NgxSpinnerService,
              private localStorageService: LocalStorageService,
              private sharedAnalyticsService: SharedAnalyticsService,
              public activateRoutes: ActivatedRoute
  ) {
    this.permissions = this.authService.getUserPermissions();
    this.spinner.show();
  }

  ngOnInit() {
    this.getReportDetails();
  }

  analyze() {
    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: 'Porter\'s 5',
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  getPortersDataSuccess(data) {
    if (data && data.data) {
      this.result = data.data;
      if (data.impact) {
        this.impact = data.impact
      }
      this.result.filter(item => {
        if (item.rating != 0) {
          if (item.type == 'Threat of New Entrants') {
            this.threatOfNewEntrantsRating.push(item);
          } else if (item.type == 'Bargaining Power of Suppliers') {
            this.bargainingPowerOfSuppliersRating.push(item);
          } else if (item.type == 'Threat of Substitutes') {
            this.threatOfSubstitutesRating.push(item);
          } else if (item.type == 'Bargaining Power of Buyers') {
            this.bargainingPowerOfBuyersRating.push(item);
          } else if (item.type == 'Segment Rivalry') {
            this.segmentRivalryRating.push(item);
          }
        }
      });
      if (this.impact && this.impact.length) {
        this.impact.forEach(element => {
          if (element.name == 'Threat of New Entrants') {
            this.threats = element.impact;
            this.modulesData[0].threatOfNewEntrantsRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Bargaining Power of Suppliers') {
            this.suppliers = element.impact;
            this.modulesData[0].bargainingPowerOfSuppliersRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Threat of Substitutes') {
            this.substitutes = element.impact;
            this.modulesData[0].threatOfSubstitutesRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Bargaining Power of Buyers') {
            this.buyers = element.impact;
            this.modulesData[0].bargainingPowerOfBuyersRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Segment Rivalry') {
            this.segments = element.impact;
            this.modulesData[0].segmentRivalryRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          }
        });
      } else {
        let threatOfNewEntrantsRatingSum = 0;
        this.threatOfNewEntrantsRating.forEach((e) => {
          threatOfNewEntrantsRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].threatOfNewEntrantsRating = threatOfNewEntrantsRatingSum / this.threatOfNewEntrantsRating.length;

        let bargainingPowerOfSuppliersRatingSum = 0;
        this.bargainingPowerOfSuppliersRating.forEach((e) => {
          bargainingPowerOfSuppliersRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].bargainingPowerOfSuppliersRating = bargainingPowerOfSuppliersRatingSum / this.bargainingPowerOfSuppliersRating.length;

        let bargainingPowerOfBuyersRatingSum = 0;
        this.bargainingPowerOfBuyersRating.forEach((e) => {
          bargainingPowerOfBuyersRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].bargainingPowerOfBuyersRating = bargainingPowerOfBuyersRatingSum / this.bargainingPowerOfBuyersRating.length;

        let threatOfSubstitutesRatingSum = 0;
        this.threatOfSubstitutesRating.forEach((e) => {
          threatOfSubstitutesRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].threatOfSubstitutesRating = threatOfSubstitutesRatingSum / this.threatOfSubstitutesRating.length;

        let segmentRivalryRatingSum = 0;
        this.segmentRivalryRating.forEach((e) => {
          segmentRivalryRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].segmentRivalryRating = segmentRivalryRatingSum / this.segmentRivalryRating.length;

        this.threats = (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating <= 10) ?
          (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating < 8) ? 'medium' : 'high' : 'low';

        this.suppliers = (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating <= 10) ?
          (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating < 8) ? 'medium' : 'high' : 'low';

        this.segments = (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating <= 10) ?
          (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating < 8) ? 'medium' : 'high' : 'low';

        this.buyers = (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating <= 10) ?
          (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating < 8) ? 'medium' : 'high' : 'low';

        this.substitutes = (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating <= 10) ?
          (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating < 8) ? 'medium' : 'high' : 'low';
      }

      this.modulesData[0].name = this.reportName;

      this.portersModules = this.modulesData;
      this.htmlElement = this.element.nativeElement;
      this.chartService.setup(this.htmlElement);
      this.chartService.populate(this.portersModules);
    }
  }

  openDroctDialog() {
    const dialogRef = this.dialog.open(PortersRadarOutputDialogComponent, {
      width: '99%',
      data: this.modulesData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPortersDiagramDialog() {
    const dialogRef = this.dialog.open(Porters5DiagramComponent, {
      width: '99%',
      data: '',
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
