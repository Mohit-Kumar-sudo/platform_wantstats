import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { ReportSectionService } from 'src/app/services/report-section.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import { CommonChartContainerComponent } from '../../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-competitive-secondary-output',
  templateUrl: './competitive-secondary-output.component.html',
  styleUrls: ['./competitive-secondary-output.component.scss']
})
export class CompetitiveSecondaryOutputComponent implements OnInit {

  @Input()
  secondaryOutputModel: SecondaryOutputModel;

  reportData: ReportDataElement[];
  currentReport: any;
openD: any;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private authService: AuthService,
    private reportService: ReportService,
    private reportSectionService: ReportSectionService,
    private localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService
  ) {
  }

  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  permissions: any;
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';

  interConnectData =  {
    'section' : '',
    'data' : []
  }
  reportConnectData = {
    'section' : '',
    'data' : []
  }
  overlaps : any;


  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    window.scroll(0,0)
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT)

    if(this.currentReport.overlaps){
      this.overlaps = this.currentReport.overlaps;

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
  downloadExcel(dataElement) {
    this.excelDownloadService.downloadExcel(dataElement)
  }
}
