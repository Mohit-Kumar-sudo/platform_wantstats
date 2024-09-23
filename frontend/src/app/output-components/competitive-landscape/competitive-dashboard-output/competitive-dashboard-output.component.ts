import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  TemplateRef
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import * as html2canvas from 'html2canvas';
import {CompetitiveDashboardServiceApiService} from 'src/app/services/competitive-dashboard-service-api.service';
import {SegmentService} from 'src/app/services/segment.service';
import {CompetitiveDashboardDialogComponent} from '../competitive-dashboard-dialog/competitive-dashboard-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-competitive-dashboard-output',
  templateUrl: './competitive-dashboard-output.component.html',
  styleUrls: ['./competitive-dashboard-output.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompetitiveDashboardOutputComponent implements OnInit {

  rawData: any;
  colspans: any = [];
  allKeys = [];
  data = {
    allHeads: {},
    allData: []
  };
  cnt = 0;

  objectKeys = Object.keys;
  objectValues = Object.values;

  reportData: ReportDataElement[];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';
  sectionId = '';
  mainSectionId = '';

  result: any;

  interConnectData =  {
    'section' : '',
    'data' : []
  }
  reportConnectData = {
    'section' : '',
    'data' : []
  }
  overlaps : any;


  @ViewChild('screen') screen: ElementRef;
  @ViewChild('porters') porters: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  permissions: any;


  ngAfterViewInit() {
    document.querySelector('#scroll').scrollIntoView();
  }

  @ViewChild('container') element: ElementRef;
  htmlElement: HTMLElement;

  constructor(private routes: Router,
              public dialog: MatDialog,
              private reportService: ReportService,
              private spinner: NgxSpinnerService,
              private localStorageService: LocalStorageService,
              private competitiveDashboardServiceApi: CompetitiveDashboardServiceApiService,
              private segmentService: SegmentService,
              private authService: AuthService
  ) {
    this.spinner.show();
  }

  ngOnInit() {
    this.getReportDetails();
    this.permissions = this.authService.getUserPermissions();
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if(currentReport.overlaps){
      this.overlaps = currentReport.overlaps;

      let interConnect = this.overlaps.filter(e => e.section_name == 'Drivers')

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

    this.reportService.getSectionKeyDetials(this.reportId, 'COMPETITIVE_LANDSCAPE').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'dashboard') {
          this.sectionId = d.section_id;
          this.mainSectionId = d.main_section_id;

          if (d.content && d.content.length) {
            if (d.content[0].data && d.content[0].data.content) {
              this.data.allData = d.content[0].data.content;
            }
          }
        }

      });


    } else {
      this.routes.navigate(['']);
    }
    this.getCompetitiveDashboard1();
  }

  getCompetitiveDashboard1() {
    this.competitiveDashboardServiceApi.getCompetitorDashboardColumns(this.reportId, this.sectionId, this.mainSectionId).subscribe(
      data => {
        this.getCompetitiveDashboardSuccess(data);
        window.scroll(0,0)
      },
      error => {
      }
    );
  }

  getCompetitiveDashboardSuccess(data) {
    this.rawData = data;
    let data1 = [];
    if (this.rawData.data[0]) {
      data1 = this.rawData.data[0].me.segment;

      data1.forEach(element => {
        if (element.pid == 1) {
          this.colspans.push(element);
        }
      });

      this.colspans.forEach(element => {
        this.cnt++;
        const name = this.cnt + element.name;
        this.data.allHeads[name] = [];
        data1.forEach(ele => {
          if (ele.pid != 1) {
            if (ele.pid == element.id) {
              this.data.allHeads[name].push(ele.name);
            }
            this.colspans.push(ele);
          }
        });
      });
    }
    this.getFormInfo();
  }

  getFormInfo() {
    this.segmentService.getReportInfoByKey(this.reportId, ConstantKeys.GEO_REGION_GET_KEY).subscribe(
      data => {
        this.getFormInfoSuccess(data);
        window.scroll(0,0)
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getFormInfoSuccess(data) {
    data.me.geo_segment.forEach(element => {
      this.colspans.push(element.region);
      if (element.countries) {
        this.cnt++;
        const name = this.cnt + element.region;
        this.data.allHeads[name] = [];
        element.countries.forEach(x => {
          this.data.allHeads[name].push(x.name);
        });
      }
    });
    this.spinner.hide();
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(document.getElementById('myTable')).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'porters.png';
      this.downloadLink.nativeElement.click();
    });
  }

  checkType(item) {
    return typeof (item) != 'boolean';
  }

  openDialog() {
    const dialogRef = this.dialog.open(CompetitiveDashboardDialogComponent, {
      width: '99%',
      data: this.data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

