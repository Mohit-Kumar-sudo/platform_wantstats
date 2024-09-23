import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportService } from 'src/app/services/report.service';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  searchText = '';
  report:string;
  appItems = [];
  currentUrl = '';
  isChartResults = false;
  isMarquee :Boolean;
  currentReport: any;
  isLoggedIn: any;

  constructor(public router: Router,
    private location: Location,
    public toastr: ToastrService,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedAnalyticsService : SharedAnalyticsService,
    private authService: AuthService) {
    this.sharedAnalyticsService.setReload(true)
    this.initializeComponent()
  }

  process() {
    if (this.currentReport) {
      this.currentUrl = this.location.path();
      this.isChartResults = this.getLocationResult();
      this.router.events.subscribe((val) => {
        this.currentUrl = this.location.path();
        this.isChartResults = this.getLocationResult();
      });
    }
  }

  getLocationResult() {
    return (this.currentUrl.includes('chart-results') || this.currentUrl.includes('output-charts-and-statistics') ||
      this.currentUrl.includes('output-chart/api-search') ||
      this.currentUrl.includes('output-chart/youtube') ||
      this.currentUrl.includes('output-chart/sec-edgar') ||
      this.currentUrl.includes('stocks') ||
      this.currentUrl.includes('login') ||
      this.currentUrl.includes('output-chart/leads-data') ||
      this.currentUrl.includes('output-chart/leads-db')) ||
      this.currentUrl.includes('LeadDb-Page') ||
      this.currentUrl.includes('LeadDb-List') ||
      this.currentUrl.includes('MyArchive-Page') ||
      this.currentUrl.includes('industry-reports') ||
      this.currentUrl.includes('Categorywise-reports') ||
      this.currentUrl.includes('top-bar-cp') ||
      this.currentUrl.includes('covid-impact') ||
      this.currentUrl.includes('top-bar-charts') ||
      this.currentUrl.includes('top-bar-tables') ||
      this.currentUrl.includes('twitter') ||
      this.currentUrl.includes('selfservice') ||
      this.currentUrl.includes('view-pdf') ||
      this.currentUrl.includes('premium-reports') ||
      this.currentUrl.includes('register') ||
      this.currentUrl.includes('createreport');
  }

  navigate(link, menu = null) {
    if (menu && menu.segmentItems) {
      this.router.navigate([link], { queryParams: { segmentId: menu.segmentItems[0].id } });
    } else {
      this.router.navigateByUrl(link);
    }
  }

  getReportMenuItems(reportId) {
    this.reportService.getReportMenuItems(reportId).subscribe(data => {
      if (data && data.data && data.data.finalMenuData && data.data.finalMenuData.length) {
        this.appItems = data.data.finalMenuData;
        const segMents = _.find(data.data.finalMenuData, (o) => {
          return o.label == 'Top Players';
        });
        if (segMents) {
          this.localStorageService.set(ConstantKeys.CP, segMents);
        }
        window.scroll(0,0);
      } else {
        this.router.navigateByUrl('/');
        this.toastr.error('Report is empty, please select another report');
      }
    });
  }

  ngOnInit() {
    this.authService.isLogin.subscribe(d => {
      this.isLoggedIn = d
    })
    this.isMarquee=true;
  }

  initializeComponent(){
    if(this.sharedAnalyticsService.getReload()){
      this.sharedAnalyticsService.setReload(false)
      this.isLoggedIn = this.authService.isAuthenticated();
      if (this.activatedRoute.snapshot.queryParams['reportId']) {
        this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
        if (this.currentReport) {
          this.getReportMenuItems(this.currentReport._id);
          this.process();
        }
      } else {
        this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
        if (this.currentReport) {
          this.getReportMenuItems(this.currentReport._id);
          this.process();
        } else {
          this.isChartResults = true;
        }
      }
    }
    setTimeout(() => {
      this.initializeComponent()
    }, 1000);
  }

  getCurrentReport() {
    if (!this.currentReport) {
      this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
      if (this.currentReport) {
        this.getReportMenuItems(this.currentReport._id);
        this.process();
      }
    }
    return this.currentReport;
  }

}

