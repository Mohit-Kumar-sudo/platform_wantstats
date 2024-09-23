import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReportService } from "src/app/services/report.service";
import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-premium-reports',
  templateUrl: './premium-reports.component.html',
  styleUrls: ['./premium-reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PremiumReportsComponent implements OnInit {

  id: any;
  displayData:any;
  newData:any;

  public views = ["Description","Table of Content"];
  public view: any;

  constructor(
    private routes: ActivatedRoute,
    private reportService: ReportService,
  ) {
    this.routes.params.subscribe((param: any) => {
      if (param) {
        this.id = param.id;
        if (this.id) {
          this.reportService
            .getPremiumReports(this.id)
            .subscribe((res) => {
              this.displayData = res[0].displaydata.map(o => {
                return {
                  title:o[0],
                  description:o[1],
                  table:o[2]
                }
              })
              this.newData = this.displayData[0]
              this.view = this.views[0];
            })
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
