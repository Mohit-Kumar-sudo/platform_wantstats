import { Component, OnInit, Input } from '@angular/core';
import { AlphaVantageService } from 'src/app/services/alphvantage.service';
import * as _ from 'lodash';
import * as Chart from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { APIEndPoints, AuthInfoData } from 'src/app/constants/mfr.constants';
import { NewsApiService } from 'src/app/services/news-api.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-stock-filter',
  templateUrl: './stock-filter.component.html',
  styleUrls: ['./stock-filter.component.scss']
})
export class StockFilterComponent implements OnInit {

  @Input()
  tickerSymbol: any
  stockNewsArray = [];
  contentList = [
    {
      name: 'ALL',
      symbol: ''
    },
    {
      name: 'London stock exchange (LSE)',
      symbol: '^FTSE',
      news: 'INDEXFTSE: UKX',
      results: []
    }, {
      name: 'New York stock exchange (NYSE)',
      symbol: '^NYA',
      news: 'INDEXNYSEGIS: NYA',
      results: []
    }, {
      name: 'Tokyo stock exchange (TSE)',
      symbol: '^N225',
      news: 'INDEXNIKKEI: NI225',
      results: []
    }, {
      name: 'Shenzhen stock exchange (SZSE)',
      symbol: '399001.SZ',
      news: 'SHE: 399001',
      results: []
    }, {
      name: 'Euronext',
      symbol: 'ENX.PA',
      news: 'EPA: ENX',
      results: []
    }, {
      name: 'Shanghai stock exchange (SSE)',
      symbol: '000001.SS',
      news: 'SHA: 000001',
      results: []
    }, {
      name: 'Hong Kong stock exchange (HKEX)',
      symbol: '^HSI',
      news: 'INDEXHANGSENG: HSI',
      results: []
    }, {
      name: 'Bombay stock exchange (BSE)',
      symbol: '^BSESN',
      news: 'INDEXBOM: SENSEX',
      results: []
    }, {
      name: 'Nifty',
      symbol: '^NSEI',
      news: 'NSE: NIFTY',
      results: []
    }, {
      name: 'Toronto stock exchange (TSX)',
      symbol: '^GSPTSE',
      news: 'INDEXTSI: OSPTX',
      results: []
    }
  ]

  stocks: any = [];
  stockKeys: any = [];
  newKeys: any = [];
  finalStocks: any = [];
  dailyData: any = [];
  newDyKeys: any = [];
  dailyChartData: any = [];
  dailyTime: any = [];
  stackedLine: any = [];
  symbolName: any;
  articles: any[];
  allResults = [];
  newNewsArray: any = [];
  constructor(
    private alphaVantageService: AlphaVantageService,
    private newsApiService: NewsApiService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
   window.scrollTo(0,0)
    this.getFilterApiData();
    this.getFinanceNewsForAll(this.contentList);
    this.alphaVantageService.tickerSymbol.subscribe(d => {
      if (d === 'demo') {
        this.clearOnFilter();
        this.getFilterApiData();
        this.getFinanceNewsForAll(this.contentList)
        this.finalizedData();
      }
      else {
        this.clearOnFilter();
        let obj = [];
        this.contentList.forEach(item => {
          if (item.symbol === d) {
            obj[0] = {
              symbol: d,
              name: item.name
            }
            this.getAlphaVantage(obj);
            this.searchGoogle(item.name)
          }
        })
      }
    })
  }

  getAlphaVantage(stocks) {
    stocks.forEach((d1, index) => {
      this.stocks = [];
      this.stockKeys = [];
      this.newKeys = [];
      this.alphaVantageService.getStockDetails(d1.symbol).subscribe(d2 => {
        this.stocks = _.reduce(d2);
        this.stockKeys = _.keys(this.stocks)
        this.stockKeys.map(d3 => {
          d3 = d3.replace(/\d+/, '');
          d3 = d3.replace(/\s/g, '');
          d3 = d3.replace(/\./g, '');
          this.newKeys.push(d3)
        })
        const stockArray = Object.keys(this.stocks).map(i => this.stocks[i]);
        stockArray.map((i, d) => {
          stocks[index].price = stockArray[4]
          stocks[index].change = stockArray[8]
          stocks[index].change_percent = stockArray[9]
          stocks[index].latesttradingday = stockArray[6]
          stocks[index].previousclose = stockArray[7]
          stocks[index].open = stockArray[1]
          stocks[index].high = stockArray[2]
          stocks[index].low = stockArray[3]
        });
       window.scrollTo(0,0)
      });
      this.getAlphavantageDaily(d1.symbol, index)
    });
    stocks.forEach(item => {
      this.finalStocks.push(item)
    })
  }

  //daily
  getAlphavantageDaily(symbol, index) {
    this.symbolName = symbol
    this.alphaVantageService.getStockDailyDetails(symbol).subscribe(d => {
      if (d) {
        this.clearChartData(index);
        this.dailyData[index] = d['Time Series (1min)']
        if (d['Time Series (1min)']) {
          this.newDyKeys[index] = Object.keys(d['Time Series (1min)']);
          this.getDailyChartData(this.dailyData[index], this.newDyKeys[index], index);
        }
      }
     window.scrollTo(0,0)
    })
  }

  getDailyChartData(dailyData, keys, index) {
    let dailyChart = [];
    let dailyTime = [];
    keys.forEach(i => {
      dailyChart.push(dailyData[i]['1. open']);
      dailyChart.sort();
      dailyTime.push(i.split(" ")[1].split(":00"));
      dailyTime.sort();
    });
    this.dailyChartData[index] = dailyChart
    this.dailyTime[index] = dailyTime
    // this.generateColorArray();
    this.generateLineChart('myChart10' + index, this.dailyTime[index], this.dailyChartData[index], 'Day Time', index)
  }

  generateLineChart(id, labels, chartData, xaxesLabel, index) {
    this.stackedLine[index] = new Chart(id, {
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

  clearData(index) {
    this.stocks[index] = [];
    this.stockKeys[index] = [];
    this.newKeys[index] = [];
    this.finalStocks[index] = [];
  }

  clearOnFilter() {
    this.stocks = [];
    this.stockKeys = [];
    this.newKeys = [];
    this.finalStocks = [];
    this.newNewsArray = [];
    this.dailyChartData = [];
    this.dailyTime = [];
    this.dailyData = [];
    this.newDyKeys = [];
    this.stockNewsArray = [];
    this.stackedLine.forEach(d => {
      d.destroy();
    })
  }

  clearChartData(index) {
    this.dailyChartData[index] = [];
    this.dailyTime[index] = [];
    this.dailyData[index] = [];
    this.newDyKeys[index] = [];
    if (this.stackedLine[index]) {
      this.stackedLine[index].destroy()
    }
  }

  //monthly
  getAlphavantageMonthly(symbol, index) {
    this.alphaVantageService.getStockMonthlyDetails(symbol).subscribe(d => {
      if (d) {
        this.clearChartData(index);
        this.dailyData[index] = d['Time Series (Daily)']
        this.newDyKeys[index] = Object.keys(d['Time Series (Daily)'])
        this.getMonthlyChartData(this.dailyData[index], this.newDyKeys[index], index)
      }
     window.scrollTo(0,0)
    })
  }

  getMonthlyChartData(data, keys, index) {
    let dailyChart = [];
    let dailyTime = [];
    keys.forEach(i => {
      dailyChart.push(data[i]['4. close']);
      dailyChart.sort();
      dailyTime.push(i);
      dailyTime.sort();
    });
    this.dailyChartData[index] = dailyChart;
    this.dailyTime[index] = dailyTime
    this.generateLineChart('myChart20' + index, this.dailyTime[index], this.dailyChartData[index], 'Monthly', index)
  }

  //yearly
  getAlphavantageYearly(symbol, index) {
    this.alphaVantageService.getStockYearlyDetails(symbol).subscribe(d => {
      if (d) {
        this.clearChartData(index);
        this.dailyData[index] = d['Monthly Time Series']
        this.newDyKeys[index] = Object.keys(d['Monthly Time Series']);
        this.getYearlyChartData(this.dailyData[index], this.newDyKeys[index], index);
      }
     window.scrollTo(0,0)
    })
  }

  getYearlyChartData(data, keys, index) {
    let dailyChart = [];
    let dailyTime = [];
    keys.forEach(i => {
      dailyChart.push(data[i]['4. close']);
      dailyChart.sort();
      dailyTime.push(i);
      dailyTime.sort();
    });
    this.dailyChartData[index] = dailyChart;
    this.dailyTime[index] = dailyTime
    this.generateLineChart('myChart30' + index, this.dailyTime[index], this.dailyChartData[index], 'Yearly', index)
  }

  tabClick(tab, i, symbol) {
    if (tab.index === 0) {
      this.getAlphavantageDaily(symbol, i)
    } else if (tab.index === 1) {
      this.getAlphavantageMonthly(symbol, i)
    } else if (tab.index === 2) {
      this.getAlphavantageYearly(symbol, i)
    }
  }

  isNumber(no) {
    return !isNaN(no);
  }

  searchGoogle(text) {
    this.newsApiService
      .getAll(text, 0)
      .subscribe(data => {
        if (data) {
          let obj = {
            results: data
          }
          this.newNewsArray.push(obj)
        }

      });
  }

  getFinanceNewsForAll(content) {

    for (let i = 1; i < content.length; i++) {
      this.stockNewsArray.push(content[i]);
    }
    this.allResults = [];
    for (let i = 1; i < content.length; i++) {
      let searchQuery = content[i].name;

      this.newsApiService
        .getAll(searchQuery, 0)
        .subscribe(data => {
          if (data) {
            let data1 = {
              data: data,
              name: searchQuery
            }
            this.stockNewsArray.forEach(ele => {
              if (ele.name && ele.name == data1.name) {
                ele.results = data1.data;
              }
            })
          }


         window.scrollTo(0,0)
        });
    }
  }

  getFilterApiData() {
    this.spinner.show();
    fetch(APIEndPoints.FILTER_STOCKS, {
      method: 'get',
      headers: new Headers({
        'Authorization': "jwt " + this.localStorageService.get(AuthInfoData.TOKEN_NAME),
        'content-type': 'application/json'
      }),
    }).then(response => response.json())
      .then(data => {
        if (data) {
          this.spinner.hide();
          this.processingData(data)
        }
       window.scrollTo(0,0)
      })
      .catch(error => {
        console.log("error", error);
      })
  }

  processingData(data) {
    let stock = data.data.stocks;
    let reduced = [];
    let final = [];

    stock.forEach(d => {
      if (d) {
        reduced.push(_.reduce(d));
      }
    })
    reduced = _.remove(reduced, undefined);
    reduced.forEach((d) => {
      final.push({
        name: '',
        symbol: d['01'][" symbol"],
        change: d['09'][" change"],
        change_percent: d['10'][' change percent'],
        price: d['05'][' price'],
        latesttradingday: d['07'][' latest trading day'],
        previousclose: d['08'][' previous close'],
        open: d['02'][' open'],
        high: d['03'][' high'],
        low: d['04'][' low']
      })
    });

    if (final && final.length) {
      final.forEach(item => {
        const res = _.find(this.contentList, ['symbol', item.symbol]);
        if (res) {
          item.name = res.name;
        }
      })
    }
    this.finalStocks = final;
    setTimeout(d => {
      this.finalizedData()
    }, 2000)
  }

  finalizedData() {
    if (this.finalStocks && this.finalStocks.length && this.stockNewsArray && this.stockNewsArray.length) {
      // this.newNewsArray = [];
      this.stockNewsArray = _.sortBy(this.stockNewsArray, ['name']);
      this.finalStocks.forEach(d => {
        let res = _.find(this.stockNewsArray, ['symbol', d.symbol]);
        this.newNewsArray.push(res);
      });
      this.finalStocks = _.sortBy(this.finalStocks, ['name']);
      this.newNewsArray = _.sortBy(this.newNewsArray, ['name']);
      this.getAPIOneDayData();
    }
  }

  getAPIOneDayData() {
    this.spinner.show();
    fetch(APIEndPoints.ONE_DAY_STOCKS, {
      method: 'get',
      headers: new Headers({
        'Authorization': "jwt " + this.localStorageService.get(AuthInfoData.TOKEN_NAME),
        'content-type': 'application/json'
      }),
    }).then(response => response.json())
      .then(data => {
        if (data) {
          this.spinner.hide();
          this.processingOneDayData(data)
        }
       window.scrollTo(0,0)
      })
      .catch(error => {
        // console.log("error", error);
      })
  }

  processingOneDayData(data) {
    let oneDay = data.data.stocks;
    let finalOneDay = []
    let finalizedData = [];
    if (oneDay) {
      oneDay.forEach(d => {
        let symbol = d['Meta Data']['2'][' Symbol']
        const res = _.find(this.contentList, ['symbol', symbol]);
        finalOneDay.push({
          name: res.name,
          symbol: res.symbol,
          data: d
        })
      });
      if (this.finalStocks) {
        this.finalStocks.forEach(d => {
          let res = _.find(finalOneDay, ['symbol', d.symbol]);
          finalizedData.push(res);
        });
        finalizedData = _.sortBy(finalizedData, ['name'])
        if (finalizedData) {
          finalizedData.forEach((d, i) => {
            let oneD = d.data['Time Series (1min)'][0][0]
            this.dailyData[i] = oneD
            if (oneD) {
              this.newDyKeys[i] = Object.keys(oneD);
              this.getDailyChartData(this.dailyData[i], this.newDyKeys[i], i);
            }
          })
        }
      }
    }
  }
}
