import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  barChartLegend,
  barChartOptions,
  barChartPlugins,
  barChartType,
  getChartOptions
} from '../../../components/core/bar-chart-input/bar-chart-configs';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import { ConstantKeys } from '../../../constants/mfr.constants';
import { LocalStorageService } from '../../../services/localstorage.service';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-output-company-bar-dialog',
  templateUrl: './output-company-bar-dialog.component.html',
  styleUrls: ['./output-company-bar-dialog.component.scss']
})
export class OutputCompanyBarDialogComponent implements OnInit {

  chartOptions = barChartOptions;
  chartType = barChartType;
  chartLegend = barChartLegend;
  chartPlugins = barChartPlugins;
  dataStore: any = [];
  permissions: any;
  labelX: any;
  colMetaData: any[];
  rowNames: (string[] | any[] | any)[];
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  render = false;
  labelY: any;
  currentReport: any;

  analyzeData:any;
  reportId = "";

  @ViewChild('screen') screenPie: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  currentCompany: any;

  constructor(
    public dialogRef: MatDialogRef<OutputCompanyBarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private excelDownloadService: ExcelDownloadService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router
  ) {
  }

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportId = this.currentReport._id;
    this.currentCompany = this.data.cpName;
    this.renderBarChart(this.data.data);
    window.scroll(0,0)
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "Financial overview",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  renderBarChart(data) {
    this.dataStore = JSON.parse(data.content);
    const temp = this.dataStore.data.dataStore;
    const pullYearData = _.pull(_.keys(temp[0]), 'rowHeader', 'content');
    const finalChartData = [];
    pullYearData.forEach(item => {
      const obj = { rowHeader: item };
      temp.forEach(t => {
        obj[t.rowHeader] = t[item];
      });
      finalChartData.push(obj);
    });
    this.labelX = data.name;
    const mainHeader = this.labelX + '/years';
    this.colMetaData = [];

    const colsTypeName = _.keys(finalChartData[0]);
    this.rowNames = finalChartData.map(ele => ele.rowHeader);
    this.colMetaData.push({ header: mainHeader, name: 'rowHeader', type: 'text' });
    for (let element of colsTypeName) {
      this.colMetaData.push({
        name: element,
        header: element,
        type: 'number'
      });
      this.labelY = data.currency + '-' + data.metric;
    }
    const colNames = this.colMetaData.map(col => col.name);
    const expectedFormat = colNames.filter(col => col != 'rowHeader').map(col => {
      const valList = finalChartData.map(ele => ele[col]);
      return {
        label: col,
        data: valList
      };
    });
    this.chartLabels = this.rowNames;
    this.chartData = expectedFormat;
    this.chartOptions = getChartOptions(this.labelX, this.labelY);
    this.chartOptions.scales.xAxes[0].stacked = false;
    this.chartOptions.scales.yAxes[0].stacked = false;
    this.render = true;
  }

  generateImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screenPie.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'bar chart.png';
      this.downloadLink.nativeElement.click();
    });
  }

  doClose() {
    this.dialogRef.close();
  }

  downloadExcel() {
    const labels = ["year"]
    this.data.chartData.forEach(d => {
      labels.push(d.label)
    })
    const title = this.data.title
    this.excelDownloadService.generateExcelSheet(labels, this.data.excelData, title,'BAR')
  }
}
