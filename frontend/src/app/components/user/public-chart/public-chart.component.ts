import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-public-chart',
  templateUrl: './public-chart.component.html',
  styleUrls: ['./public-chart.component.scss']
})
export class PublicChartComponent implements OnInit {
  charts: any = [];
  reportId = '';
  chartId = '';
  chartTitle = '';

  constructor(private reportService: ReportService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.reportId = this.activatedRoute.snapshot.queryParams.reportId;
    this.chartId = this.activatedRoute.snapshot.queryParams.chartId;
    this.getReportChartDataById();
  }

  getReportChartDataById() {
    this.reportService.getReportChartDataById(this.reportId).subscribe(data => {
      if (data && data.data && data.data.length) {
        this.charts = data.data[0].titles;
        this.chartTitle = _.find(this.charts, ['id', this.chartId]).title;
      }
    });
  }


}
