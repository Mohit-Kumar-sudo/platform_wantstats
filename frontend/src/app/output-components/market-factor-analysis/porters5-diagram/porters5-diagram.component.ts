import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ConstantKeys} from '../../../constants/mfr.constants';
import {LocalStorageService} from '../../../services/localstorage.service';
import {ReportService} from '../../../services/report.service';
import * as _ from 'lodash';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as html2canvas from 'html2canvas';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-porters5-diagram',
  templateUrl: './porters5-diagram.component.html',
  styleUrls: ['./porters5-diagram.component.scss']
})
export class Porters5DiagramComponent implements OnInit {

  threatOfNewEntrantsRating: any = [];
  bargainingPowerOfSuppliersRating: any = [];
  threatOfSubstitutesRating: any = [];
  bargainingPowerOfBuyersRating: any = [];
  segmentRivalryRating: any = [];
  portersModules: any;
  modulesData = [{
    bargainingPowerOfBuyersRating: 0,
    bargainingPowerOfSuppliersRating: 0,
    name: '',
    segmentRivalryRating: 0,
    threatOfNewEntrantsRating: 0,
    threatOfSubstitutesRating: 0
  }];
  reportName: any;
  result: any;
  impact: any;
  threats: string;
  suppliers: string;
  segments: string;
  buyers: string;
  substitutes: string;
  conclusion: any;
  endYear: number;
  startYear: number;
  analyzeData:any;
  reportId = "";

  constructor(
    public dialogRef: MatDialogRef<Porters5DiagramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private reportService: ReportService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router
  ) {
  }


  @ViewChild('porters') porters: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  permissions: any;

  ngOnInit() {
    this.permissions= this.authService.getUserPermissions();
    this.getReportDetails();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "Porter's 5",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
    this.doClose();
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    const sectionData = this.localStorageService.get(ConstantKeys.CURRENT_SECTION);
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    this.reportService.getSectionKeyDetials(currentReport._id, 'MARKET_FACTOR_ANALYSIS').subscribe(d => {
      this.getReportDetailsSuccess(d);
     window.scroll(0,0)
    }, error => {
      console.log('error', error);
    });
  }

  getReportDetailsSuccess(data: any) {
    data.forEach(d => {
      if (d.meta_info.section_key === 'porter') {
        this.getPortersDataSuccess(d.meta);
        if (d.content) {
          this.conclusion = d.content[0].data.content;
        }
      }
    });
    // this.spinner.hide();
  }

  getPortersDataSuccess(data) {
    if (data && data.data) {
      this.result = data.data;
      this.impact = data.impact;

      this.result.filter(item => {
        let obj = {
          name: _.upperFirst(_.toLower(item.name)),
          type: item.type,
          rating: item.rating
        };
        if (item.rating != 0) {
          if (item.type == 'Threat of New Entrants') {
            this.threatOfNewEntrantsRating.push(obj);
          } else if (item.type == 'Bargaining Power of Suppliers') {
            this.bargainingPowerOfSuppliersRating.push(obj);
          } else if (item.type == 'Threat of Substitutes') {
            this.threatOfSubstitutesRating.push(obj);
          } else if (item.type == 'Bargaining Power of Buyers') {
            this.bargainingPowerOfBuyersRating.push(obj);
          } else if (item.type == 'Segment Rivalry') {
            this.segmentRivalryRating.push(obj);
          }
        }
      });
      if (this.impact && this.impact.length) {
        this.impact.forEach(element => {
          if (element.name == 'Threat of New Entrants') {
            this.threats = element.impact;
            this.modulesData[0].threatOfNewEntrantsRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Bargaining Power of Suppliers') {
            this.suppliers = element.impact;
            this.modulesData[0].bargainingPowerOfSuppliersRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Threat of Substitutes') {
            this.substitutes = element.impact;
            this.modulesData[0].threatOfSubstitutesRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Bargaining Power of Buyers') {
            this.buyers = element.impact;
            this.modulesData[0].bargainingPowerOfBuyersRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          } else if (element.name == 'Segment Rivalry') {
            this.segments = element.impact;
            this.modulesData[0].segmentRivalryRating = element.impact == 'high' ? 8 : element.impact == 'medium' ? 5 : 2;
          }
        });
      } else {
        let threatOfNewEntrantsRatingSum = 0;
        this.threatOfNewEntrantsRating.forEach((e) => {
          threatOfNewEntrantsRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].threatOfNewEntrantsRating = threatOfNewEntrantsRatingSum / this.threatOfNewEntrantsRating.length;

        let bargainingPowerOfSuppliersRatingSum = 0;
        this.bargainingPowerOfSuppliersRating.forEach((e) => {
          bargainingPowerOfSuppliersRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].bargainingPowerOfSuppliersRating = bargainingPowerOfSuppliersRatingSum / this.bargainingPowerOfSuppliersRating.length;

        let bargainingPowerOfBuyersRatingSum = 0;
        this.bargainingPowerOfBuyersRating.forEach((e) => {
          bargainingPowerOfBuyersRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].bargainingPowerOfBuyersRating = bargainingPowerOfBuyersRatingSum / this.bargainingPowerOfBuyersRating.length;


        let threatOfSubstitutesRatingSum = 0;
        this.threatOfSubstitutesRating.forEach((e) => {
          threatOfSubstitutesRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].threatOfSubstitutesRating = threatOfSubstitutesRatingSum / this.threatOfSubstitutesRating.length;


        let segmentRivalryRatingSum = 0;
        this.segmentRivalryRating.forEach((e) => {
          segmentRivalryRatingSum += parseInt(e.rating);
        });
        this.modulesData[0].segmentRivalryRating = segmentRivalryRatingSum / this.segmentRivalryRating.length;

        this.modulesData[0].name = this.reportName;

        this.portersModules = this.modulesData;

        this.threats = (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating <= 10) ?
          (this.modulesData[0].threatOfNewEntrantsRating >= 4 && this.modulesData[0].threatOfNewEntrantsRating < 8) ? 'medium' : 'high' : 'low';

        this.suppliers = (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating <= 10) ?
          (this.modulesData[0].bargainingPowerOfSuppliersRating >= 4 && this.modulesData[0].bargainingPowerOfSuppliersRating < 8) ? 'medium' : 'high' : 'low';

        this.segments = (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating <= 10) ?
          (this.modulesData[0].segmentRivalryRating >= 4 && this.modulesData[0].segmentRivalryRating < 8) ? 'medium' : 'high' : 'low';

        this.buyers = (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating <= 10) ?
          (this.modulesData[0].bargainingPowerOfBuyersRating >= 4 && this.modulesData[0].bargainingPowerOfBuyersRating < 8) ? 'medium' : 'high' : 'low';

        this.substitutes = (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating <= 10) ?
          (this.modulesData[0].threatOfSubstitutesRating >= 4 && this.modulesData[0].threatOfSubstitutesRating < 8) ? 'medium' : 'high' : 'low';
      }
    }
  }

  generatePortersImage() {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.porters.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'porters.png';
      this.downloadLink.nativeElement.click();
    });
  }

  doClose() {
    this.dialogRef.close();
  }
}
