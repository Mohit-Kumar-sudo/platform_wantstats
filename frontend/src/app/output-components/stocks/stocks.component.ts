import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlphaVantageService } from 'src/app/services/alphvantage.service';
import * as _ from 'lodash';
import * as Chart from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { NewsApiService } from 'src/app/services/news-api.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks: any = [];
  stockKeys: any = [];
  newKeys: any = [];
  newStocks: any = [];
  shortName: any;
  symbolName: any;
  keys: any = [];
  newDyKeys: any = [];
  dailyData: any = [];
  dailyChartData: any = [];
  dailyTime: any = [];
  colorArray: any = [];
  stackedLine: Chart;
  searchText: any;
  searchStockData: any;
  selectStockList: any;
  selectedAll = true;
  contentList = [
    {
      name: 'ALL',
      ticker: 'demo'
    },
    {
      name: 'New York stock exchange (NYSE)',
      ticker: '^NYA'
    }, {
      name: 'London stock exchange (LSE)',
      ticker: '^FTSE'
    }, {
      name: 'Tokyo stock exchange (TSE)',
      ticker: '^N225'
    }, {
      name: 'Shanghai stock exchange (SSE)',
      ticker: '000001.SS'
    }, {
      name: 'Euronext',
      ticker: 'ENX.PA'
    }, {
      name: 'Hong Kong stock exchange (HKEX)',
      ticker: '^HSI'
    }, {
      name: 'Shenzhen stock exchange (SZSE)',
      ticker: '399001.SZ'
    }, {
      name: 'Toronto stock exchange (TSX)',
      ticker: '^GSPTSE'
    }, {
      name: 'Bombay stock exchange (BSE)',
      ticker: '^BSESN'
    }, {
      name: 'Nifty',
      ticker: '^NSEI'
    }
  ]
  currentReport: any;
  newNewsArray: any = [];
  errorMessage: string;
  constructor(
    private activateRoutes: ActivatedRoute,
    private alphaVantageService: AlphaVantageService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private newsApiService: NewsApiService,
    private localStorageService: LocalStorageService,
    private sharedInteconnectService: SharedInteconnectService
  ) { }

  ngOnInit() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.spinner.show();
    window.scrollTo(0,0);
    this.selectStockList = "demo";

    if (this.activateRoutes.queryParams) {
      this.activateRoutes.queryParams.subscribe(p => {
        if (p) {
          this.shortName = p['name'];
          this.symbolName = p['symbol'];
          this.clearData();
          this.clearChartData();
          this.getAlphaVantage(p['symbol']);
          this.getAlphavantageDaily();
        }
      });
    }

    this.alphaVantageService.stockBtn.subscribe(d => {
      this.symbolName = "";
      this.shortName = "";
      this.searchText = "";
      this.clearData();
      this.clearChartData();
    });
  }

  getAlphaVantage(symbol: string) {
    this.alphaVantageService.getStockDetails(symbol).subscribe(
      d => {
        if (d['Error Message']) {
          this.errorMessage = 'No data available, Please choose a different stock'
          this.clearData();
        } else {
          this.stocks = _.reduce(d);
          this.stockKeys = _.keys(this.stocks);
          this.stockKeys.map(d => {
            d = d.replace(/\d+/, '');
            d = d.replace(/\s/g, '');
            d = d.replace(/\./g, '');
            this.newKeys.push(d);
          });
          const stockArray = Object.keys(this.stocks).map(i => this.stocks[i]);
          this.newKeys.map((i, d) => {
            let obj = {};
            obj[i] = stockArray[d];
            this.newStocks.push(obj);
          });
          this.spinner.hide();
          window.scrollTo(0,0);
          // this.errorMessage = null;
        }
      },
      error => {
        console.error('Error occurred in getAlphaVantage:', error);
        this.spinner.hide();
        this.errorMessage = 'No data available, Please choose a different stock';
        this.clearData();
      }
    );
  }

  getAlphavantageDaily() {
    this.alphaVantageService.getStockDailyDetails(this.symbolName).subscribe(
      d => {
        if (d['Error Message']) {
            this.errorMessage = 'No data available for this Intraday stock. Please choose a different stock';
          this.clearChartData();
        } else {
          if (d) {
            this.clearChartData();
            this.dailyData = d['Time Series (1min)'];
            if (d['Time Series (1min)']) {
              this.newDyKeys = Object.keys(d['Time Series (1min)']);
              this.getDailyChartData(this.dailyData, this.newDyKeys);
            }
          }
          window.scrollTo(0,0);
          this.spinner.hide();
          this.errorMessage = null;
        }
      },
      error => {
        console.error('Error occurred in getAlphavantageDaily:', error);
        this.spinner.hide();
          this.errorMessage = 'No data available for this Intraday stock. Please choose a different stock';
        this.clearChartData();
      }
    );
  }

  getDailyChartData(dailyData, keys) {
    keys.forEach(i => {
      this.dailyChartData.push(dailyData[i]['1. open']);
      this.dailyChartData.sort();
      this.dailyTime.push(i.split(" ")[1].split(":00"));
      this.dailyTime.sort();
    });

    this.generateLineChart('myChart', this.dailyTime, this.dailyChartData, 'Day Time');
  }

  getAlphavantageMonthly() {
    this.alphaVantageService.getStockMonthlyDetails(this.symbolName).subscribe(
      d => {
        if (d['Error Message']) {
          this.errorMessage = 'No data available for this stock. Please choose a different stock';
          this.clearChartData();
        } else {
          if (d) {
            this.clearChartData();
            this.dailyData = d['Time Series (Daily)'];
            this.newDyKeys = Object.keys(d['Time Series (Daily)']);
            this.getMonthlyChartData(this.dailyData, this.newDyKeys);
          }
          window.scrollTo(0,0);
          this.spinner.hide();
          this.errorMessage = null;
        }
      },
      error => {
        console.error('Error occurred in getAlphavantageMonthly:', error);
        this.spinner.hide();
        this.errorMessage = 'No data available for this stock. Please choose a different stock';
        this.clearChartData();
      }
    );
  }

  getMonthlyChartData(data, keys) {
    keys.forEach(i => {
      this.dailyChartData.push(data[i]['4. close']);
      this.dailyChartData.sort();
      this.dailyTime.push(i);
      this.dailyTime.sort();
    });

    this.generateLineChart('myChart1', this.dailyTime, this.dailyChartData, 'Monthly');
  }

  getAlphavantageYearly() {
    this.alphaVantageService.getStockYearlyDetails(this.symbolName).subscribe(
      d => {
        if (d['Error Message']) {
          this.errorMessage = 'No data available for this stock. Please choose a different stock';
          this.clearChartData();
        } else {
          if (d) {
            this.clearChartData();
            this.dailyData = d['Monthly Time Series'];
            this.newDyKeys = Object.keys(d['Monthly Time Series']);
            this.getYearlyChartData(this.dailyData, this.newDyKeys);
          }
          window.scrollTo(0,0);
          this.spinner.hide();
          this.errorMessage = null;
        }
      },
      error => {
        console.error('Error occurred in getAlphavantageYearly:', error);
        this.spinner.hide();
        this.errorMessage = 'No data available for this stock. Please choose a different stock';
        this.clearChartData();
      }
    );
  }

  getYearlyChartData(data, keys) {
    keys.forEach(i => {
      this.dailyChartData.push(data[i]['4. close']);
      this.dailyChartData.sort();
      this.dailyTime.push(i);
      this.dailyTime.sort();
    });

    this.generateLineChart('myChart2', this.dailyTime, this.dailyChartData, 'Yearly');
  }

  generateLineChart(id, labels, chartData, xaxesLabel) {
    this.stackedLine = new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: chartData,
          backgroundColor: ['#fff'],
          borderColor: "#2f5597",
          borderWidth: 1,
          pointBackgroundColor: "aqua",
          pointRadius: 2
        }]
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          datalabels: {
            display: false,
          },
        },
        scales: {
          yAxes: [{
            stacked: false,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            },
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: xaxesLabel
            }
          }]
        }
      }
    });
  }

  clearData() {
    this.stocks = [];
    this.stockKeys = [];
    this.newKeys = [];
    this.newStocks = [];
  }

  clearChartData() {
    this.dailyChartData = [];
    this.dailyTime = [];
    this.dailyData = [];
    this.newDyKeys = [];
    if (this.stackedLine) {
      this.stackedLine.destroy();
    }
  }

  tabClick(tab) {
    if (tab.index === 0) {
      this.getAlphavantageDaily();
    } else if (tab.index === 1) {
      this.getAlphavantageMonthly();
    } else if (tab.index === 2) {
      this.getAlphavantageYearly();
    }
  }

  searchStock(event) {
    this.errorMessage = '';
    this.searchText = event.target.value;
    this.shortName = '';
    this.symbolName = this.searchText;
    this.alphaVantageService.stockSearchService(event.target.value).subscribe(d => {
      this.searchStockData = d["bestMatches"];
    });
  }

  searchGoogle(text) {
    this.newNewsArray = [];
    this.newsApiService.getAll(text, 0).subscribe(data => {
      if (data) {
        this.newNewsArray.push(data);
      }
    });
  }

  onStockSelect(value) {
    this.shortName = value['2. name'];
    this.symbolName = value['1. symbol'];
    this.selectStockList = "demo";
    if (value['2. name']) {
      this.sharedInteconnectService.nextText(value['2. name']);
    }
    this.clearData();
    this.clearChartData();
    this.getAlphaVantage(this.symbolName);
    this.getAlphavantageDaily();
  }

  industrialVertical(event) {
    if (event) {
      this.searchText = null;
      this.selectStockList = event;
      this.alphaVantageService.getTickerEmitter(event);
      this.selectedAll = false;
    } else {
      this.selectedAll = true;
    }
  }
}
