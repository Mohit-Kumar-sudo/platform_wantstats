import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { OutputProductOfferingDialogComponent } from '../../output-company-profile/output-product-offering-dialog/output-product-offering-dialog.component';
import { companyProfileService } from 'src/app/services/companyprofile.service';
declare var $: any;
declare var JSONLoop: any;
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-shared-output-product-offering',
  templateUrl: './shared-output-product-offering.component.html',
  styleUrls: ['./shared-output-product-offering.component.scss']
})
export class SharedOutputProductOfferingComponent implements OnInit {
  @Input()
  inputData: any;

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
  permissions: any;

  constructor(
    private localStorageService: LocalStorageService,
    private companyProfileService: companyProfileService,
    private dialog: MatDialog,
    private sharedAnalyticsService: SharedAnalyticsService,
    private routes: Router,
    private authService: AuthService
  ) {
  }


  @ViewChild('screen') screenPie: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  ngOnInit() {
    $.ready;

    this.permissions = this.authService.getUserPermissions();
  }

  ngOnChanges(changes: any) {
    if (changes.inputData.currentValue) {
      this.cmpId = changes.inputData.currentValue.companyData._id;
      this.getReportDetails();
    }
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
    // this.reportId = this.currentReport._id;
    this.companyProfileService.getCompanyAllDetails(this.cmpId, 'product_offering,company_name').subscribe(d => {
      if (d) {
        this.data = d;
        this.currentCompany = d;
        // this.spinner.hide();
        this.orgCharts();
        window.scroll(0,0)
      }
    });
  }

  orgCharts() {

    let temporaryThis = this;
    (function($, JSONLoop) {

      $(function() {
        temporaryThis.datasource = {};
        temporaryThis.data.product_offering.forEach(function(item, index) {
          if (!item.parentId) {
            delete item.parentId;
            Object.assign(temporaryThis.datasource, item);
          } else {
            var jsonloop = new JSONLoop(temporaryThis.datasource, 'id', 'children');
            jsonloop.findNodeById(temporaryThis.datasource, item.parentId, function(err, node) {
              if (err) {
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
          'parentNodeSymbol': 'fa-th-large'
        });
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
}

