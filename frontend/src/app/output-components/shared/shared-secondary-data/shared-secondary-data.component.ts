import { Component, Input, OnInit } from '@angular/core';
import { ReportSectionService } from 'src/app/services/report-section.service';
import * as pieConfig from '../../../components/core/pie-chart-input/pie-chart-configs';
import * as barConfig from '../../../components/core/bar-chart-input/bar-chart-configs';
import * as _ from 'lodash';

@Component({
  selector: 'app-shared-secondary-data',
  templateUrl: './shared-secondary-data.component.html',
  styleUrls: ['./shared-secondary-data.component.scss']
})
export class SharedSecondaryDataComponent implements OnInit {

  @Input()
  inputData: any = [];
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

  ngOnChanges(changes: any) {
    this.inputData = changes.inputData.currentValue;
    this.convertAndStoreData();
  }
  constructor(private reportSectionService: ReportSectionService) {
  }

  ngOnInit() {
    // this.convertAndStoreData();
  }
  convertAndStoreData() {
    if (this.inputData) {
      this.inputData = this.reportSectionService.convertToReportDataElement(this.inputData);
    }
  }
}

