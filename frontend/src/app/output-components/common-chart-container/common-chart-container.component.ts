import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import * as pieConfig from '../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../components/core/bar-chart-input/bar-chart-configs';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';

@Component({
  selector: 'app-common-chart-container',
  templateUrl: './common-chart-container.component.html',
  styleUrls: ['./common-chart-container.component.scss']
})
export class CommonChartContainerComponent implements OnInit {

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;
  hide: boolean;
  permissions: any;

  constructor(public dialogRef: MatDialogRef<CommonChartContainerComponent>,
    private excelDownloadService: ExcelDownloadService,
    @Inject(MAT_DIALOG_DATA) public reportData: any,
    private authService: AuthService) {
  }

  openD: any;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  generateImage() {

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

  ngOnInit() {
    if (this.reportData.type === 'IMAGE') {
      this.hide = false;
    } else {
      this.hide = true;
    }
    this.permissions = this.authService.getUserPermissions();
  }

  doClose() {
    this.dialogRef.close();
  }

  downloadExcel() {
    this.excelDownloadService.downloadExcel(this.reportData)
  }
}
