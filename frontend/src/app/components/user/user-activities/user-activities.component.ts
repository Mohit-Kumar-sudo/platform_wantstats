import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  ConstantKeys,
  SubscriptionMessages,
} from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent implements OnInit {
  currentUser: any;
  activityList: any = {
    reportIds:[],
    charts:[]
  };
  subscriptionMessage = SubscriptionMessages.FEATURE_NOT_AVAILABLE;
  isSubscribed: any;
  loadingIndicator: any;
  errorMessage: string = '';
  limit: string | number;
  page: string | number;
  reportsInCart: any[] = [];
  permissions:any;
  errorChartMessage: string = '';


  constructor(
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private tostr: ToastrService
  ) {
  }

  ngOnInit(): void {
    const permissions = this.authService.getUserPermissions();
    this.permissions = permissions
    this.getActivity();
  }

  getActivity() {
    this.historyService.getReportsList().subscribe(
      (res:any) => {
        if (res && res.data) {
          this.activityList = res.data[0];
          this.activityList.reportIds.forEach((item) => {
            item.title = this.modifyTitle(item.title);
          });
          if (this.activityList.reportIds.length === 0) {
            this.spinner.hide();
            this.errorMessage = 'You do not have any reports in your account yet';
          } else {
            // Modify report titles
            this.activityList.reportIds.forEach((item) => {
              item.title = this.modifyTitle(item.title);
            });
          }
        } 
      },
      (error) => {
        this.spinner.hide();
        this.tostr.error(error.error.message);
      }
    );
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

  visitPdf(reportId, pdfLink) {
    this.router.navigateByUrl(`/view-pdf/${reportId}`);
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

  onReportDelete(report) {
    this.activityList.reportIds = this.activityList.reportIds.filter(
      (repo: any) => repo._id !== report
    );
    let newReportList = this.activityList.reportIds.map((id: any) => {
      return id._id;
    });
    this.historyService.updateReport(newReportList).subscribe((res:any) => {
      if(res.data){
        this.getActivity()
      } else {
        this.tostr.warning('Something went wrong please try again')
      }
    });
  }

}
