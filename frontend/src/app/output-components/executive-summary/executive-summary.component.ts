import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportSectionService } from 'src/app/services/report-section.service';
import { ReportService } from 'src/app/services/report.service';
import { CommonChartContainerComponent } from '../common-chart-container/common-chart-container.component';
import * as pieConfig from '../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../components/core/bar-chart-input/bar-chart-configs';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';

@Component({
  selector: 'app-executive-summary',
  templateUrl: './executive-summary.component.html',
  styleUrls: ['./executive-summary.component.scss']
})
export class ExecutiveSummaryComponent implements OnInit {

  reportData: ReportDataElement[];
  secondaryOutputModel: SecondaryOutputModel;

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

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;
  permissions: any;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private reportService: ReportService,
    private authService: AuthService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService
  ) {
    this.spinner.show();
  }

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

    this.reportService.getSectionKeyDetials(this.reportId, 'EXECUTIVE_SUMMARY').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
      console.log('error', error);
    });
  }

  generateImage(data) {
    if (this.permissions.imageExport) {
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
    } else {
      this.authService.showNotSubscribedMsg();
    }
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      data: data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length && data[0] && data[0].content) {
      this.secondaryOutputModel = {
        mainData: this.reportSectionService.convertToReportDataElement(data[0].content),
        reportName: this.reportName,
        startYear: this.startYear,
        endYear: this.endYear,
        reportId: this.reportId,
        heading: 'Executive Summary'
      };
      data.forEach(d => {
        if (d.section_name === 'EXECUTIVE SUMMARY') {
          this.secondaryOutputModel = {
            mainData: this.reportSectionService.convertToReportDataElement(d.content),
            reportName: this.reportName,
            startYear: this.startYear,
            endYear: this.endYear,
            reportId: this.reportId,
            heading: 'Executive Summary'
          };
        }

      });
      this.emptyList.push(data[0]);
      this.emptyList = _.uniq(this.emptyList);

      this.emptyList = _.remove(this.emptyList, (n) => {
        return n !== 'MARKET DYNAMICS';
      });

      this.compareList.forEach((key) => {
        let found = false;
        this.emptyList = this.emptyList.filter((item) => {
          // tslint:disable-next-line:triple-equals
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

  OnClickDriver(data) {
    if (data === 'Drivers') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Restraints') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Opportunities') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Challenges') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Trends') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    }
  }

}
