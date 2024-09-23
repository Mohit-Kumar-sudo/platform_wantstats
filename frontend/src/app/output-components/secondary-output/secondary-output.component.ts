import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { CommonChartContainerComponent } from '../common-chart-container/common-chart-container.component';
import * as pieConfig from '../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../components/core/bar-chart-input/bar-chart-configs';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-secondary-output',
  templateUrl: './secondary-output.component.html',
  styleUrls: ['./secondary-output.component.scss']
})
export class SecondaryOutputComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService) {
  }

  @Input()
  secondaryOutputModel: SecondaryOutputModel;

  reportData: ReportDataElement[];
  currentReport: any;


  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  openD: any;
  permissions: any;
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

  ngOnInit() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.permissions = this.authService.getUserPermissions();

    if (this.currentReport.overlaps) {
      this.overlaps = this.currentReport.overlaps;

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
    window.scroll(0,0)
  }

  generateImage(data) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    if (data.type === 'PIE') {
      // @ts-ignore
      html2canvas(this.screenPie.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
        this.downloadLink.nativeElement.click();
      });
    } else if (data.type === 'BAR') {
      // @ts-ignore
      html2canvas(this.screenBar.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
        this.downloadLink.nativeElement.click();
      });
    } else if (data.type === 'IMAGE') {
      // @ts-ignore
      html2canvas(this.screenImg.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = data.data.metaDataValue.title;
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

  ngAfterViewInit() {
    // document.querySelector('#scroll').scrollIntoView();
  }

  downloadExcel(dataElement) {
    this.excelDownloadService.downloadExcel(dataElement);
  }
}

