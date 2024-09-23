import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OutputSwotDialogComponent } from '../../output-company-profile/output-swot-dialog/output-swot-dialog.component';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { SharedAnalyticsService } from 'src/app/services/shared-analytics.service';

@Component({
  selector: 'app-shared-output-swot-analysis',
  templateUrl: './shared-output-swot-analysis.component.html',
  styleUrls: ['./shared-output-swot-analysis.component.scss']
})
export class SharedOutputSwotAnalysisComponent implements OnInit {

  @Input()
  inputData: any;

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
    private authService : AuthService
  ) {
  }

  ngOnChanges(changes: any) {
    this.inputData = changes.inputData.currentValue;
    if (this.inputData) {
      this.categorizedData(this.inputData)
    }
  }


  ngOnInit() {
    this.paramRoute.queryParams.subscribe(params => {
      this.cmpId = params['segmentId'];
      this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    });
    if(this.inputData){
      this.categorizedData(this.inputData)
    }
    this.permissions= this.authService.getUserPermissions();
  }

  analyze() {
    this.analyzeData = {
      reportId: this.reportId,
      tabSelected: "SWOT",
      subSegmentSelected: ""
    };
    this.sharedAnalyticsService.data = this.analyzeData;
    this.routes.navigateByUrl('/dashboard');
  }

  categorizedData(data) {
    data.map(d => {
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
      data: {swot: this.inputData},
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

