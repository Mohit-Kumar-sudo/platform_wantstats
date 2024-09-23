import { Component, OnInit, Input } from '@angular/core';
import { EventEmitterService } from 'src/app/services/eventEmitterService';
import * as chartConfig from './column-bar-chart-configs';
@Component({
  selector: 'app-shared-column-bar-chart',
  templateUrl: './sharedColumnBarChart.component.html',
  styleUrls: ['./sharedColumnBarChart.component.scss']
})

export class SharedColumnBarChartComponent implements OnInit {
  @Input()
  inputData: any;
  chartData: any = [];
  chartConfigs: any;
  chartLabels: any = [];
  chartOptions: any;
  chartType: any = 'bar';
  chartLegend: any;
  chartPlugins: any;
  constructor(private eventEmitterService: EventEmitterService) {
    this.chartConfigs = chartConfig;
  }

  ngOnInit() {
    this.eventEmitterService.$dashboardChartData.subscribe((data) => {
      if (data) {
        this.chartLabels = data.chartLabels;
        this.chartData = data.chartData;
      }
    })
  }

}
