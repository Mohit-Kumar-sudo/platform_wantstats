import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {CommonChartContainerComponent} from '../../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import {ExcelDownloadService} from 'src/app/services/excel-download.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private reportService: ReportService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService
  ) {
    this.spinner.show();
  }

  reportData: any = [];
  permissions: any;

  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  openD: any;

  driverList = [];
  emptyList = [];
  compareList = ['Drivers', 'Restraints', 'Opportunities', 'Challenges', 'Trends'];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';

  interConnectData = {
    section: '',
    data: []
  };
  reportConnectData = {
    section: '',
    data: []
  };
  overlaps: any;

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;
  keyword: any;

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.getReportDetails();
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if (currentReport.overlaps) {
      this.overlaps = currentReport.overlaps;

      const interConnect = this.overlaps.filter(e => e.section_name == 'Drivers');

      if (interConnect.length) {
        const dt = {
          section: '',
          data: []
        };
        if (interConnect[0].data && interConnect[0].data.length) {
          if (interConnect[0].section_name) {
            dt.section = interConnect[0].section_name;
            for (let i = 0; i < interConnect[0].data.length && i < 2; i++) {
              dt.data.push(interConnect[0].data[i]);
            }
          }
        }

        this.interConnectData = dt;
      }
      const reportConnect = this.overlaps.filter(e => e.section_name == 'Report');

      if (reportConnect.length) {
        const dt = {
          section: '',
          data: []
        };
        if (reportConnect[0].data && reportConnect[0].data.length) {
          if (reportConnect[0].section_name) {
            dt.section = reportConnect[0].section_name;
            for (let i = 0; i < reportConnect[0].data.length && i < 2; i++) {
              dt.data.push(reportConnect[0].data[i]);
            }
          }
        }

        this.reportConnectData = dt;
      }

    }

    this.reportService.getSectionKeyDetials(this.reportId, 'MARKET_DYNAMICS').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
      this.spinner.hide();
    });
  }

  generateImage(data) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    if (data === 'PIE') {
      // @ts-ignore
      html2canvas(this.screenPie.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Pie Chart.png';
        this.downloadLink.nativeElement.click();
      });
    } else if (data === 'BAR') {
      // @ts-ignore
      html2canvas(this.screenBar.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Bar Chart.png';
        this.downloadLink.nativeElement.click();
      });
    } else if (data === 'IMAGE') {
      // @ts-ignore
      html2canvas(this.screenImg.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Image.png';
        this.downloadLink.nativeElement.click();
      });
    }
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'introduction') {
          this.reportData = this.reportSectionService.convertToReportDataElement(d.content);
        }
        this.emptyList.push(d.section_name);
        this.emptyList = _.uniq(this.emptyList);
      });
      const intro = _.find(data, ['meta_info.section_key', 'introduction']);
      if (!(intro && this.reportData.length)) {
        const res = {
          data: `Following is the Market Dynamics Analysis for ${this.reportName} Market`,
          id: 1,
          type: 'TEXT'
        };
        this.reportData.push(res);
      }

      this.emptyList = _.remove(this.emptyList, (n) => {
        return n !== 'MARKET DYNAMICS';
      });

      this.compareList.forEach((key) => {
        let found = false;
        this.emptyList = this.emptyList.filter((item) => {
          if (!found && item == key) {
            this.driverList.push(item);
            found = true;
            return false;
          } else {
            return true;
          }
        });
      });
    } else {
      this.routes.navigate(['']);
    }
    this.spinner.hide();
  }


  downloadExcel(dataElement) {
    this.excelDownloadService.downloadExcel(dataElement);
  }
}
