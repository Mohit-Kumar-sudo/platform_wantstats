import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/localstorage.service';
import {ConstantKeys} from '../../../constants/mfr.constants';
import {companyProfileService} from '../../../services/companyprofile.service';
import {ReportSectionService} from '../../../services/report-section.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReportService} from '../../../services/report.service';
import {SecEdgarApiService} from 'src/app/services/sec-edgar-api.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-output-companies',
  templateUrl: './output-companies.component.html',
  styleUrls: ['./output-companies.component.scss']
})
export class OutputCompaniesComponent implements OnInit {
  currentCompany: any;
  companyEleList: any = [];
  currentReport: any;
  companyOverview: any;
  selectEle: any;
  keyDevelopment: any;
  strategy: any;
  cmpId: any;
  swotData: any;
  appItems: any;
  topCompanies = [];
  interConnectData: any;
  reportConnectData: any;
  fillingConnectData = [];
  overlaps: any;

  constructor(
    private companyProfileService: companyProfileService,
    private localStorageService: LocalStorageService,
    private reportSectionService: ReportSectionService,
    private spinner: NgxSpinnerService,
    private routes: Router,
    private paramRoute: ActivatedRoute,
    private reportService: ReportService,
    private secEdgarService: SecEdgarApiService
  ) {
  }

  ngOnInit() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);

    if (this.currentReport.overlaps) {
      this.overlaps = this.currentReport.overlaps;

      const reportConnect = this.overlaps.filter(e => e.section_name == 'Report');

      if (reportConnect.length) {
        const dt = {
          section: '',
          data: []
        };
        if (reportConnect[0].data && reportConnect[0].data.length) {
          if (reportConnect[0].section_name) {
            dt.section = reportConnect[0].section_name;
            for (let i = 0; i < reportConnect[0].data.length && i < 2; i++) {
              dt.data.push(reportConnect[0].data[i]);
            }
          }
        }
        this.reportConnectData = dt;
      }
    }


    this.spinner.show();
    this.paramRoute.queryParams.subscribe(params => {
      this.cmpId = params['segmentId'];
      this.getCompanyDetails();
      this.getReportMenuItems(this.currentReport._id);
    });
  }

  getCompanyDetails() {
    this.spinner.show();
    this.companyProfileService.getCompanyAllDetails(this.cmpId, 'financial_overview,company_name,product_offering').subscribe(d => {
      this.getReportSpecificCPdetails();
      this.generateList(d);
      this.currentCompany = d;
      window.scroll(0,0)
      this.spinner.hide();
    });
  }

  onElementSelect(data) {
    this.selectEle = data;
    window.scroll(0,0)
  }

  generateList(data: any) {
    if (data) {
      const comp = data;
      if (comp.financial_overview && comp.financial_overview.length) {
        comp.financial_overview.forEach(d => {
          if (d && d.content && JSON.parse(d.content) && JSON.parse(d.content).data
            && JSON.parse(d.content).data.dataStore && JSON.parse(d.content).data.dataStore.length) {
            this.companyEleList.push('Financial overview');
            this.companyEleList = _.uniq(this.companyEleList);
          }
        });
      }
      if (comp.product_offering && comp.product_offering.length > 1) {
        this.companyEleList.push('Product/Service offering');
      }
    } else {
      this.routes.navigate(['output-company-profile']);
    }
    this.selectEle = this.companyEleList[0];
    this.spinner.hide();
  }

  getReportSpecificCPdetails() {
    this.companyEleList = [];
    this.reportService.getRportCpData(this.currentReport._id).subscribe(d => {
      if (d.data.cp && d.data.cp.length) {
        d.data.cp.forEach(dl => {
          if (dl.company_id === this.cmpId && dl.company_overview && dl.company_overview.length) {
            this.companyOverview = this.reportSectionService.convertToReportDataElement(dl.company_overview);
            this.companyEleList.push('Company overview');
          }
          if (dl.company_id === this.cmpId && dl.swot_analysis && dl.swot_analysis.length) {
            const values = _.flatMap(dl.swot_analysis, 'value');
            if (values && values.length) {
              this.swotData = {
                swot: dl.swot_analysis,
                company_name: this.currentCompany.company_name
              };
              this.companyEleList.push('SWOT analysis');
            }
          }
          if (dl.company_id === this.cmpId && dl.strategy && dl.strategy.length) {
            this.strategy = this.reportSectionService.convertToReportDataElement(dl.strategy);
            this.companyEleList.push('Strategy');
          }
          if (dl.company_id === this.cmpId && dl.key_development && dl.key_development.length) {
            this.keyDevelopment = this.reportSectionService.convertToReportDataElement(dl.key_development);
            this.companyEleList.push('Key development');
          }
        });
      }
      if (!this.selectEle) {
        this.selectEle = this.companyEleList[0];
      }
    });
  }

  getReportMenuItems(reportId) {
    this.reportService.getReportMenuItems(reportId).subscribe(data => {
      if (data && data.data && data.data.finalMenuData && data.data.finalMenuData.length) {
        this.appItems = data.data.finalMenuData;

        this.appItems.forEach(element => {
          if (element.label == 'Top Players') {
            element.segmentItems.forEach(ele => {
              if (ele.id != this.cmpId) {
                const comp = {
                  _id: ele.id,
                  section: 'Top Players',
                  name: ele.name
                };
                if (this.topCompanies.length < 5) {
                  this.topCompanies.push(comp);
                }
              }
            });
          }
        });

        this.interConnectData = {
          data: this.topCompanies,
          section: 'topPlayers'
        };
        // this.checkAllTopPlayers(this.topCompanies);
      }
    });
  }


  // checkAllTopPlayers(topPlayers: any) {
  //   topPlayers.forEach(element => {
  //     this.secEdgarService
  //       .getSearchResult(undefined, 'All Forms', element.name, undefined, undefined, 1)
  //       .subscribe(data => {
  //         // console.log('data', data);
  //         if (data && !data.error) {
  //           const data1 = JSON.parse(data);
  //           if (data1.data && data1.data.length) {
  //             const dt = {
  //               _id: element._id,
  //               name: element.name,
  //               section: element.section,
  //               sec_data: data1
  //             };
  //             this.fillingConnectData.push(dt);
  //           }
  //         }
  //       });
  //   });
  // }
}
