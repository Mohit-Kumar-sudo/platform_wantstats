import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import * as html2canvas from 'html2canvas';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-me-dialog',
  templateUrl: './me-dialog.component.html',
  styleUrls: ['./me-dialog.component.scss']
})
export class MeDialogComponent implements OnInit {

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
  permissions:any;

  constructor(public dialogRef: MatDialogRef<MeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reportData: any,
    private excelDownloadService: ExcelDownloadService,
    private toastr: ToastrService,
    private routes: Router,
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
    this.barChartOptions.scales.xAxes[0].stacked = false;
    this.barChartOptions.scales.yAxes[0].stacked = false;
   window.scroll(0,0)
    this.permissions = this.authService.getUserPermissions();
  }

  doClose() {
    this.dialogRef.close();
    this.reportData = {}
  }

  downLoadPieData() {
    const headers = [''];
    const title = this.reportData.data.data.metaDataValue.title;
    this.excelDownloadService.generateExcelSheet(headers, this.reportData.pieData, title,'PIE')
  }

  downLoadTableData() {
    let tableData = this.reportData.barData
    let headers = _.keys(tableData.dataStore[0]);
    let title = tableData.title;
    let data = tableData.dataStore;
    this.excelDownloadService.generateExcelSheet(headers, data, title,'BAR')
  }

  analyze() {
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }
}
