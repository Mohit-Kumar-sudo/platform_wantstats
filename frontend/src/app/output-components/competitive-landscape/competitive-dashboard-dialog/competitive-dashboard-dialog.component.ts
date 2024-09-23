import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  Inject
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ReportDataElement } from 'src/app/models/secondary-research-models';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import * as html2canvas from 'html2canvas';
import { AuthService } from 'src/app/services/auth.service';
interface AllHeads {
  [key: string]: any[]; // Define the type of the array elements appropriately
}
interface DialogData {
  allHeads: AllHeads;
  allData: any[]; // Update the type as necessary
}

@Component({
  selector: 'app-competitive-dashboard-dialog',
  templateUrl: './competitive-dashboard-dialog.component.html',
  styleUrls: ['./competitive-dashboard-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CompetitiveDashboardDialogComponent implements OnInit {

  rawData: any;
  colspans: any = [];
  allKeys = [];

  objectKeys = Object.keys;
  objectValues = Object.values;

  reportData: ReportDataElement[];
  reportName = '';
  startYear = '';
  endYear = '';
  reportId = '';
  sectionId = "";
  mainSectionId = "";

  result: any;

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('porters') porters: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  permissions: any;


  ngAfterViewInit() {
    document.querySelector('#scroll').scrollIntoView();
  }

  @ViewChild('container') element: ElementRef;

  htmlElement: HTMLElement;

  constructor(private routes: Router,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CompetitiveDashboardDialogComponent>,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.getReportDetails();
    document.getElementById('scrollToTop').scrollTo(0, -100);
    this.permissions = this.authService.getUserPermissions();
  }

  getReportDetails() {
    const currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    const sectionData = this.localStorageService.get(ConstantKeys.CURRENT_SECTION);

    this.reportName = currentReport.title;
    this.startYear = currentReport.me.start_year;
    this.endYear = currentReport.me.end_year;
    this.reportId = currentReport._id;
  }

  generateImage() {

    if (!this.permissions.imageExport) {
      return this.authService.showNotSubscribedMsg();
    }
    // @ts-ignore
    html2canvas(document.getElementById("myTable")).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'porters.png';
      this.downloadLink.nativeElement.click();
    });
  }

  checkType(item) {
    return typeof (item) == 'boolean' ? false : true
  }
  doClose() {
    this.dialogRef.close();
  }
}
