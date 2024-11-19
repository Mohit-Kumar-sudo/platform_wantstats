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
  errorMessage: string | null = null;

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
                  title:this.cleanString(o[0]),
                  description:this.cleanString(o[1]),
                  table:this.cleanString(o[2])
                }
              })
              this.newData = this.displayData[0]
              console.log("this.newData",this.newData)
              this.checkDataValidity();
              this.view = this.views[0];
            })
        }
      }
    });
  }

  ngOnInit(): void {
  }
  private cleanString(input: any): string {
    if (typeof input === 'string') {
      return input.replace(/\\r\\n|\\n|\\r|\\t|---|"|""|'/g, '').trim(); // Removes all forms of line breaks and tabs
    }
    return input;
  }
  private checkDataValidity(): void {
    if (!this.newData || !this.newData.description || !this.newData.table) {
      this.errorMessage = 'Description or Table of Content data is unavailable, Please check again later.';
    } else {
      this.errorMessage = null;
    }
  }

}
