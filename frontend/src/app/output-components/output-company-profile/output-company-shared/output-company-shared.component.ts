import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import {MatDialog} from '@angular/material/dialog';
import {CommonChartContainerComponent} from '../../common-chart-container/common-chart-container.component';
import * as html2canvas from 'html2canvas';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-output-company-shared',
  templateUrl: './output-company-shared.component.html',
  styleUrls: ['./output-company-shared.component.scss']
})
export class OutputCompanySharedComponent implements OnInit {

  @Input()
  outputData: any = [];
  currentReport: any;
  pieChartType = pieConfig.pieChartType;
  pieChartOptions = pieConfig.pieChartOptions;
  pieChartPlugins = pieConfig.pieChartPlugins;
  pieChartColors = pieConfig.pieChartColors;
  pieChartLegend = pieConfig.pieChartLegend;
  barChartType = barConfig.barChartType;
  barChartOptions = barConfig.barChartOptions;
  barChartPlugins = barConfig.barChartPlugins;
  barChartLegend = barConfig.barChartLegend;
  @ViewChild('screenPie') screenPie: ElementRef;
  @ViewChild('screenBar') screenBar: ElementRef;
  @ViewChild('screenImg') screenImg: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  pieData: any;
  permissions: any;
  openD: any;

  constructor(private dialog: MatDialog,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.permissions = this.authService.getUserPermissions();
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(CommonChartContainerComponent, {
      width: '99%',
      data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(result => {
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
}

