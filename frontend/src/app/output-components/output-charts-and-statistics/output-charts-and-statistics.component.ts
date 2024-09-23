import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadService } from 'src/app/services/download.service';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { MarketEstimationService } from 'src/app/services/market-estimation.service';
import { OutputResultsService } from 'src/app/services/output-result.service';
import { ReportSectionService } from 'src/app/services/report-section.service';
import { ReportService } from 'src/app/services/report.service';
import * as barConfig from '../../components/core/bar-chart-input/bar-chart-configs';
import * as pieConfig from '../../components/core/pie-chart-input/pie-chart-configs';
import * as spieConfig from '../../components/core/pie-chart-input/small-piechart.config';
import * as sbarConfig from '../../components/core/bar-chart-input/small-barchart.config';
import * as _ from 'lodash';
import { CommonChartContainerComponent } from '../common-chart-container/common-chart-container.component';

interface Report {
  excelLink: any;
  docLink: any;
  title: string;
  isPdf: boolean;
  isExcel: boolean;
  isDoc: boolean;
  isAnalytics: boolean;
  _id: string;
}

@Component({
  selector: 'app-output-charts-and-statistics',
  templateUrl: './output-charts-and-statistics.component.html',
  styleUrls: ['./output-charts-and-statistics.component.scss'],
})
export class OutputChartsAndStatisticsComponent implements OnInit {
  searchText: any = '';
  companyId: any = '';
  textData: any;
  searchType: any = '';
  chartTitle: any = '';
  chartId: any = '';
  SimilarReports: Report[] = [];

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  chartsData: any = [];
  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartColors = barConfig.barChartColors;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;

  sbarChartType = sbarConfig.barChartType;
  sbarChartOptions = sbarConfig.barChartOptions;
  sbarChartColors = sbarConfig.barChartColors;
  sbarChartPlugins = sbarConfig.barChartPlugins;
  sbarChartLegend = sbarConfig.barChartLegend;

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  spieChartType = spieConfig.pieChartType;
  spieChartOptions = spieConfig.pieChartOptions;
  spieChartPlugins = spieConfig.pieChartPlugins;
  spieChartColors = spieConfig.pieChartColors;
  spieChartLegend = spieConfig.pieChartLegend;
  permissions: any;

  pieData: any;
  metric: any;
  dataStore: any = [];
  currentReport: any;
  pieChartData: string;
  dataForBarChart: any = [];
  barData: any;
  searchResults: any;
  finalList: any = [];
  suggestionsCharts: any = [];
  reportId: any;
  currentList: any;
  searchTerm: any;
  error: boolean = false;
  isSubscribed: any;
  subscriptionMessage: any;
  searchingTitle:any

  constructor(
    public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private outputResultsService: OutputResultsService,
    private reportSectionService: ReportSectionService,
    private excelDownloadService: ExcelDownloadService,
    private downloadService: DownloadService,
    private authService: AuthService,
    private reportService: ReportService,
    private meService: MarketEstimationService
  ) {}

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    const results = this.localStorageService.get(
      ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA
    );
    console.log("results",results)

    this.searchingTitle = results.title
    this.currentList = this.localStorageService.get(
      ConstantKeys.CURRENT_OP_CHART_AND_STASTISTICS_LIST
    );
    // console.log("this.currentList",this.currentList)
    if (results.reportId) {
      this.meService.getMeData(results.reportId).subscribe((data) => {
        if (data && data.data && data.data.length) {
          if (data.data[0].me.data == null) {
            this.error = true;
            return;
          }
          // console.log("data.data",data.data)
          this.barChartOptions = barConfig.getChartOptions(
            'Year',
            'USD ' + data.data[0].me.data[0].metric
          );
          this.sbarChartOptions = barConfig.getChartOptions(
            'Year',
            'USD ' + data.data[0].me.data[0].metric
          );
          this.barChartOptions.scales.xAxes[0].stacked = false;
          this.barChartOptions.scales.yAxes[0].stacked = false;
          this.getResult(results, null, data.data[0].me);
          this.getRandomRecords();
        }
      });
    }
    if (
      results.key != 'MARKET_BY_REGION' &&
      results.key != 'MARKET_BY_SEGMENT'
    ) {
      this.chartsData = this.reportSectionService.convertToReportDataElement([
        results.toc.content,
      ])[0];
      this.getRandomRecords();
    }
    this.getSimilarReport();
  }

  changeChart(chart) {
    this.chartsData = chart;
    this.getRandomRecords();
  }

  openDialog() {
    // console.log("this.chartsData",this.chartsData)
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      height: '80%',
      data: this.chartsData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  searchTablesChartsImages() {
    window.scroll(0,0)
    this.outputResultsService
      .searchTablesChartsImagesByStr(this.searchType, this.searchText)
      .subscribe((data) => {
        if (data) {
          const result = _.find(data.data, [
            'toc.content.data.title',
            this.chartTitle,
          ]);
          if (result) {
            this.chartsData =
              this.reportSectionService.convertToReportDataElement([
                result.toc.content,
              ]);
            this.chartsData = this.chartsData[0];
            console.log("this.chartsData",this.chartsData)
          }
          this.spinner.hide();
        }
      });
  }

  createTableData(dataStore) {
    let data = [];
    dataStore.forEach((item) => {
      data.push(Object.values(item));
    });
    // console.log("data",data)
    return data;
  }

  generateImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    this.downloadService.downloadImage(
      this.chartsData,
      this.canvas,
      this.downloadLink.nativeElement,
      this.screen.nativeElement
    );
  }

  downLoadCSV() {
    this.excelDownloadService.downloadExcel(this.chartsData);
  }

  generatePieData(data, matchValue, results, suggested, years) {
    this.dataStore = [];
    if (data.data && data.data.length) {
      data.data.forEach((e, i) => {
        this.metric = e.metric;
        if (i == 0)
          //parent segment text
          this.textData = e.text;
        if (
          (e.title && e.title == matchValue) ||
          (e.title && e.title.includes(matchValue))
        ) {
          this.textData = e.text;
          this.pieData = {
            title: `${results.title} - (USD ${e.metric ? e.metric : 'Mn'})`,
            source: 'Wantstats',
            calType: 'BY_VALUE',
            columns: [],
          };
          let rowHeaderkey = '';
          if (results.key === 'MARKET_BY_SEGMENT') {
            e.rowHeaders.forEach((element) => {
              if (element.includes('parent')) {
                rowHeaderkey = element;
              }
            });
          } else if (results.key === 'MARKET_BY_REGION') {
            e.rowHeaders.forEach((element) => {
              if (!element.includes('%')) {
                if (!parseInt(element)) {
                  rowHeaderkey = element;
                }
              }
            });
          }
          e.value.forEach((e) => {
            let data;
            if (years != null) {
              data = {
                header: _.startCase(e[rowHeaderkey]).split('_').join(' '),
                value: e[years.base_year],
              };
            }
            let obj = Object.assign({}, e);
            let arr = Object.keys(obj);
            arr = arr.filter((e) => e.includes('%'));
            arr.forEach((e) => {
              delete obj[e];
            });
            delete Object.assign(obj, { ['rowHeader']: obj[rowHeaderkey] })[
              rowHeaderkey
            ];
            if (obj['rowHeader'] != 'Total') {
              if (results.type === 'PIE') {
                this.pieData.columns.push(data);
              } else if (results.type === 'BAR') {
                this.dataStore.push(obj);
              }
            }
          });
          if (results.type === 'PIE') {
            this.pieChartData = JSON.stringify(this.pieData);
            const data = this.reportSectionService.convertToReportDataElement([
              {
                data: this.pieChartData,
                order_id: 1,
                type: 'PIE',
              },
            ]);
            data[0].text = this.textData;
            if (suggested === null) {
              this.chartsData = data[0];
            } else if (suggested) {
              this.suggestionsCharts.push(data[0]);
            }
          } else if (results.type === 'BAR') {
            this.generateBarData(results, suggested);
          }
        }
      });
    }
  }

  generateBarData(results, suggested) {
    // console.log("results",results)
    let colMetaData = [];
    let allHeaders = [];
    if (this.dataStore) {
      // console.log("this.dataStore",this.dataStore)
      let allKeys = Object.keys(this.dataStore[0]);
      colMetaData.push({
        header: results.title + ' Market',
        name: 'rowHeader',
        type: 'text',
      });
      for (let element of allKeys) {
        colMetaData.push({
          name: element,
          header: element,
          type: 'number',
        });
      }

      this.dataForBarChart = [];
      this.dataStore.forEach((e) =>
        allHeaders.push(_.startCase(e['rowHeader']).split('_').join(' '))
      );
      // console.log("allHeaders",allHeaders)
      allKeys = allKeys.filter((e) => e !== 'rowHeader');
      allKeys.forEach((e) => {
        let obj = {};
        for (let i = 0; i < allHeaders.length; i++) {
          obj[allHeaders[i]] = this.dataStore[i][e];
        }
        obj['rowHeader'] = e;
        this.dataForBarChart.push(obj);
      });

      this.barData = {
        title: `${results.title} - (USD ${this.metric ? this.metric : 'Mn'})`,
        source: 'Wantstats',
        columnMetaData: colMetaData,
        dataStore: this.dataForBarChart,
        labelY: 'USD ' + this.metric + '',
      };
    }
    let dataContents = {
      data: JSON.stringify(this.barData),
      order_id: 2,
      type: 'BAR',
      text: this.textData,
    };
    if (suggested === null) {
      this.chartsData =
        this.reportSectionService.convertToBarChartFormat(dataContents);
    } else if (suggested) {
      this.suggestionsCharts.push(
        this.reportSectionService.convertToBarChartFormat(dataContents)
      );
    }
  }

  getResult(results, suggested, years) {
    // console.log("results",results)
    // console.log("suggested",suggested)
    // console.log('years',years)
    this.spinner.show();
    if (
      results.key === 'MARKET_BY_REGION' ||
      results.key === 'MARKET_BY_SEGMENT'
    ) {
      let title = results.title.split(']');
      let includeVal = title[1].toUpperCase().trim();
      if (results.type === 'PIE') {
        if (results.key === 'MARKET_BY_SEGMENT') {
          includeVal = 'BY SUB-SEGMENTS';
        } else if (results.key === 'MARKET_BY_REGION') {
          includeVal = 'BY COUNTRIES';
        }
      } else if (results.type === 'BAR') {
        if (
          results.title.includes('by Type') ||
          results.title.includes('by Application') ||
          results.title.includes('by Brand')
        ) {
          includeVal = title[1].toUpperCase().trim();
        } else {
          if (results.key === 'MARKET_BY_SEGMENT') {
            includeVal = 'BY SUB-SEGMENTS';
          } else if (results.key === 'MARKET_BY_REGION') {
            includeVal = 'BY COUNTRIES';
          }
        }
      }
      this.meService
        .getDataSegOrReg(results.reportId, results.id, results.key)
        .subscribe((d) => {
          if (d) {
            this.spinner.hide();
            this.generatePieData(d, includeVal, results, suggested, years);
          }
        });
    }
  }

  getRandomRecords() {
    this.textData = '';
    this.suggestionsCharts = [];
    this.finalList = [];
    if (this.currentList && this.currentList.length) {
      // console.log("this.currentList",this.currentList)
      if (this.currentList.length > 5) {
        for (let i = 0; i < 5; i++) {
          this.finalList.push(
            this.currentList[this.getRandomTitles(this.currentList.length)]
          );
        }
      } else {
        this.finalList = this.currentList;
      }
      if (this.finalList.length) {
        let data = [];
        if (this.finalList.length > 4) {
          data = _.compact(
            _.map(this.finalList, `titles[${this.getRandomTitles(5)}]`)
          );
        } else {
          for (let i = 0; i < 5; i++) {
            data.push(
              this.finalList[0].titles[
                this.getRandomTitles(this.finalList[0].titles.length)
              ]
            );
          }
        }
        data.forEach((d) => {
          if (
            d.key != 'MARKET_BY_REGION' &&
            d.key != 'MARKET_BY_SEGMENT' &&
            d
          ) {
            this.suggestionsCharts.push(
              this.reportSectionService.convertToReportDataElement([
                d.toc.content,
              ])[0]
            );
          } else if (d) {
            // console.log("getResult");
            if (d.type != 'PIE') this.getResult(d, 1, null);
            else {
              this.meService.getMeData(d.reportId).subscribe((data) => {
                if (data.data[0]) this.getResult(d, 1, data.data[0].me);
              });
            }
          }
        });
      }
    }
  }

  getRandomTitles(length) {
    return Math.floor(Math.random() * (length - 1));
  }

  getSimilarReport() {
    this.searchText = this.searchingTitle;
    const keywords = this.searchText.split(' ');
    const extractedKeywords = keywords[1] + ' ' + keywords[2];
    this.reportService.getSearchReportsByName(extractedKeywords).subscribe(
      (data) => {
        if (data && data[`data`]) {
          // console.log("similar data",data)
          this.SimilarReports = data.data.filter(report => report.approved);

          // this.SimilarReports.forEach(item => {
          //   if(!item.title.toLowerCase().includes('market')) {
          //     item.title = item.title + ' Market';
          //   }
          // });
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
