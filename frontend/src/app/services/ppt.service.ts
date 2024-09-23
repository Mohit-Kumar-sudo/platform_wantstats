import { Injectable } from '@angular/core';
import PptxGenJS from 'pptxgenjs';
import { MatDialog } from '@angular/material/dialog';
import { CreatePptModalComponent } from '../output-components/ppt/create-ppt-modal/create-ppt-modal.component';
import { PptListModalComponent } from '../output-components/ppt/ppt-list-modal/ppt-list-modal.component';
import { UsersDashboardsComponent } from '../output-components/dashboard/usersdashboards/usersdashboards.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PptService {
  permissions: any;

  constructor(public dialog: MatDialog, private authService: AuthService) {
    this.permissions = this.authService.getUserPermissions();
  }

  addSlideToPPT(data) {
    // if (!this.permissions.excelExport) {
    //   return this.authService.showNotSubscribedMsg();
    // }
    console.log('data');
    const dialogRef = this.dialog.open(CreatePptModalComponent, {
      width: '50%',
      height: '40%',
      data,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openPPTList() {
    const dialogRef = this.dialog.open(PptListModalComponent, {
      width: '75%',
      height: '50%',
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDashboardsList() {
    const dialogRef = this.dialog.open(UsersDashboardsComponent, {
      width: '55%',
      height: '50%',
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  downloadApiPPT(data) {}

  downloadPPT(data) {
    console.log('data', data)
    const pptx = new PptxGenJS();

  // Add a new slide
  let slide = pptx.addSlide();

  if (data.type === 'PIE') {
    const pieChartConfigs = {
      x: 1.0,
      y: 1.0,
      w: 8,
      h: 4,
      showPercent: true,
      showLabel: true,
      showTitle: true,
      labelPos: 'b' as const, // specify type explicitly
      titleFontSize: 12,
      dataLabelColor: 'ffffff',
      dataLabelFontSize: 10,
      dataLabelPosition: 'bestFit' as const, // specify type explicitly
      title: data.data.metaDataValue.title,
    };
    const dataChartPie = [
      {
        name: data.data.metaDataValue.title,
        labels: data.data.chartLabels,
        values: data.data.chartData,
      },
    ];
    slide.addChart('pie', dataChartPie, pieChartConfigs);
  } else if (data.type === 'BAR') {
    const pptBarChartData = data.data.chartData.map(item => ({
      name: item.label,
      labels: data.data.chartLabels,
      values: item.data,
    }));
    const options = {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 4,
      showValAxisTitle: true,
      valAxisTitle: 'USD Mn',
      showCatAxisTitle: true,
      catAxisTitle: 'Years',
      fontFace: 'Danske Text',
      showLegend: true,
      showLabel: true,
      legendPos: 'b' as const, // specify type explicitly
      labelPos: 'b' as const, // specify type explicitly
      fontSize: 3,
      labelFontSize: 6,
      dataLabelFontSize: 8,
      dataLabelPosition: 'inEnd' as const, // specify type explicitly
      showValue: true,
      showTitle: true,
      titleFontSize: 12,
      title: data.data.metaDataValue?.title || 'Bar chart',
      lineSmooth: true,
    };
    slide.addChart('bar', pptBarChartData, options);
  }

  // Save the presentation with file name
  pptx.writeFile({ fileName: data.data.metaDataValue.title });
}
}
