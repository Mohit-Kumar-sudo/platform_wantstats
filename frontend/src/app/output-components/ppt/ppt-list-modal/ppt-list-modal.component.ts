import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  SubscriptionMessages,
  ConstantKeys,
} from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-ppt-list-modal',
  templateUrl: './ppt-list-modal.component.html',
  styleUrls: ['./ppt-list-modal.component.scss'],
})
export class PptListModalComponent implements OnInit {
  currentUser: any;
  activityList: any = {
    reportIds: [],
    charts: [],
  };
  subscriptionMessage = SubscriptionMessages.FEATURE_NOT_AVAILABLE;
  isSubscribed: any;
  loadingIndicator: any;
  errorMessage: string = '';
  limit: string | number;
  page: string | number;
  reportsInCart: any[] = [];
  permissions: any;
  errorChartMessage: string = '';
  
  images: string[] = [
    '../../../assets/images/ppts/Chart.png',
    "../../../assets/images/ppts/Chart1.png",
    '../../../assets/images/ppts/Chart2.png',
    '../../../assets/images/ppts/Chart3.png',
    '../../../assets/images/ppts/Chart4.png',
    '../../../assets/images/ppts/Chart5.png',
    '../../../assets/images/ppts/Chart6.png'
  ]

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    const permissions = this.authService.getUserPermissions();
    this.permissions = permissions;
    this.getActivity();
  }

  getRandomImage(images) {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  getActivity() {
    this.historyService.getReportsList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.activityList = res.data[0];
          if (this.activityList.charts.length === 0) {
            this.spinner.hide();
            this.errorChartMessage =
              'You do not have any charts in your account yet';
          }
          this.activityList.charts.map((item: any) => {
            if (item) {
              item.image = this.getRandomImage(this.images);
            }
          });
        }
      },
      (error) => {
        this.spinner.hide();
        this.tostr.error(error.error.message);
      }
    );
  }
  
  navigateToChartsAndStatistics(chart) {
    this.router.navigateByUrl(chart.href);
  }
}
