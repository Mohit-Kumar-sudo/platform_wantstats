import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {LocalStorageService} from 'src/app/services/localstorage.service';
import {ConstantKeys} from 'src/app/constants/mfr.constants';
import {companyProfileService} from 'src/app/services/companyprofile.service';
import {MatDialog} from '@angular/material/dialog';
import {OutputProductOfferingDialogComponent} from '../output-product-offering-dialog/output-product-offering-dialog.component';

declare var $: any;
declare var JSONLoop: any;
import * as html2canvas from 'html2canvas';
import {SharedAnalyticsService} from 'src/app/services/shared-analytics.service';
import {Router, ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-output-product-offering',
  templateUrl: './output-product-offering.component.html',
  styleUrls: ['./output-product-offering.component.scss']
})
export class OutputProductOfferingComponent implements OnInit {

  currentReport: any;
  currentCompany: any;
  data: any;
  topEmployee: any;
  treeData: any = [];
  zoom: number = 0;

  analyzeData: any;
  reportId = '';
  cmpId: any;
  datasource: any;
  orgData: any = [];
  flag: number = 0;
  permissions: any;

  constructor(
    private localStorageService: LocalStorageService,
    private companyProfileService: companyProfileService,
    private dialog: MatDialog,
    private authService: AuthService,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private paramRoute: ActivatedRoute,
  ) {
  }


  @ViewChild('screen') screenPie: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  ngOnInit() {
    $.ready;
    $('#chart-container').empty();
    this.paramRoute.queryParams.subscribe(params => {
      this.cmpId = params['segmentId'] || params['companyId'];
      this.getReportDetails();
    });
    this.permissions = this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: 'Product/Services offering',
      subSegmentSelected: ''
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  getReportDetails() {
    // this.spinner.show();
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    this.reportId = this.currentReport._id;
    this.companyProfileService.getCompanyAllDetails(this.cmpId, 'product_offering,company_name').subscribe(d => {
      if (d) {
        this.data = d;
        this.currentCompany = d;
        this.orgCharts();
        window.scroll(0,0)
      }
    });
  }

  orgCharts() {
    this.flag = 0;
    this.orgData = [];
    $('#chart-container').empty();
    let temporaryThis = this;
    (function($, JSONLoop) {

      $(function() {
        temporaryThis.datasource = {
          'name': temporaryThis.currentCompany.company_name,
          'id': '1',
          parentId: null,
          relationship: null,
          level: 0
        };
        temporaryThis.data.product_offering.forEach(function(item, index) {
          if (!item.parentId) {
            delete item.parentId;
            Object.assign(temporaryThis.datasource, item);
          } else {
            var jsonloop = new JSONLoop(temporaryThis.datasource, 'id', 'children');
            jsonloop.findNodeById(temporaryThis.datasource, item.parentId, function(err, node) {
              if (err) {
                temporaryThis.flag = 1;
                console.error(err);
              } else {
                delete item.parentId;
                if (node.children) {
                  node.children.push(item);
                  var b = 2;
                } else {
                  node.children = [item];
                  var a = 1;
                }
              }
            });
          }
        });
        var getId = function() {
          return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
        };

        var oc = $('#chart-container').orgchart({
          'data': temporaryThis.datasource,
          'chartClass': 'edit-state',
          'zoom': true,
          'pan': true,
          'parentNodeSymbol': 'fa-th-large',
          'createNode': function($node, data) {
            temporaryThis.orgData.push(data);
          }
        });
        if (temporaryThis.flag) {
          temporaryThis.onSubmitInfo();
        }
      });

    })($, JSONLoop);
  }

  generateImage() {
  if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screenPie.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'product offering.png';
      this.downloadLink.nativeElement.click();
    });
  }

  openDialog() {
    let data = {
      datasource: this.datasource,
      company_name: this.currentCompany.company_name
    };
    const dialogRef = this.dialog.open(OutputProductOfferingDialogComponent, {
      width: '99%',
      data: data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  zoomin() {
    this.zoom = this.zoom + 1;
    if (this.zoom <= 9) {
      var GFG = document.getElementById('chart-container').style.transform = `scale(1.${this.zoom})`;
    }
  }

  zoomout() {
    if (this.zoom >= 0) {
      this.zoom = this.zoom - 1;
      var GFG = document.getElementById('chart-container').style.transform = `scale(1.${this.zoom})`;
    }
  }

  onSubmitInfo() {
    this.orgData.map(d => {
      if (d.children) {
        delete d.children;
      }
    });

    this.companyProfileService.saveCompanyProductOffering(this.currentCompany._id, this.orgData).subscribe(
      resp => {
        console.log('Company Produce Offering saved successfully');
      },
      err => {
        console.error('Error occured while saving Company Produce Offering');
      }
    );
  }
}
