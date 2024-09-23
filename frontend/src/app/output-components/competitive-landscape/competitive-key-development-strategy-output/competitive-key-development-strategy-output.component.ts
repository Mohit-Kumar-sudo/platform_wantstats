import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {CommonChartContainerComponent} from '../../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import {NgxSpinnerService} from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-competitive-key-development-strategy-output',
  templateUrl: './competitive-key-development-strategy-output.component.html',
  styleUrls: ['./competitive-key-development-strategy-output.component.scss']
})
export class CompetitiveKeyDevelopmentStrategyOutputComponent implements OnInit {
  reportData: ReportDataElement[];
  secondaryOutputModel: SecondaryOutputModel;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private authService: AuthService,
    private reportService: ReportService,
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

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.spinner.show();
    this.getAPIData();
  }

  getAPIData() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    this.reportService.getSectionKeyDetials(this.reportId, 'COMPETITIVE_LANDSCAPE').subscribe(d => {
      this.getReportDetailsSuccess(d);
     window.scroll(0,0)
    }, error => {
      this.spinner.show();
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
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'devAndGrowthStrategies') {
          this.secondaryOutputModel = {
            mainData : this.reportSectionService.convertToReportDataElement(d.content),
            reportName : this.reportName,
            startYear : this.startYear,
            endYear : this.endYear,
            reportId : this.reportId,
            heading : "Key Developments And Growth Strategies"
          }
        }
      });
    }
    this.spinner.hide();
  }
}
