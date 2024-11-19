import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounce } from 'lodash';
import {
  SubscriptionMessages,
  ConstantKeys,
  AuthInfoData,
} from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportService } from 'src/app/services/report.service';
import { HistoryService } from 'src/app/services/history.service';

interface report {
  title: string;
  _id: string;
  approved: boolean;
  isPdf: boolean;
  pdfLink: string;
  isExcel: boolean;
  excelLink: string;
  isDoc: boolean;
  docLink: string;
  isAnalytics: boolean;
  id: string;
}

@Component({
  selector: 'app-industry-reports',
  templateUrl: './industry-reports.component.html',
  styleUrls: ['./industry-reports.component.scss'],
})
export class IndustryReportsComponent implements OnInit {
  industryReportForm: FormGroup;
  searchText: any = '';
  inputValue: any = '';
  reports: report[] = [];
  filteredReports: any = [];
  isSubscribed = false;
  reportGroups: any = [];
  errorMessage: string | null = null;
  currentReport: any;
  permissions: any;
  isSearched = false;
  isSelected = false;
  loadingIndicator: boolean = false;
  searchTerm: FormControl = new FormControl();
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

  @ViewChild('ClientPaginatore') paginator1!: MatPaginator;

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  filterdCards = this.reportGroups.slice(0, this.pageSize);
  limit: any = 10;
  page = 1;

  pageEvent: PageEvent;
  industryReports = false;
  companies = false;
  chartsAndStatastics = false;
  dataTables = false;
  newsAndUpdates = false;
  videos = false;
  isChecked: boolean;

  verticals = {
    Healthcare: 'Healthcare',
    CNM: 'Chemicals and materials',
    AnD: 'Aerospace and defense',
    IAE: 'Industrial Automation Equipment',
    PCM: 'Packaging and construction Materials',
    CFnB: 'Consumer goods, food and beverages',
    CFNB: 'Consumer goods, food and beverages',
    Auto: 'Auto',
    EnP: 'Energy and Power',
    ENP: 'Energy and Power',
    ICT: 'Information and, communication technologies',
    default: 'default',
    SEMI: 'Semiconductors and electronics',
    AGRI: 'Agriculture',
  };

  categories = [
    { id: 1, value: 'Aerospace & Defense', isChecked: false },
    { id: 2, value: 'Agriculture', isChecked: false },
    { id: 3, value: 'Automobile', isChecked: false },
    { id: 4, value: 'Chemicals & Materials', isChecked: false },
    { id: 5, value: 'Construction', isChecked: false },
    { id: 6, value: 'Energy & Power', isChecked: false },
    { id: 7, value: 'Food', isChecked: false },
    { id: 8, value: 'Beverages', isChecked: false },
    { id: 9, value: 'Healthcare', isChecked: false },
    { id: 10, value: 'Industrial Automation & Equipment', isChecked: false },
    { id: 11, value: 'Information & Communications', isChecked: false },
    { id: 12, value: 'Packaging & Transport', isChecked: false },
    { id: 13, value: 'Semiconductor & Electronics', isChecked: false },
  ];

  subscriptionMessage = SubscriptionMessages.FEATURE_NOT_AVAILABLE;

  aerospacedefense: any;
  userLoggedIn: any;
  userID: any;
  ReportTitle: any;
  allReports: any;
  dataSourceRefferalsSearchPage: any;
  event: any;
  selectedName: any;
  checklist: any;
  Selectedreports: any;
  selectedText = '';
  user: any;
  showNoChartsMessage: boolean;
  activityList: any = { reportIds: [] };
  reportAccess: any;
  constructor(
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private tostr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public activatedRoute: ActivatedRoute,
    private historyService: HistoryService
  ) {
    this.getAllReports();
  }

  ngOnInit() {
    this.reportService.loadingIndicator$.subscribe((loading) => {
      this.loadingIndicator = loading;
    });
    setTimeout(() => {
      this.showNoChartsMessage = true;
    }, 3000);
    this.currentReport = this.localStorageService.get(
      ConstantKeys.CURRENT_REPORT
    );
    this.user = this.localStorageService.get(AuthInfoData.USER);

    const permissions = this.authService.getUserPermissions();
    this.permissions = permissions;
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.industryReports = queryParams['industryReports'] === 'true';
    this.companies = queryParams['companies'] === 'true';
    this.chartsAndStatastics = queryParams['chartsAndStatastics'] === 'true';
    this.newsAndUpdates = queryParams['newsAndUpdates'] === 'true';
    this.dataTables = queryParams['dataTables'] === 'true';
    this.videos = queryParams['videos'] === 'true';
    this.searchTerm.setValue(queryParams['searchText']);
    this.getReportAccess();
  }

  getReportAccess() {
    this.historyService.getReportsList().subscribe((res: any) => {
      if (res) {
        this.activityList.reportIds = res.data[0].reportIds.map((id: any) => {
          return id._id;
        });
      } else {
        this.tostr.warning('Something went wrong please try again');
      }
    });
  }

  modifyTitle(title) {
    let modifiedTitle = title;
    if (!title.includes('Market')) {
      modifiedTitle += ' Market';
    }
    if (!title.includes('Global')) {
      modifiedTitle = `Global ${modifiedTitle}`;
    }
    return modifiedTitle;
  }

  async getAllReports() {
    try {
      this.spinner.show();
      const data = await this.reportService.getAllGroupedReports().toPromise();
      if (data) {
        this.spinner.hide();
        this.allReports = data.data;
        this.allReports.forEach((item) => {
          item.title = this.modifyTitle(item.title);
        });
      }
    } catch (error) {
      this.spinner.hide();
      // Handle error if needed
    }
  }

  addReportToActivity(report: any): void {
    this.activityList.reportIds.push(report._id);
    this.historyService
      .addReportsToActivity(this.activityList)
      .subscribe((res: any) => {
        if (res) {
          this.tostr.success('Report added to focus area successfully.');
        } else {
          this.tostr.error('Failed to add report to focus area.');
        }
      });
  }

  updateCards(e) {
    // console.log(e);
    this.filterdCards = this.reportGroups.slice(
      e.pageIndex * e.pageSize,
      (e.pageIndex + 1) * e.pageSize
    );
    // console.log(this.filterdCards);
  }

  onReportSelect(id) {
    this.spinner.show();
    this.reportService.getById(id).subscribe(
      (data) => {
        const localData = {
          _id: data._id,
          title: data.title,
          category: data.category,
          vertical: data.vertical,
          me: {
            start_year: data.me.start_year,
            end_year: data.me.end_year,
            base_year: data.me.base_year,
          },
          overlaps: data.overlaps,
          owner: data.owner,
          tocList: data.tocList,
          status: data.status,
          title_prefix: data.title_prefix,
          youtubeContents: data.youtubeContents,
        };
        if (data) {
          this.localStorageService.set(ConstantKeys.CURRENT_REPORT, localData);
          this.router.navigate(['market-estimation'], {
            queryParams: { reportId: data._id },
          });
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.tostr.error(error.error.message);
      }
    );
  }

  SelectedValue(item) {
    this.searchTerm.reset();
    this.isSearched = false;
    this.searchText = null;
    this.categories.forEach((val) => {
      this.spinner.show();
      if (val.id == item.id) {
        val.isChecked = !val.isChecked;
      } else {
        val.isChecked = false;
      }
    });
    this.selectedName = item.value;
    this.searchReports();
  }

  searchReports() {
    this.isSearched = true;
    this.isSelected = false;
    const searchVal = this.searchText ? this.searchText : this.selectedName;
    this.selectedText = searchVal;
    this.errorMessage = '';
    if (!this.selectedText) {
      this.errorMessage = 'Please enter a Report title to search for results.';
      this.reports = [];
      this.spinner.hide();
      return;
    }
    this.reportService.getSearchReportsByName(this.selectedText).subscribe(
      (data) => {
        if (data && data['data']) {
          this.reports = data['data'];
          console.log('this.reports', this.reports);
          this.page = 1;
          this.reports.forEach((item) => {
            if (!item.title.toLowerCase().includes('market')) {
              item.title = item.title + ' Market';
            }
          });

          if (this.reports.length === 0) {
            this.errorMessage = 'No reports found. Please try with different keywords.';
          }
        } else {
          this.reports = [];
          this.errorMessage = 'No reports found. Please try with different keywords.';
        }
        this.spinner.hide();
      },
      (error) => {
        this.reports = [];
        if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          this.errorMessage = 'An error occurred while fetching reports. Please try again later.';
        }
        this.spinner.hide();
      }
    );
  }

  onInputChange = debounce((event: any) => {
    this.inputValue = event.target.value.trim();
    this.searchText = this.inputValue;
    this.searchReports();
  }, 2000);

  search() {
    this.spinner.show();
    if (this.searchTerm) {
      this.searchReports();
    } else {
      this.getAllReports();
    }
  }

  visitMeReports(data) {
    this.router.navigate(['market-estimation'], {
      queryParams: { reportId: data },
    });
  }

  visitPdf(reportId, pdfLink) {
    this.router.navigateByUrl(`/view-pdf/${reportId}`);
  }
}
