import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ConstantKeys} from '../../../constants/mfr.constants';
import {LocalStorageService} from '../../../services/localsotrage.service';

@Component({
  selector: 'app-public-chart',
  templateUrl: './public-token-login.component.html',
  styleUrls: ['./public-token-login.component.scss']
})
export class PublicTokenLoginComponent implements OnInit {
  charts: any = [];
  reportId = '';
  chartId = '';
  chartTitle = '';

  constructor(private reportService: ReportService,
              private authService: AuthService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reportId = this.activatedRoute.snapshot.queryParams.reportId;
    if (this.activatedRoute.snapshot.queryParams.token) {
      this.authService.setToken(this.activatedRoute.snapshot.queryParams.token);
      this.reportService.getById(this.activatedRoute.snapshot.queryParams.reportId).subscribe(data => {
        if (data) {
          this.localStorageService.set(ConstantKeys.CURRENT_REPORT, data);
          this.router.navigate(['market-estimation'], {queryParams: {reportId: this.reportId}});
        }
      });
    }
  }
}
