import { Component, OnInit } from "@angular/core";
import {ConstantKeys, SubscriptionMessages} from "src/app/constants/mfr.constants";
import { ReportService } from "../../services/report.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { AuthService } from "../../services/auth.service";
import { FormControl } from "@angular/forms";
import {ToastrService} from 'ngx-toastr';
import { LocalStorageService } from "src/app/services/localstorage.service";

@Component({
  selector: 'app-categorywise-report',
  templateUrl: './categorywise-report.component.html',
  styleUrls: ['./categorywise-report.component.scss']
})
export class CategorywiseReportComponent implements OnInit {
  searchText: any = "";
  reports: any = [];
  isSubscribed = false;
  reportGroups: any = [];
  currentReport: any;
  permissions: any;
  isSearched = false;
  searchTerm: FormControl = new FormControl();

  categories = [
    { id: 1, value: "Aerospace"},
    { id: 2, value: "Agriculture"},
    { id: 3, value: "Automobile"},
    { id: 4, value: "Chemicals"},
    { id: 5, value: "Construction"},
    { id: 6, value: "Energy"},
    { id: 7, value: "Food"},
    { id: 8, value: "Healthcare"},
    { id: 9, value: "Automation"},
    { id: 10, value: "Information"},
    { id: 11, value: "Packaging"},
    { id: 12, value: "Semiconductor"},
  ];

  categoryKeywords: { [key: string]: string[] } = {
    aerospace: ['aerospace'],
    agriculture: ['Agriculture'],
    automobile: ['automobile', 'car', 'vehicle'],
    chemicals: ['chemicals', 'chemistry', 'chemical'],
    construction: ['construction', 'building', 'architecture'],
    energy: ['energy', 'power', 'electricity'],
    food: ['food', 'nutrition', 'diet'],
    healthcare: ['healthcare', 'health', 'medical'],
    automation: ['automation', 'robotics', 'automated'],
    information: ['information', 'data', 'knowledge'],
    packaging: ['packaging', 'package', 'container'],
    semiconductor: ['semiconductor', 'chip', 'microchip']
  };

  industryReports = false;
  companies = false;
  chartsAndStatastics = false;
  dataTables = false;
  newsAndUpdates = false;
  videos = false;

  subscriptionMessage = SubscriptionMessages.FEATURE_NOT_AVAILABLE;

  constructor(
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public activatedRoute: ActivatedRoute,
    private tostr: ToastrService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.currentReport = this.localStorageService.get(
      ConstantKeys.CURRENT_REPORT
    );
    this.getGroupedReports();
    const permissions = this.authService.getUserPermissions();
    this.permissions = permissions;
    // @ts-ignore
    this.isSubscribed = !!( permissions && permissions.pdfOpen && permissions.wordOpen
    );

  }

  ReportTitle: any;

  async getGroupedReports() {
    try {
      this.spinner.show();
      const response = await this.reportService.getAllGroupedReports().toPromise();
      if (response && response.data) {
        this.reportGroups = response.data;
        // console.log("this.reportGroups",this.reportGroups)
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      this.spinner.hide();
    }
  }

  isReportInCategory(report: any, categoryValue: string): boolean {
    const lowercaseCategory = categoryValue.toLowerCase();
    const lowercaseTitle = report.title.toLowerCase();
    const keywords = this.categoryKeywords[lowercaseCategory];
    const regexPattern = new RegExp(`\\b(${keywords.map(keyword => keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'i');
    return regexPattern.test(lowercaseTitle);
  }

  visitPdf(reportId,pdfLink){
    this.router.navigateByUrl(`/view-pdf/${reportId}`)
  }

  onReportSelect(id) {
    this.spinner.show();
    this.reportService.getById(id).subscribe(
      data => {
        if (data) {
          this.localStorageService.set(ConstantKeys.CURRENT_REPORT, data);
          this.router.navigate(['market-estimation'],{queryParams:{reportId:data._id}});
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.tostr.error(error.error.message);
      });
  }

  searchReports() {
    this.isSearched = true;
    this.spinner.show();
    this.reportService.getSearchReportsByName(this.searchText).subscribe(data => {
      if (data && data[`data`]) {
        this.reports = data[`data`];
        this.reports.forEach(item => {
          if(!item.title.toLowerCase().includes('market')) {
            item.title = item.title + ' Market';
          }
        });
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  search() {
    this.spinner.show();
    if (this.searchTerm.value.trim()) {
      this.searchReports();
    } else {
      this.getGroupedReports();
    }
    // this.router.navigate([`top-bar-charts`], {
    //   queryParams: {
    //     searchText: this.searchTerm.value,
    //     industryReports: this.industryReports,
    //     companies: this.companies,
    //     chartsAndStatastics: this.chartsAndStatastics,
    //     dataTables: this.dataTables,
    //     newsAndUpdates: this.newsAndUpdates,
    //     videos: this.videos
    //   }
    // });
  }

}

