import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { Location } from '@angular/common';
import { ReportService } from 'src/app/services/report.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { OutputResultsService } from 'src/app/services/output-result.service';
import { NewsApiService } from 'src/app/services/news-api.service';
import { UserService } from 'src/app/services/user.service';
import { TitleDataService } from 'src/app/services/title-data.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchTerm: FormControl = new FormControl();
  isOuter = true;
  isSearched = false;
  isSearchResults = false;
  industryReports = true;
  companies = true;
  chartsAndStatastics = true;
  dataTables = true;
  newsAndUpdates = true;
  videos = true;
  reportDataList: { title: string }[] = [];
  chartsData: any = [];
  searchText: any = '';
  titleData: { key: string; title: string }[] = [];
  titleDataa: any = [];
  contentList = [
    'All',
    'Aerospace and Defense',
    'Automotive',
    'Consumer food and beverages',
    'Chemical and materials',
    'Energy and power',
    'Healthcare',
    'Information and communication technology',
    'Packaging construction and mining',
    'Semiconductor',
  ];

  googleSearch = [];
  selectedText = '';
  selectIndustrialVertical: any;
  ContentTitle: any;
  meChartsData: any;
  firstThree: any;
  lastThree: any;
  NewsData: any;
  isLoggedIn: any;
  searchSubscription: any;
  news: any;
  currentReport: any;

  constructor(
    private router: Router,
    private location: Location,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private sharedInteconnectService: SharedInteconnectService,
    private outputResultsService: OutputResultsService,
    private activatedRoute: ActivatedRoute,
    private newsApiService: NewsApiService,
    private userService: UserService,
    private titleDataService: TitleDataService
  ) {}

  ngOnInit() {
    this.titleDataService.titleData$.subscribe((data) => {
      this.titleData = data;
    });

    this.firstFunction();
  }

  firstFunction() {
    this.searchTerm.valueChanges.subscribe((term) => {
      if (term != '') {
        if (this.searchSubscription) {
          this.searchSubscription.unsubscribe();
        }
        this.searchSubscription = this.reportService
          .getSearchReportsByName(term)
          .subscribe((data) => {
            if (data && data[`data`]) {
              this.reportDataList = data.data;
            }
          });
      }
    });
    this.router.events.subscribe((val) => {
      if (this.location.path() == '') {
        this.isSearchResults = false;
        this.isOuter = true;
      } else if (this.location.path().includes('/search-results')) {
        this.isOuter = true;
        this.isSearchResults = true;
      } else {
        this.isSearchResults = false;
        this.isOuter = false;
      }
    });
    this.searchText = this.activatedRoute.snapshot.queryParams['searchText'];
    if (this.searchText !== undefined) {
      this.searchCharts(this.searchText);
    } else {
      this.searchCharts('dermal filler');
    }
    this.selectIndustrialVertical = 'All';
    this.searchAll();
    this.getNewsTitleList();
  }

  getReportInfo(reportId) {
    this.spinner.show();
    this.reportService.getById(reportId).subscribe(
      (data) => {
        this.getReportInfoSuccess(data);
      },
      (error) => {
        this.toastr.error(error.error.message);
        // console.log(error);
      }
    );
  }

  getReportInfoSuccess(data) {
    if (data) {
      this.localStorageService.set(ConstantKeys.CURRENT_REPORT, data);
      this.router.navigate(['market-estimation'], {
        queryParams: { reportId: data._id },
      });
    }
  }

  ///GetReportData
  searchCharts(searchString) {
    this.spinner.show();
    if (this.searchText) {
      this.router.navigate([`top-bar-charts`], {
        queryParams: { searchText: searchString },
      });
    }
    this.sharedInteconnectService.nextText(searchString);
    if (searchString) {
      if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
      }
      this.searchSubscription = this.outputResultsService
        .searchTablesChartsImagesByStr('chart', searchString)
        .subscribe((data) => {
          if (!data.meChartsData?.length) {
            return;
          }
          this.spinner.hide();
          this.meChartsData = data.meChartsData;
          if (this.meChartsData.length) {
            this.meChartsData.forEach((item) => {
              item.titles.forEach((title) => {
                if (
                  title.title.toLowerCase().includes(searchString.toLowerCase())
                ) {
                  title.reportId = item._id;
                  this.titleData.push(title);
                }
              });
            });
          }
        });
    }
  }

  navigateToChartsAndStatistics(charts) {
    this.spinner.show();
    this.localStorageService.set(
      ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA,
      charts
    );
    this.localStorageService.set(
      ConstantKeys.CURRENT_OP_CHART_AND_STASTISTICS_LIST,
      this.meChartsData
        ? this.meChartsData
        : [
            {
              _id: '5e29b4258fb7610004367a42',
              title: 'Dermal Fillers',
              titles: [
                {
                  title:
                    'Global Dermal Fillers market [2017-2027] Middle East and Africa by Type',
                  type: 'BAR',
                  id: '5da7c82fc249910004740637',
                  key: 'MARKET_BY_REGION',
                  reportId: '5e29b4258fb7610004367a42',
                },
              ],
            },
          ]
    );
    this.router.navigateByUrl('output-charts-and-statistics');
  }

  search() {
    this.spinner.show();
    this.isSearched = true;
    this.isOuter = false;
    if (!this.searchTerm.value) {
      this.router.navigate([`top-bar-charts`]);
    } else {
      this.router.navigate([`search-results`], {
        queryParams: {
          searchText: this.searchTerm.value
            ? this.searchTerm.value
            : 'Dermal fillers',
          industryReports: this.industryReports,
          companies: this.companies,
          chartsAndStatastics: this.chartsAndStatastics,
          dataTables: this.dataTables,
          newsAndUpdates: this.newsAndUpdates,
          videos: this.videos,
        },
      });
    }
  }

  searchNewtab() {
    this.spinner.show();
    this.isSearched = true;
    this.isOuter = false;
    this.router.navigate([`industry-reports`], {
      queryParams: {
        searchText: this.searchTerm.value,
        industryReports: this.industryReports,
        companies: this.companies,
        chartsAndStatastics: this.chartsAndStatastics,
        dataTables: this.dataTables,
        newsAndUpdates: this.newsAndUpdates,
        videos: this.videos,
      },
    });
  }

  // NewsAndReport
  searchAll() {
    this.selectedText = 'All industries';
    this.spinner.show();
    for (let i = 1; i < this.contentList.length; i++) {
      let content = {
        name: this.contentList[i],
        results: [],
        count: 0,
      };
      this.googleSearch.push(content);
    }
    this.contentList.forEach((items, i) => {
      this.newsApiService.getAll(items, 0).subscribe((data) => {
        if (data) {
          let data1 = {
            data: data,
            name: items,
            count: data.length,
            config: {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: data.length,
            },
          };
          this.googleSearch.forEach((ele) => {
            if (ele.name == data1.name) {
              ele.results = data1.data;
              ele.count = ele.results.length;
              ele.config = data1.config;
            }
            if (/semiconductor/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/semiconductor.png';
            } else if (/aerospace\s*and\s*defense/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/aerospace.png';
            } else if (/agriculture/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/agriculture.png';
            } else if (/automotive/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/automotive.png';
            } else if (/chemical\s*and\s*materials/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/chemicals.png';
            } else if (
              /construction|packaging\s*construction\s*and\s*mining/i.test(
                ele.name
              )
            ) {
              ele.image =
                '../../../assets/newsupdates/manufacturing-construction.png';
            } else if (/consumer\s*food\s*and\s*beverages/i.test(ele.name)) {
              ele.image =
                '../../../assets/newsupdates/consumer-goods-retail-market.png';
            } else if (/energy\s*and\s*power/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/energy-power.png';
            } else if (/food\s*beverages\s*&\s*nutrition/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/food-beverages.png';
            } else if (/healthcare/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/healthcare.png';
            } else if (/industrial\s*automation\s*equipment/i.test(ele.name)) {
              ele.image = '../../../assets/newsupdates/equipment-machinery.png';
            } else if (
              /information\s*and\s*communication\s*technology/i.test(ele.name)
            ) {
              ele.image = '../../../assets/newsupdates/technology.png';
            }
          });
          if (i === this.contentList.length - 1) {
            this.spinner.hide();
          }
        }
      });
    });
  }

  getNewsTitleList() {
    for (let i = 1; i < this.contentList.length; i++) {
      let searchQuery = this.contentList[i];
      this.newsApiService.getAll(searchQuery, 0).subscribe((data) => {
        this.NewsData = data.slice(0, 3);
      });
    }
  }

  getLink(news) {
    if (news && news.title && news.link) {
      this.userService.saveNewsUserHistory(news).subscribe(
        (data) => {
          if (data) {
            // console.log(data);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  submitLead(frm: any) {
    if (frm.valid) {
      this.toastr.success('Form Submitted Successfully');
      frm.reset();
    } else {
      this.toastr.warning('Please Fill the Form Properly');
    }
  }
}
