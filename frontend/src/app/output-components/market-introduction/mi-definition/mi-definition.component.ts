import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonChartContainerComponent } from '../../common-chart-container/common-chart-container.component';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportSectionService } from 'src/app/services/report-section.service';
import { ReportService } from 'src/app/services/report.service';
import * as pieConfig from '..//../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import * as _ from 'lodash';

@Component({
  selector: 'app-mi-definition',
  templateUrl: './mi-definition.component.html',
  styleUrls: ['./mi-definition.component.scss']
})
export class MiDefinitionComponent implements OnInit {
  reportData: ReportDataElement[];
  secondaryOutputModel: SecondaryOutputModel;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private reportService: ReportService,
    private authService: AuthService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService
  ) {
  }

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
  permissions: any;

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.spinner.show();
    this.getReportDetails();
  }

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    this.reportService.getSectionKeyDetials(this.reportId, 'MARKET_INTRODUCTION').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
      console.log('error', error);
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
      data: data,
      disableClose: false,
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'definition') {
          this.secondaryOutputModel = {
            mainData : this.reportSectionService.convertToReportDataElement(d.content),
            reportName : this.reportName,
            startYear : this.startYear,
            endYear : this.endYear,
            reportId : this.reportId,
            heading : "Definition, Market Introduction"
          }
        }
        this.emptyList.push(d.section_name);
        this.emptyList = _.uniq(this.emptyList);
      });

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

}
