import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlphaVantageService } from 'src/app/services/alphvantage.service';
import { APIEndPoints } from 'src/app/constants/mfr.constants';
import * as _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss']
})
export class MarqueeComponent implements OnInit {

  stockData1 = [
    {
      shortName: 'S&P 500',
      symbol: '^GSPC',
    }, {
      shortName: 'Russell 2000',
      symbol: '^RUT'
    }, {
      shortName: 'DOLLAR Index Spot',
      symbol: 'DX-Y.NYB'
    }, {
      shortName: 'USD-JPY X-RATE',
      symbol: 'USDJPY'
    }, {
      shortName: 'EUR-USD X-RATE',
      symbol: 'EURUSD'
    },
    {
      shortName: 'Gold',
      symbol: 'GC=F'
    }, {
      shortName: 'US 10-year Bond Yield',
      symbol: '^TNX'
    },
    {
      shortName: 'WTI Futures',
      symbol: 'CL=F'
    },
    {
      shortName: 'BRENT Futures',
      symbol: 'BZ=F'
    },
    {
      shortName: 'S&P 500 Futures',
      symbol: 'ES=F'
    },
    {
      shortName: 'DOW Jones Futures',
      symbol: 'YM=F'
    },
    {
      shortName: 'FTSE 100',
      symbol: '^FTSE',
    },
    {
      shortName: 'DAX INDEX',
      symbol: '^GDAXI',
    },
    {
      shortName: 'NIKKEI 225',
      symbol: '^N225'
    },
    {
      shortName: 'SHANGHAI SE Composite',
      symbol: '^SSEC'
    }
  ];

  marqueeAPI: any;
  currentReport: any;
  searchMenuText: any = '';
  searchData = {
    companies: [
      {label: 'Company1', link: 'Company1', isShow: true},
      {label: 'Company2', link: 'Company2', isShow: true},
      {label: 'Company3', link: 'Company3', isShow: true},
      {label: 'Company4', link: 'Company4', isShow: true},
      {label: 'Company5', link: 'Company5', isShow: true}
    ],
    videos: [
      {label: 'Video1', link: 'Video1', isShow: true},
      {label: 'Video2', link: 'Video2', isShow: true},
      {label: 'Video3', link: 'Video3', isShow: true},
      {label: 'Video4', link: 'Video4', isShow: true},
      {label: 'Video5', link: 'Video5', isShow: true},
    ],
    charts: [
      {label: 'Chart1', link: 'Chart1', isShow: true},
      {label: 'Chart2', link: 'Chart2', isShow: true},
      {label: 'Chart3', link: 'Chart3', isShow: true},
      {label: 'Chart4', link: 'Chart4', isShow: true},
      {label: 'Chart5', link: 'Chart5', isShow: true},
    ],
    newAndUpdates: [
      {label: 'News 1', link: 'News 1', isShow: true},
      {label: 'News 2', link: 'News 2', isShow: true},
      {label: 'News 3', link: 'News 3', isShow: true},
      {label: 'News 4', link: 'News 4', isShow: true},
      {label: 'News 5', link: 'News 5', isShow: true},
    ],
    lightBulbDigest: [
      {label: 'Light Bulb Digest1', link: 'LB1', isShow: true},
      {label: 'Light Bulb Digest2', link: 'LB2', isShow: true},
      {label: 'Light Bulb Digest3', link: 'LB3', isShow: true},
      {label: 'Light Bulb Digest4', link: 'LB4', isShow: true},
      {label: 'Light Bulb Digest5', link: 'LB5', isShow: true},
    ],
    industryReports: [
      {label: 'Industry Reports 1', link: 'LB5', isShow: true},
      {label: 'Industry Reports 2', link: 'LB5', isShow: true},
      {label: 'Industry Reports 3', link: 'LB5', isShow: true},
      {label: 'Industry Reports 4', link: 'LB5', isShow: true},
      {label: 'Industry Reports 5', link: 'LB5', isShow: true},
    ]
  };

  stocks: any = [];
  stockKeys: any = [];
  newKeys: any = [];
  isLoggedIn: any;

  constructor(
    public router : Router,
    private alphaVantageService: AlphaVantageService,
    private spinner : NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getMarqueeApiData()
  }

  getMarqueeApiData() {
    this.spinner.show();
    fetch(APIEndPoints.MARQUEE_STOCKS, {
      method: 'get',
      headers: {'content-type': 'application/json'}
    }).then(response => response.json())
      .then(data => {
        if (data) {
          this.spinner.hide();
          this.processingData(data);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  processingData(data) {
    let stock = data.data.stocks;
    let reduced = [];
    let final = [];

    stock.forEach(d => {
      reduced.push(_.reduce(d));
    });
    reduced = _.remove(reduced, undefined);
    reduced.forEach((d) => {
      final.push({
        shortName: '',
        symbol: d['01'][' symbol'],
        change: d['09'][' change'],
        change_percent: d['10'][' change percent'],
        price: d['05'][' price']
      });
    });

    if (final && final.length) {
      final.forEach(item => {
        const res = _.find(this.stockData1, ['symbol', item.symbol]);
        if (res) {
          item.shortName = res.shortName;
        } else {
          item.shortName = 'S&P 500';
        }
      });
    }
    this.marqueeAPI = final;
  }

  getSelectedStock(item) {
    this.router.navigate([`stocks`], {queryParams: {symbol: item.symbol, name: item.shortName}});
  }

  searchMenus() {
    const keysArray = ['companies', 'videos', 'charts', 'newAndUpdates', 'lightBulbDigest', 'industryReports'];
    keysArray.forEach(item1 => {
      this.searchData[item1].forEach(item => {
        item.isShow = item.label.toLowerCase().includes(this.searchMenuText.toLowerCase());
      });
    });
  }

  isNumber(no) {
    return !isNaN(no);
  }

  onStock(event) {
    this.alphaVantageService.stockButton(event);
  }

}
