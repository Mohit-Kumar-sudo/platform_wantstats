import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ConstantKeys } from '../../constants/mfr.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { companyProfileService } from 'src/app/services/companyprofile.service';
import { OutputResultsService } from 'src/app/services/output-result.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';
import { NewsApiService } from 'src/app/services/news-api.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
interface Report {
  id: string;
  _id: string;
  title: string;
  isPdf: boolean;
  isDoc: boolean;
  isAnalytics: boolean;
  docLink: string;
  isSubscribed: boolean;
}

@Component({
  selector: 'app-output-results',
  templateUrl: './output-results.component.html',
  styleUrls: ['./output-results.component.scss'],
})
export class OutputResultsComponent implements OnInit {
  industryReports = false;
  companies = false;
  chartsAndStatastics = false;
  isSubscribed: boolean = true;
  dataTables = false;
  newsAndUpdates = false;
  videos = false;
  pagination: any;
  permissions: any;
  searchText: any = '';
  videosData = [];
  meChartsData = [];
  newsAndUpdatesData: any = [];
  reportDataList: any = [];
  searchTerm: FormControl = new FormControl();
  allCompanies: any = [];
  chartsData = [];
  tablesData = [];
  imagesData = [];
  searchSubscription: any;
  chartsList: { key: string; title: string }[] = [];
  reportsData: Report[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private companyProfileService: companyProfileService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private outputResultsService: OutputResultsService,
    private localStorageService: LocalStorageService,
    private youtubeApiService: YoutubeApiService,
    private newsApiService: NewsApiService,
    private reportService: ReportService,
    private sharedInteconnectService: SharedInteconnectService
  ) {}

  ngOnInit() {
    this.searchTerm.valueChanges.subscribe((value) => {
      if (value.toLowerCase() === 'iot') {
        this.searchTerm.setValue('iot ');
      }
    });
    this.permissions = this.authService.getUserPermissions();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.industryReports = queryParams['industryReports'] === 'true';
    this.companies = queryParams['companies'] === 'true';
    this.chartsAndStatastics = queryParams['chartsAndStatastics'] === 'true';
    this.newsAndUpdates = queryParams['newsAndUpdates'] === 'true';
    this.dataTables = queryParams['dataTables'] === 'true';
    this.videos = queryParams['videos'] === 'true';
    this.searchTerm.setValue(queryParams['searchText']);
    this.search();
  }

  searchCharts() {
    const searchString = this.searchTerm.value.toLowerCase();
    this.sharedInteconnectService.nextText(searchString);
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    // console.log("searchString", searchString);
    this.searchSubscription = this.outputResultsService
      .searchTablesChartsImagesByStr('chart', searchString)
      .subscribe((data) => {
        // console.log("data", data);
        if (!data.meChartsData.length) {
          return;
        }
        this.spinner.hide();
        this.meChartsData = data.meChartsData;
        // console.log("meChartsData", this.meChartsData);
        this.chartsList = [];
        if (this.meChartsData.length) {
          this.meChartsData.forEach((item) => {
            item.titles.forEach((title) => {
              if (
                title.title.toLowerCase().includes(searchString.toLowerCase())
              ) {
                title.reportId = item._id;
                this.chartsList.push(title);
              }
            });
          });
        }
      });
  }

  searchCompanies() {
    this.companyProfileService
      .getCompaniesByString(this.searchTerm.value)
      .subscribe((data) => {
        this.allCompanies = [];
        if (data && data) {
          this.allCompanies = data.data;
        }
      });
  }

  getAllCompanies() {
    this.companyProfileService.getAllCompanies().subscribe((data) => {
      this.allCompanies = data;
    });
  }

  search() {
    // this.spinner.show();
    if (this.searchTerm.value.trim()) {
      this.searchReports();
      this.searchVideos();
      this.searchCharts();
      this.searchNewsAndUpdates();
      this.searchCompanies();
    } else {
      this.getAllCompanies();
    }
    this.router.navigate([`search-results`], {
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

  searchReports() {
    this.reportService.getSearchReportsByName(this.searchTerm.value).subscribe((data) => {
        if (data && data[`data`]) {
          this.reportsData = data[`data`];
          // console.log(' this.reportsData ', this.reportsData);
          this.reportsData.forEach((item) => {
            item.title = item.title + ' Market';
          });
          // console.log('reportsData', this.reportsData);
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  searchVideos() {
    this.videosData = [];
    this.youtubeApiService
      .getAll(this.searchTerm.value + ' industry')
      .subscribe((data) => {
        this.videosData = data.items;
      });
  }

  searchNewsAndUpdates(page?) {
    if (!page) {
      page = 0;
    } else {
      page = page * 10;
    }
    this.newsApiService
      .getAll(this.searchTerm.value, page)
      .subscribe((data) => {
        if (data) {
          this.newsAndUpdatesData = data;
        }
        this.spinner.hide();
      });
  }

  getReportInfo(reportId) {
    this.spinner.show();
    this.reportService.getById(reportId).subscribe(
      (data) => {
        if (data) {
          this.localStorageService.set(ConstantKeys.CURRENT_REPORT, data);
          this.router.navigate(['market-estimation'], {
            queryParams: {
              reportId: data._id,
            },
          });
        }
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );

    this.reportService
      .getReportChartTitles(reportId)
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  navigateToChartsAndStatistics(chart) {
    // this.spinner.show();
    this.localStorageService.set(
      ConstantKeys.CURRENT_OUTPUT_CHART_AND_STATISTICS_DATA,
      chart
    );
    this.localStorageService.set(
      ConstantKeys.CURRENT_OP_CHART_AND_STASTISTICS_LIST,
      this.meChartsData
    );
    this.router.navigateByUrl('output-charts-and-statistics');
  }

  visitRoute(report) {
    if (report.isAnalytics) {
      this.router.navigate([`/market-estimation`], {
        queryParams: { reportId: report._id },
      });
    } else if (report.isPdf) {
      this.router.navigate([`/view-pdf/${report._id}`]);
    } else if (report.isDoc) {
      this.router.navigate([`${report.docLink}`]);
    }
  }
}
