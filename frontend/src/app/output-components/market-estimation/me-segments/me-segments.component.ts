import {Component, OnInit, ViewEncapsulation, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import {ReportSectionService} from 'src/app/services/report-section.service';
import * as html2canvas from 'html2canvas';
import {TableInputColumnMetaData} from 'src/app/components/core/table-input/table-input.component';
import {Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';
import * as _ from 'lodash';
import {MeDialogComponent} from '../me-dialog/me-dialog.component';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {ExcelDownloadService} from 'src/app/services/excel-download.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PptService} from '../../../services/ppt.service';
import {WhatsappService} from '../../../services/whatsapp.service';
import {ToastrService} from 'ngx-toastr';
import {SegmentService} from 'src/app/services/segment.service';
import {AuthService} from '../../../services/auth.service';
import {MarketEstimationService} from 'src/app/services/market-estimation.service';


@Component({
  selector: 'app-me-segments',
  templateUrl: './me-segments.component.html',
  styleUrls: ['./me-segments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MeSegmentsComponent implements OnInit {
  reportData: ReportDataElement[];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';
  allSegments = [];
  base_year = '';
  start_year = '';
  end_year = '';
  pieData: any;
  pieChartData = '';
  barData: any;
  barChartJson = [];
  textData: any;
  textDataJson = [];
  tableData: any;
  tableDataJson = [];
  allKeys = [];
  reportDataArray = [];
  dataForBarChart: any;
  selectedSegment = '';
  labelX = '';
  metric = '';
  chart_title = [];
  title = '';
  pieChartJson = [];


  colMetaData: TableInputColumnMetaData[] = [];
  dataStore: any[] = [];
  dataForTable: any[] = [];

  analyzeData: any;
  analyzeDataArray = [];
  tabSelected: any;
  subSegmentSelected: any;
  paramsSegmentId: any;
  openD: any;
  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;

  chartOptions = barConfig.barChartOptions;
  chartType = barConfig.barChartType;
  chartLegend = barConfig.barChartLegend;
  chartPlugins = barConfig.barChartPlugins;

  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  renderBar = false;
  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  segmentData: any;
  permissions: any;

  keyword: any;

  interConnectData = {
    'section': '',
    'data': []
  };
  reportConnectData = {
    'section': '',
    'data': []
  };
  overlaps: any;
  bifurcationLevel = 1;
  segments: any;

  ngOnInit() {
    this.spinner.show();
    const qp = this.activatedRoutes.snapshot.queryParams;
    if (qp['phone']) {
      this.localStorageService.set('CURRENT_USER_PHONE', qp['phone']);
    }
    if (qp && qp['segmentId']) {
      this.paramsSegmentId = qp['segmentId'];
    }
    this.activatedRoutes.queryParams.subscribe(params => {
      if (params && params['segmentId']) {
        this.spinner.show();
        const segment = _.find(this.allSegments, ['id', params['segmentId']]);
        if (segment) {
          this.onSegementSelected(segment.id, segment.name);
        }
      }
     window.scroll(0,0)
    });
    this.dataStore = [];
    this.dataForTable = [];
    this.colMetaData = [];
    this.getReportDetails();
  }


  constructor(private routes: Router,
              public dialog: MatDialog,
              public activatedRoutes: ActivatedRoute,
              private MarketEstimationService: MarketEstimationService,
              private spinner: NgxSpinnerService,
              private pptService: PptService,
              private whatsappService: WhatsappService,
              private toastr: ToastrService,
              private localStorageService: LocalStorageService,
              private reportSectionService: ReportSectionService,
              private authService: AuthService,
              private SharedAnalyticsService: SharedAnalyticsService,
              private excelDownloadService: ExcelDownloadService,
              private segmentService: SegmentService) {
    this.permissions = this.authService.getUserPermissions();
  }

  downloadPpt(data) {
    this.pptService.downloadPPT(data);
  }

  addSlideToPPT(data) {
    this.pptService.addSlideToPPT(data);
  }

  sendChartToWhatsApp() {
    if (!this.permissions.excelExport) {
      return this.authService.showNotSubscribedMsg();
    }
    this.spinner.show();
    const phone = this.localStorageService.get('CURRENT_USER_PHONE');
    this.whatsappService.sendWhatsAppMessage(phone).subscribe(d => {
      this.spinner.hide();
      this.toastr.success('Chart sent to WhatsApp successfully', 'Message');
    });
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    if (currentReport.overlaps) {
      this.overlaps = currentReport.overlaps;

      let interConnect = this.overlaps.filter(e => e.section_name == 'Drivers');

      if (interConnect.length) {
        let dt = {
          'section': '',
          'data': []
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
      let reportConnect = this.overlaps.filter(e => e.section_name == 'Report');

      if (reportConnect.length) {
        let dt = {
          'section': '',
          'data': []
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

    this.MarketEstimationService.getMeData(this.reportId).subscribe(d => {
      console.log('d', d  )
      if (d && d.data && d.data.length) {
        this.getReportDetailsSuccess(d);
        this.segments = d.data[0].me.segment;
      }
     window.scroll(0,0)
    }, error => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.data && data.data.length) {
      if (data.data[0].me && data.data[0].me.segment && data.data[0].me.segment.length > 0) {
        data.data[0].me.segment.forEach(element => {
          if (element.pid == '1') {
            this.allSegments.push(element);
          }
        });
      }
      this.base_year = data.data[0].me.base_year;
      this.start_year = data.data[0].me.start_year;
      this.end_year = data.data[0].me.end_year;
      this.bifurcationLevel = data.data[0].me.bifurcationLevel;
    }
    if (this.paramsSegmentId) {
      const segment = _.find(this.allSegments, ['id', this.paramsSegmentId]);
      if (segment) {
        this.onSegementSelected(segment.id, segment.name);
      }
    }
    this.spinner.hide();
  }

  onSegementSelected(segmentId, segmentName) {
    this.spinner.show();
    this.selectedSegment = segmentName;
    this.segmentService.getDataBySegment(this.reportId, segmentId).subscribe(d => {
      if (d && d.data) {
        this.getSegmentDataSuccess(d);
      }
      window.scroll(0,0)
    }, error => {
    });
  }

  getSegmentDataSuccess(data: any) {
    if (data) {
      this.segmentData = data;
    }
    this.reportDataArray = [];
    this.barChartJson = [];
    this.textDataJson = [];
    this.tableDataJson = [];
    this.pieChartJson = [];
    if (data.data && typeof data.data == 'object' && data.data.length) {
      let baseData;
      this.chart_title = [];
      data.data.forEach(e => {
        let pieMetric = '';
        if (e.metric == 'Kilo Tons') {
          pieMetric = e.metric;
        } else {
          pieMetric = 'USD ' + (e.metric ? e.metric : 'Mn');
        }

        this.pieData = {
          'title': `${this.reportName} Market [${this.base_year}]  ${this.MarketEstimationService.getTitle(e.title, this.segments)} - (${pieMetric})`,
          'source': 'Wantstats',
          'calType': 'BY_VALUE',
          'columns': []
        };
        if (e.title.includes('BY SUB-SEGMENTS')) {
          let baseData = e;
          if (baseData) {

            if (baseData.metric && baseData.metric == 'Kilo Tons') {
              this.metric = baseData.metric;
            } else {
              this.metric = 'USD ' + (baseData.metric ? baseData.metric : 'Mn');
            }
            this.dataStore = [];
            let rowHeaderkey = '';
            baseData.rowHeaders.forEach(element => {
              if (!parseInt(element)) {
                if (!element.includes('%')) {
                  rowHeaderkey = element;
                }
              }
            });
            baseData.value.forEach(e => {
              let val = e[this.base_year];
              if (!isNaN(val)) {
                val = parseFloat(val).toFixed(2);
              }
              let data = {
                'header': e[rowHeaderkey].split('_').join(' '),
                'value': val
              };

              let obj = Object.assign({}, e);
              let arr = Object.keys(obj);
              arr = arr.filter(e => e.includes('%'));

              arr.forEach(e => {
                delete obj[e];
              });

              delete Object.assign(obj, {['rowHeader']: obj[rowHeaderkey]})[rowHeaderkey];

              if (obj['rowHeader'] != 'Total') {
                this.segments.forEach(d => {
                  let replaceTxt;
                  let parentSeg = _.find(this.segments, ['id', d.pid]);
                  if (parentSeg) {
                    replaceTxt = d.name.replace(parentSeg.name, '').replace('_', '');
                  }
                  if (data.header == this.MarketEstimationService.replacedTxtWithSegName(d.name)) {
                    data.header = data.header.replace(data.header, replaceTxt);
                  }
                });
                this.pieData.columns.push(data);
              }

            });
          }
          this.pieChartData = JSON.stringify(this.pieData);
        } else {
          this.pieData.columns = [];
        }

        let baseData = e;

        if (baseData) {
          let textData = baseData.text;
          this.segments.forEach(d => {
            let replaceTxt;
            let trimSeg;
            let parentSeg = _.find(this.segments, ['id', d.pid]);
            if (parentSeg && d.name.includes(parentSeg.name + '_')) {
              trimSeg = parentSeg.name;
              replaceTxt = d.name.replace(parentSeg.name, '').replace('_', '');
            } else {
              replaceTxt = d.name;
            }
            if (textData.toLowerCase().includes(this.MarketEstimationService.replacedTxtWithSegName(d.name.toLowerCase()))) {
              replaceTxt.split(' ').forEach(item => {
                textData = textData.split(this.MarketEstimationService.replacedTxtWithSegName(' ' + item.toLowerCase() + ' ')).join(' ' + item + ' ').split(trimSeg).join('');
                trimSeg = '';
              });
              textData = textData.replace(this.reportName, this.reportName.toLowerCase());
            }
          });
          if (baseData.custom_text) {
            textData = textData + '<br><br>' + baseData.custom_text;
          }

          this.textData = {
            'content': textData
          };

          this.dataStore = [];
          this.dataForTable = [];

          let rowHeaderkey = '';
          if (baseData.value && baseData.value.length) {

            Object.keys(baseData.value[0]).forEach(element => {

              if (element.includes('_') || !parseInt(element)) {
                if (!element.includes('%')) {
                  rowHeaderkey = element;
                }
              }
            });
          }
          if (baseData.value) {
            baseData.value.forEach(e => {

              let data = {
                'header': e[rowHeaderkey],
                'value': e[this.base_year]
              };

              let obj1 = Object.assign({}, e);

              let obj = Object.assign({}, e);
              let arr = Object.keys(obj);
              arr = arr.filter(e => e.includes('%'));

              arr.forEach(e => {
                delete obj[e];
              });

              arr = Object.keys(obj);

              if (!arr.includes('rowHeader')) {
                delete Object.assign(obj, {['rowHeader']: obj[rowHeaderkey]})[rowHeaderkey];
              }

              if (obj['rowHeader'] != 'Total') {
                this.dataStore.push(obj);
              }
              let key1 = Object.keys(obj1);
              key1.forEach(e => {
                if (!isNaN(obj1[e])) {
                  obj1[e] = parseFloat(obj1[e]).toFixed(2);
                }
              });
              this.dataForTable.push(obj1);
            });

            this.colMetaData = [];
            if (this.dataStore.length) {
              let dummyObject: { rowHeader?: string } = {};
              let obj = this.dataStore[0];
              let allKeys = Object.keys(obj);
              this.colMetaData.push({header: this.reportName + ' Market', name: 'rowHeader', type: 'text'});
              for (let element of allKeys) {
                this.colMetaData.push({
                  name: element,
                  header: element,
                  type: 'number'
                });
                dummyObject[element] = '';
              }
            }
          }
        }
        if (baseData && this.dataStore.length) {
          let data = this.dataStore;
          let allKeys = Object.keys(data[0]);
          let allHeaders = [];

          this.dataForBarChart = [];
          data.forEach(e => {
            let splitHeader = e['rowHeader'].split('_').join(' ');

            this.segments.forEach(d => {
              let replaceTxt;
              let parentSeg = _.find(this.segments, ['id', d.pid]);
              if (parentSeg) {
                replaceTxt = d.name.replace(parentSeg.name, '').replace('_', '');
              }
              if (splitHeader == this.MarketEstimationService.replacedTxtWithSegName(d.name)) {
                splitHeader = splitHeader.replace(splitHeader, replaceTxt);
              }
            });
            allHeaders.push(splitHeader);
          });
          allKeys = allKeys.filter(e => e !== 'rowHeader');
          allKeys.forEach(e => {
            let obj = {};
            for (let i = 0; i < allHeaders.length; i++) {
              obj[allHeaders[i]] = data[i][e];
            }
            obj['rowHeader'] = e;
            this.dataForBarChart.push(obj);
          });
        }
        if (e.title && e.title.includes('BY SUB-SEGMENTS')) {
          this.chart_title.push(this.reportName + ' Market [' + this.startYear + '-' + this.endYear + '] ' + this.MarketEstimationService.getTitle(e.title, this.segments));
        } else if (e.title) {
          this.chart_title.push(this.reportName + ' Market [' + this.startYear + '-' + this.endYear + ']' + ', ' + this.MarketEstimationService.getTitle(e.title, this.segments));
        }

        let barTitle = '';
        if (e.title.includes('BY SUB-SEGMENTS')) {
          barTitle = this.reportName + ' Market [' + this.startYear + '-' + this.endYear + '] ' + this.MarketEstimationService.getTitle(e.title, this.segments);
          this.tabSelected = this.selectedSegment;
          this.subSegmentSelected = '';
        } else {
          let title = this.MarketEstimationService.getTitle(e.title, this.segments);
          barTitle = this.reportName + ' Market [' + this.startYear + '-' + this.endYear + ']' + ', ' + title;

          this.title = title;
          let newTitle = this.title.replace(/ by /gi, ' by ');
          let splitTitle = newTitle.split(' by ');
          this.tabSelected = splitTitle[1];
          this.subSegmentSelected = splitTitle[0];
          if (this.tabSelected == 'Regions') {
            this.tabSelected = 'Region';
          }
        }

        this.analyzeData = {
          reportId: this.reportId,
          tabSelected: this.tabSelected,
          subSegmentSelected: this.subSegmentSelected,
        };
        this.analyzeDataArray.push(this.analyzeData);

        let barMetric = '';
        if (e.metric && e.metric == 'Kilo Tons') {
          barMetric = e.metric;
        } else {
          barMetric = 'USD ' + (e.metric ? e.metric : 'Mn');
        }

        this.barData = {
          'title': barTitle,
          'source': 'Wantstats',
          'columnMetaData': this.colMetaData,
          'dataStore': this.dataForBarChart,
          'labelY': barMetric
        };

        this.allKeys = [];

        if (this.dataForTable && this.dataForTable.length) {

          let keys = Object.keys(this.dataForTable[0]);
          keys.forEach(e => {
            if (e.includes('_') || !parseInt(e)) {
              if (!e.includes('%')) {
                this.allKeys.push(e);
              }
            }
          });

          keys.forEach(e => {
            if (!e.includes('_') && parseInt(e)) {
              this.allKeys.push(e);
            } else if (e.includes('CAGR (%) (')) {
              this.allKeys.push(e);
            }
          });
          let tableMetric = '';
          if (e.metric && e.metric == 'Kilo Tons') {
            tableMetric = e.metric;
          } else {
            tableMetric = 'USD ' + (e.metric ? e.metric : 'Mn');
          }

          let tableTitle = '';
          if (e.title && e.title.includes('BY SUB-SEGMENTS')) {
            tableTitle = `${this.reportName} Market [${this.startYear} - ${this.endYear}] ${this.MarketEstimationService.getTitle(e.title, this.segments)} - (${tableMetric})`;
          } else if (e.title) {
            tableTitle = `${this.reportName} Market [${this.startYear} - ${this.endYear}], ${this.MarketEstimationService.getTitle(e.title, this.segments)} - (${tableMetric})`;
          }
          if (tableTitle) {
            this.tableData = {
              'title': tableTitle,
              'source': 'Wantstats',
              'rows': this.allKeys.length,
              'columns': this.allKeys,
              'dataStore': this.dataForTable
            };
          }
          if (this.textData.content) {
            let textData = this.textData.content;
            textData = textData.replace(/%%/g, '%');
            this.textData.content = textData;
          }


          this.pieChartJson.push(this.pieData);
          this.barChartJson.push(JSON.stringify(this.barData));
          this.textDataJson.push(this.textData);
          this.tableDataJson.push(JSON.stringify(this.tableData));
        }

      });

      for (let i = 0; i < this.barChartJson.length; i++) {
        let dataContentArray = [];
        let otherthanPieArray = [
          {
            data: this.barChartJson[i],
            order_id: 2,
            type: 'BAR'
          },
          {
            data: this.tableDataJson[i],
            order_id: 3,
            type: 'TABLE'
          },
          {
            data: this.textDataJson[i],
            order_id: 4,
            type: 'TEXT'
          }
        ];
        if (this.pieChartJson[i].columns.length) {
          dataContentArray.push({
            data: JSON.stringify(this.pieChartJson[i]),
            order_id: 1,
            type: 'PIE'
          });
        }
        otherthanPieArray.forEach(e => {
          dataContentArray.push(e);
        });

        this.reportDataArray.push(this.reportSectionService.convertToReportDataElement(dataContentArray));
      }


      for (let i = 0; i < this.reportDataArray.length; i++) {
        this.reportDataArray[i][0].analyze = this.analyzeDataArray[i];
      }
    }
    this.rederBarChart();
    this.spinner.hide();
  }

  rederBarChart() {
    this.chartOptions.scales.xAxes[0].stacked = false;
    this.chartOptions.scales.yAxes[0].stacked = false;
    this.renderBar = true;
  }

  generateImage(data) {
    if (!this.permissions.excelExport) {
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

  openDialog(data, i) {
    this.SharedAnalyticsService.data = this.analyzeDataArray[i];
    localStorage.setItem(ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA, data);
    // this.localStorageService.set(ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA, data);
    const objects = {
      data,
      'pieData': this.pieData.columns,
      'barData': JSON.parse(this.tableDataJson[i])
    };
    const dialogRef = this.dialog.open(MeDialogComponent, {
      width: '99%',
      data: objects,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  analyze(index) {
    this.SharedAnalyticsService.data = this.analyzeDataArray[index];
    this.routes.navigateByUrl('/dashboard');
  }

  downLoadPieData() {
    const data = {
      type: 'PIE',
      data: {
        metaDataValue: this.pieData
      }
    };
    this.excelDownloadService.downloadExcel(data);
  }

  downLoadTableData(i) {
    let tableData = JSON.parse(this.tableDataJson[i]);
    let headers = _.keys(tableData.dataStore[0]);
    let title = tableData.title;
    let data = tableData.dataStore;
    this.excelDownloadService.generateExcelSheet(headers, data, title, 'BAR');
  }
}
