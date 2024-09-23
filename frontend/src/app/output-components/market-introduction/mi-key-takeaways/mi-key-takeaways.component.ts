import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ReportService} from 'src/app/services/report.service';
import {ReportSectionService} from 'src/app/services/report-section.service';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import {ReportDataElement} from 'src/app/models/secondary-research-models';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {CommonChartContainerComponent} from '../../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { SecondaryOutputModel } from 'src/app/models/competitive-secondary-output-model';
import {NgxSpinnerService} from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-key-takeaways',
  templateUrl: './mi-key-takeaways.component.html',
  styleUrls: ['./mi-key-takeaways.component.scss']
})
export class MiKeyTakeawaysComponent implements OnInit {

  reportData: ReportDataElement[];
  secondaryOutputModel: SecondaryOutputModel;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private reportService: ReportService,
    private authService: AuthService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService
  ) {
  }

  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  openD: any;

  driverList = [];
  emptyList = [];
  compareList = ['Drivers', 'Restraints', 'Opportunities', 'Challenges', 'Trends'];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';
  permissions: any;

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.spinner.show();
    this.getReportDetails();
  }

  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;

  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    // const currentReport = JSON.parse('{"_id":"5d95c79343759d0004219d04","status":"NOT STARTED","title":"1111 report demo","category":"tech","vertical":"SEMI","me":{"start_year":2016,"end_year":2019,"base_year":2018},"tocList":[{"section_id":"1","section_name":"MARKET ESTIMATION","section_key":"MARKET_ESTIMATION","urlpattern":"market-estimation","is_main_section_only":false},{"section_id":"2","section_name":"EXECUTIVE SUMMARY","section_key":"EXECUTIVE_SUMMARY","urlpattern":"executive-summary","is_main_section_only":true},{"section_id":"3","section_name":"MARKET INTRODUCTION","section_key":"MARKET_INTRODUCTION","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"4","section_name":"RESEARCH METHODOLOGY","section_key":"RESEARCH_METHODOLOGY","urlpattern":"research-methodology","is_main_section_only":true},{"section_id":"5","section_name":"MARKET DYNAMICS","section_key":"MARKET_DYNAMICS","urlpattern":"market-introduction","is_main_section_only":false},{"section_id":"6","section_name":"MARKET FACTOR ANALYSIS","section_key":"MARKET_FACTOR_ANALYSIS","urlpattern":"market-factor-analysis","is_main_section_only":false},{"section_id":"7","section_name":"MARKET OVERVIEW","section_key":"MARKET_OVERVIEW","urlpattern":"market-overview","is_main_section_only":false},{"section_id":"8","section_name":"COMPETITIVE LANDSCAPE","section_key":"COMPETITIVE_LANDSCAPE","urlpattern":"competitive-landscape","is_main_section_only":false},{"section_id":"9","section_name":"COMPANY PROFILES","section_key":"COMPANY_PROFILES","urlpattern":"company-profile","is_main_section_only":false},{"section_id":0,"section_name":"ABC","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"XYZ","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D1","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D2","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D3","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"D4","is_main_section_only":true,"urlpattern":"other-module"},{"section_id":0,"section_name":"AS","is_main_section_only":true,"urlpattern":"other-module"}],"owner":"5cd66952c2ee07f440988b60"}');
    const sectionData = this.localStorageService.get(ConstantKeys.CURRENT_SECTION);
    // const sectionData = JSON.parse('{"main_section_id":"4","is_main_section_only":false,"actual_section_id":"1","section_id":"4.1","section_pid":"4","section_name":"Definition","meta_info":{"section_key":"introduction","section_value":"Introduction"}}')
    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;

    this.reportService.getSectionKeyDetials(this.reportId, 'MARKET_INTRODUCTION').subscribe(d => {
      this.getReportDetailsSuccess(d);
      window.scroll(0,0)
    }, error => {
      console.log('error', error);
    });
  }

  generateImage(data) {
    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    if (data === 'PIE') {
      // @ts-ignore
      html2canvas(this.screenPie.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Pie Chart.png';
        this.downloadLink.nativeElement.click();
      });
    } else if (data === 'BAR') {
      // @ts-ignore
      html2canvas(this.screenBar.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Bar Chart.png';
        this.downloadLink.nativeElement.click();
      });
    } else if (data === 'IMAGE') {
      // @ts-ignore
      html2canvas(this.screenImg.nativeElement).then(canvas => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = 'Image.png';
        this.downloadLink.nativeElement.click();
      });
    }
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      data: data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getReportDetailsSuccess(data: any) {
    if (data && data.length) {
      data.forEach(d => {
        if (d.meta_info.section_key === 'takeways') {
          this.secondaryOutputModel = {
            mainData : this.reportSectionService.convertToReportDataElement(d.content),
            reportName : this.reportName,
            startYear : this.startYear,
            endYear : this.endYear,
            reportId : this.reportId,
            heading : "Key takeaways, Market Introduction"
          }
        }
        this.emptyList.push(d.section_name);
        this.emptyList = _.uniq(this.emptyList);
      });

      this.emptyList = _.remove(this.emptyList, (n) => {
        return n !== 'MARKET DYNAMICS';
      });

      this.compareList.forEach((key) => {
        let found = false;
        this.emptyList = this.emptyList.filter((item) => {
          // tslint:disable-next-line:triple-equals
          if (!found && item == key) {
            this.driverList.push(item);
            found = true;
            return false;
          } else {
            return true;
          }
        });
      });
    } else {
      this.routes.navigate(['']);
    }
    this.spinner.hide();
  }

  OnClickDriver(data) {
    if (data === 'Drivers') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Restraints') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Opportunities') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Challenges') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    } else if (data === 'Trends') {
      this.routes.navigate([`droctcontainer`], {queryParams: {id: this.reportId, 'type': data, 'sectKey': 'MARKET_DYNAMICS'}});
    }
  }

  ngAfterViewInit() {
    // document.querySelector('#scroll').scrollIntoView();
  }
}
