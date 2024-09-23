import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { LocalStorageService } from '../../../services/localstorage.service';
import { ConstantKeys } from '../../../constants/mfr.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OutputSwotDialogComponent } from '../output-swot-dialog/output-swot-dialog.component';
import * as html2canvas from 'html2canvas';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-output-swot-analysis',
  templateUrl: './output-swot-analysis.component.html',
  styleUrls: ['./output-swot-analysis.component.scss']
})
export class OutputSwotAnalysisComponent implements OnInit {

  @Input()
  outputData: any = [];
  swotData: any = [];
  strength: any;
  weakness: any;
  opportunity: any;
  threat: any;
  currentReport: any;
  analyzeData: any;
  reportId = "";

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  currentProfile: any;
  cmpId: any;
  permissions: any;

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private routes: Router,
    private sharedAnalyticsService: SharedAnalyticsService,
    private paramRoute: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.paramRoute.queryParams.subscribe(params => {
      this.cmpId = params['segmentId'];
      this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
      this.currentProfile = this.outputData.company_name;
    });

    if(this.outputData){
      this.categorizedData(this.outputData)
    }
    this.permissions = this.authService.getUserPermissions();
  }

  analyze() {

    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "SWOT",
      subSegmentSelected: ""
    }
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  categorizedData(data) {
    data.swot.map(d => {
      if (d.key === 'STRENGTH') {
        this.strength = d.value;
      }
      if (d.key === 'WEAKNESS') {
        this.weakness = d.value;
      }
      if (d.key === 'OPPORTUNITIES') {
        this.opportunity = d.value;
      }
      if (d.key === 'THREAT') {
        this.threat = d.value;
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(OutputSwotDialogComponent, {
      width: '99%',
      data: this.outputData,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  generateImage() {

  if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'swot.png';
      this.downloadLink.nativeElement.click();
    });
  }
}

