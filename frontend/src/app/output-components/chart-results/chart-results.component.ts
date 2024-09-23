import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonChartContainerComponent } from '../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { SubscriptionMessages } from 'src/app/constants/mfr.constants';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {
  barChartOptions,
  barChartPlugins,
  barChartLegend,
  barChartType,
} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelDownloadService } from 'src/app/services/excel-download.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { PptService } from 'src/app/services/ppt.service';
import { ReportService } from 'src/app/services/report.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { WhatsappService } from 'src/app/services/whatsapp.service';
import { companyProfileService } from 'src/app/services/companyprofile.service';
import { HttpEventType } from '@angular/common/http';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chart-results',
  templateUrl: './chart-results.component.html',
  styleUrls: ['./chart-results.component.scss'],
})
export class ChartResultsComponent implements OnInit {
  companyName = '';
  currentCompanyData: any;
  industryReports = false;
  companies = false;
  chartsAndStatastics = false;
  dataTables = false;
  newsAndUpdates = false;
  videos = false;
  currentTab: any = { key: '', value: '', report: null };
  pagination: any;
  companyId: any = '';
  videosData = [];
  currentUrl = '';
  reportsData: any = [];
  newsAndUpdatesData: any = [];
  leftMenuData: any = [];
  finalData: any;
  chartOptions: any;
  chartType: any = 'bar';
  chartLegend: any;
  chartPlugins: any;
  chartLabels: any;
  permissions: any;
  showMessage: boolean = false;
  errorMessage: string = '';
  params: any;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  imageFile: any;
  chartsList: any = {};

  constructor(
    public activatedRoute: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService,
    private pptService: PptService,
    private whatsappService: WhatsappService,
    private spinner: NgxSpinnerService,
    private companyProfileService: companyProfileService,
    private localStorageService: LocalStorageService,
    private excelDownloadService: ExcelDownloadService,
    private sharedInteconnectService: SharedInteconnectService,
    private reportService: ReportService,
    private accessService: HistoryService
  ) {
    this.chartOptions = barChartOptions;
    this.chartPlugins = barChartPlugins;
    this.chartLegend = barChartLegend;
    this.chartType = barChartType;
    this.chartOptions.scales.xAxes[0].stacked = false;
    this.chartOptions.scales.yAxes[0].stacked = false;
    this.params = this.activatedRoute.snapshot.queryParams;
    if (this.activatedRoute.snapshot.queryParams['companyId']) {
      this.companyId = this.activatedRoute.snapshot.queryParams['companyId'];
      this.currentUrl = this.location.path();
      this.getReportsForCompany();
    }
  }

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
    this.sharedInteconnectService.nextText('');
    this.spinner.show();
    this.getReportAccess();
    // this.params = this.activatedRoute.snapshot.queryParams;
    // if (this.activatedRoute.snapshot.queryParams.companyId) {
    //   this.companyId = this.activatedRoute.snapshot.queryParams.companyId;
    //   this.currentUrl = this.location.path();
    //   this.getReportsForCompany();
    // }

    setTimeout(() => {
      this.showMessage = true;
    }, 2000);
    this.activatedRoute.queryParams.subscribe((result) => {
      // this.params = this.activatedRoute.snapshot.queryParams;
      this.currentUrl = this.location.path();
      this.spinner.show();
      this.getDataByResult(result);
    });
  }

  getReportAccess() {
    this.accessService.getReportsList().subscribe((res: any) => {
      if (res) {
        this.chartsList = res.data[0];
        if (this.chartsList == undefined) {
          this.chartsList = {
            reportIds: [],
            charts: [],
          };
        }
      } else {
        this.toastr.warning('Something went wrong please try again');
      }
    });
  }
  addSlideToPPT(name, currentTab) {
    let newData = {
      title: name,
      currentTab: currentTab,
      href:this.currentUrl
    }
    this.chartsList.charts.push(newData)
    this.accessService.addCharts(this.chartsList).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Chart added to focus area successfully.');
      } else {
        this.toastr.error('Failed to add chart to focus area.');
      }
    });
  }

  downloadPpt(data) {
    data.metaDataValue = {
      source: 'Wantstats',
      title: `${this.currentCompanyData.company_name}, ${
        this.currentTab.value
      } ${this.currentTab.id ? ', by ' + this.currentTab.id : ''}`,
    };
    const chartData = {
      type: 'BAR',
      data: data,
    };
    this.pptService.downloadPPT(chartData);
  }

  downLoadCSV() {
    this.finalData.metaDataValue = {
      source: 'Wantstats',
      title: `${this.currentCompanyData.company_name}, ${
        this.currentTab.value
      } ${this.currentTab.id ? ', by ' + this.currentTab.id : ''}`,
    };
    const data = { data: this.finalData };
    this.excelDownloadService.downloadExcel(data);
  }

  sendChartToWhatsApp() {
    alert(SubscriptionMessages.FEATURE_NOT_AVAILABLE);
    return;
    this.spinner.show();
    const phone = this.localStorageService.get('CURRENT_USER_PHONE');
    this.whatsappService.sendWhatsAppMessage(phone).subscribe((d) => {
      this.spinner.hide();
      this.toastr.success('Chart sent to WhatsApp successfully', 'Message');
    });
  }

  generateImage(data) {
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('');
      this.downloadLink.nativeElement.download = 'Chart';
      this.downloadLink.nativeElement.click();
    });
  }

  getDataByResult(result) {
    this.currentTab.value = result.menu;
    this.currentTab.key = result.key;
    this.currentTab.id = result.id;
    this.spinner.show();
    if (this.currentTab.key == 'product_offering') {
      this.getCompanyDetailsForPO(result);
    } else if (this.currentTab.key == 'financial_overview') {
      this.getCompanyDetailsForFO(result);
    } else {
      this.getCompanyReportDetailsById(result);
    }
  }

  getCompanyDetailsForPO(result) {
    if (
      this.currentCompanyData &&
      result &&
      this.currentCompanyData.product_offering.length
    ) {
      this.finalData = { companyData: null, data: null };
      this.finalData.companyData = this.currentCompanyData;
      this.finalData.data = this.currentCompanyData[result.key];
    }
    this.spinner.hide();
  }

  getCompanyDetailsForFO(result) {
    if (
      result &&
      this.currentCompanyData &&
      this.currentCompanyData.financial_overview.length
    ) {
      const keyData = this.currentCompanyData[result.key];
      this.chartOptions.scales.yAxes[0].scaleLabel.labelString = keyData.length
        ? keyData[0].currency + ' ' + keyData[0].metric
        : 'USD Mn';

      const foundItem = _.find(keyData, ['key', result.id]);
      if (foundItem && foundItem.content) {
        try {
          const passingData = JSON.parse(foundItem.content);
          this.finalData = { chartData: [], data: [] };
          this.finalData.data = passingData.data;
          this.finalData.chartLabels = Object.keys(
            passingData.data.dataStore[0]
          );
          this.finalData.chartLabels = this.removeElement(
            this.finalData.chartLabels,
            'rowHeader'
          );
          this.finalData.chartLabels = this.removeElement(
            this.finalData.chartLabels,
            'content'
          );
          passingData.data.dataStore.forEach((item) => {
            const obj = { label: item.rowHeader, data: Object.values(item) };
            obj.data = this.removeElement(obj.data, item.rowHeader);
            obj.data = this.removeElement(obj.data, item.content);
            this.finalData.chartData.push(obj);
          });
        } catch (e) {
          console.error('Error parsing JSON:', e);
          this.errorMessage = 'Error parsing data';
        }
      } else {
        this.errorMessage = 'Data not available for financial overview';
      }
    } else if (
      result &&
      this.currentCompanyData &&
      this.currentCompanyData.financial_overview.length
    ) {
      this.errorMessage = 'data not available in financial overview';
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  removeElement(array, element) {
    let removeIndex = array.indexOf(element);
    if (removeIndex > -1) {
      array.splice(removeIndex, 1);
    }
    return array;
  }

  getCompanyReportDetailsById(result) {
    this.reportService
      .getReportCompanyDetailsByKeys(
        result.id,
        result.companyId,
        this.currentTab.key
      )
      .subscribe((data) => {
        this.finalData = {};
        this.currentTab.report = data.data;
        const finalData = _.find(data.data.cp, [
          'company_id',
          result.companyId,
        ]);
        if (finalData && finalData[this.currentTab.key]) {
          this.finalData = finalData[this.currentTab.key];
        }
        this.spinner.hide();
      });
  }

  getReportsForCompany() {
    this.spinner.show();
    this.companyProfileService
      .getCompanyReportsById(this.companyId)
      .subscribe((data) => {
        if (data && data.data) {
          data.data.forEach((item) => {
            item.title = item.title + ' Market';
          });
          this.leftMenuData.push({
            label: 'Company Overview',
            key: 'company_overview',
            items: data.data,
          });
          this.leftMenuData.push({
            label: 'Financial Overview',
            key: 'financial_overview',
            items: [
              { title: 'By SBU/ Company revenue', _id: 'SBU' },
              { title: 'By Vertical', _id: 'VERTICAL' },
              { title: 'By Region', _id: 'REGIONAL' },
            ],
          });
          this.leftMenuData.push({
            label: 'Product Offering',
            key: 'product_offering',
          });
          this.leftMenuData.push({
            label: 'SWOT Analysis',
            key: 'swot_analysis',
            items: data.data,
          });
          this.leftMenuData.push({
            label: 'Key Development',
            key: 'key_development',
            items: data.data,
          });
          this.leftMenuData.push({
            label: 'Strategy',
            key: 'strategy',
            items: data.data,
          });
        }
        this.getCurrentCompanyDetails();
      });
  }

  getCurrentCompanyDetails() {
    this.companyProfileService
      .getCompanyAllDetails(this.companyId, '')
      .subscribe({
        next: (data) => {
          if (data) {
            this.currentCompanyData = data;
            this.sharedInteconnectService.nextText(
              this.currentCompanyData.company_name
            );

            if (data.financial_overview.length !== 0) {
              data.financial_overview.forEach((element) => {
                if (element.content === '') {
                  this.errorMessage = 'No financial overview data available.';
                }
              });
            } else if (data.financial_overview.length == 0) {
              this.errorMessage = 'No financial overview data available';
            }else {
              this.errorMessage = 'byy'
            }
          } else {
            this.errorMessage = 'No data returned from the server.';
          }
          this.getDataByResult(this.params);
        },
        error: (err) => {
          console.error('Error fetching company details: ', err);
          this.errorMessage =
            'Error fetching company details. Please try again later.';
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  openDialog() {
    let obj = {
      type: 'BAR',
      data: {
        chartData: this.finalData.chartData,
        dataStore: this.finalData.data.dataStore,
        chartLabels: this.finalData.chartLabels,
        metaDataValue: {
          // labelX: "x",
          // labelY: "y",
          source: 'Wantstats',
          title: `${this.currentCompanyData.company_name}, ${
            this.currentTab.value
          } ${this.currentTab.id ? ', by ' + this.currentTab.id : ''}`,
        },
      },
    };
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      height: '80%',
      data: obj,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
