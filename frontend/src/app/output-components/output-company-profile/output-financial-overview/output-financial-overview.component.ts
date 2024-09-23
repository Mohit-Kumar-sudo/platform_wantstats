import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../../services/localstorage.service';
import {ConstantKeys} from '../../../constants/mfr.constants';
import {companyProfileService} from '../../../services/companyprofile.service';
import * as _ from 'lodash';
import {
  barChartLegend,
  barChartOptions,
  barChartPlugins,
  barChartType,
  getChartOptions
} from '../../../components/core/bar-chart-input/bar-chart-configs';
import {Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';
import * as html2canvas from 'html2canvas';
import {MatDialog} from '@angular/material/dialog';
import {OutputCompanyBarDialogComponent} from '../output-company-bar-dialog/output-company-bar-dialog.component';
import {ExcelDownloadService} from 'src/app/services/excel-download.service';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {Router, ActivatedRoute} from '@angular/router';
import {PptService} from '../../../services/ppt.service';
import {AuthService} from '../../../services/auth.service';
@Component({
  selector: 'app-output-financial-overview',
  templateUrl: './output-financial-overview.component.html',
  styleUrls: ['./output-financial-overview.component.scss']
})
export class OutputFinancialOverviewComponent implements OnInit {

  currentReport: any;
  currentCompany: any;
  bySBU: any = [];
  contentList = [];
  chartOptions = barChartOptions;
  chartType = barChartType;
  chartLegend = barChartLegend;
  chartPlugins = barChartPlugins;
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  labelX: any;
  labelY: any;
  colMetaData: any[];
  render = false;
  byVertical: any = [];
  byRegion: any = [];
  rowNames: any = [];
  dataStore: any = [];
  textData: any = [];
  dialogData: any = [];
  byTypes: any;
  analyzeData: any;
  reportId = '';
  @ViewChild('screen') screenPie: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  selectData: any;
  execelData: any[];
  cmpId: any;
  permissions: any;

  constructor(
    private localStorageService: LocalStorageService,
    private companyProfileService: companyProfileService,
    private dialog: MatDialog,
    private authService: AuthService,
    private pptService: PptService,
    private excelDownloadService: ExcelDownloadService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private paramRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    // this.spinner.show();
    this.paramRoute.queryParams.subscribe(params => {
      this.cmpId = params['segmentId'];
      this.getReportDetails();
    });
  }

  downloadPpt(d) {
    const data = {
      type: 'BAR' +
        '',
      data: {
        chartData: d,
        chartLabels: this.chartLabels,
        metaDataValue: {title: this.currentCompany.company_name + ', Financial Overview, ' + this.selectData}
      }
    };
    this.pptService.downloadPPT(data);
  }

  analyze() {
    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: 'Financial overview',
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  getReportDetails() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    // this.currentCompany = this.localStorageService.get('OUTPUT_CP');
    this.reportId = this.currentReport._id;
    this.companyProfileService.getCompanyAllDetails(this.cmpId, 'financial_overview,company_name').subscribe(d => {
      if (d) {
        this.generateData(d);
        this.currentCompany = d;
        window.scroll(0,0)
      }
      // this.spinner.hide();
    });
  }

  generateData(d) {
    if (d && d.financial_overview.length) {
      this.contentList = [];
      d.financial_overview.forEach(data => {
          if (data.content && JSON.parse(data.content).data && JSON.parse(data.content).data.dataStore
            && JSON.parse(data.content).data.dataStore.length) {
            if (data.key === 'SBU') {
              this.contentList.push('By SBU');
              this.bySBU = data;
            } else if (data.key === 'VERTICAL') {
              this.contentList.push('By vertical');
              this.byVertical = data;
            } else if (data.key === 'REGIONAL') {
              this.contentList.push(('By region'));
              this.byRegion = data;
            }
          }
        }
      );
      this.selectData = this.contentList[0];
      this.onElementSelect(this.selectData);
    }
  }

  renderBarChart(data) {
    this.dataStore = JSON.parse(data.content);
    const temp = this.dataStore.data.dataStore;
    const pullYearData = _.pull(_.keys(temp[0]), 'rowHeader', 'content');
    const finalChartData = [];
    pullYearData.forEach(item => {
      const obj = {rowHeader: item};
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
    this.colMetaData.push({header: mainHeader, name: 'rowHeader', type: 'text'});
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

    this.execelData = finalChartData;
  }

  downloadExcel() {
    const labels = ['year'];
    this.chartData.forEach(d => {
      labels.push(d.label);
    });
    const title = `${this.currentCompany.company_name}_${this.selectData}`;
    this.excelDownloadService.generateExcelSheet(labels, this.execelData, title, null);
  }

  onElementSelect(data) {
    this.selectData = data;
    if (this.selectData === 'By SBU') {
      this.renderBarChart(this.bySBU);
      this.textData = [];
      this.textData = this.dataStore.data.dataStore;
      this.dialogData = this.bySBU;
    } else if (this.selectData === 'By vertical') {
      this.renderBarChart(this.byVertical);
      this.textData = [];
      this.textData = this.dataStore.data.dataStore;
      this.dialogData = this.byVertical;
    } else if (this.selectData === 'By region') {
      this.renderBarChart(this.byRegion);
      this.textData = [];
      this.textData = this.dataStore.data.dataStore;
      this.dialogData = this.byRegion;
    }
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

  openDialog() {
    let object = {
      data: this.dialogData,
      chartData: this.chartData,
      excelData: this.execelData,
      cpName: this.currentCompany.company_name,
      type: this.selectData,
      title: `${this.currentCompany.company_name}_${this.selectData}`
    };
    const dialogRef = this.dialog.open(OutputCompanyBarDialogComponent, {
      width: '99%',
      data: object,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

