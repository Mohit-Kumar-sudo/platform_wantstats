import {Component, OnInit} from '@angular/core';
import {Label} from 'ng2-charts';
import * as barChartConfigs from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {barChartOptions} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {barChartPlugins} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {barChartLegend} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {barChartType} from 'src/app/components/core/bar-chart-input/bar-chart-configs';
import {
  pieChartColors,
  pieChartLegend,
  pieChartOptions,
  pieChartPlugins,
  pieChartType
} from 'src/app/components/core/pie-chart-input/pie-chart-configs';

@Component({
  selector: 'app-shared-pie-chart',
  templateUrl: './sharedPieChart.component.html',
  styleUrls: ['./sharedPieChart.component.scss']
})

export class SharedPieChartComponent implements OnInit {

  chartLabels: Label[] = ['Header 1', 'Header 2', 'Header 3'];
  chartOptions: any;
  chartType: any = 'bar';
  chartLegend: any;
  chartPlugins: any;
  chartData: any = [];
  chartColors: any;
  chartDataPie: number[] = [30, 25, 45];

  chartInput: any = {
    chartOptions: barChartConfigs.barChartOptions,
    chartPlugins: barChartConfigs.barChartPlugins,
    chartLegend: barChartConfigs.barChartLegend,
    chartType: barChartConfigs.barChartType,
    chartLabels: ['X-Axis -0', 'X-Axis -1', 'X-Axis -2'],
  };

  constructor() {
    this.chartOptions = barChartOptions;
    this.chartPlugins = barChartPlugins;
    this.chartLegend = barChartLegend;
    this.chartType = barChartType;
    this.chartLabels = ['X-Axis -0', 'X-Axis -1', 'X-Axis -2'];
    this.chartData = [
      {
        label: 'Label 2',
        backgroundColor: 'rgba(255,99,132,0.6)',
        borderColor: 'rgba(255,99,132,1)',
        hoverBackgroundColor: 'rgba(38,38,255,0.8)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [10, 20, 30]
      },
      {
        label: 'Label 2',
        backgroundColor: 'rgba(54,162,235,0.6)',
        borderColor: 'rgba(54,162,235,1)',
        hoverBackgroundColor: 'rgba(54,162,235,0.8)',
        hoverBorderColor: 'rgba(54,162,235,1)',
        data: [30, 40, 50]
      },

    ];
    this.chartOptions = pieChartOptions;
    this.chartType = pieChartType;
    this.chartLegend = pieChartLegend;
    this.chartPlugins = pieChartPlugins;
    this.chartColors = pieChartColors;
    this.chartDataPie = [30, 40, 50];
  }

  ngOnInit() {
    this.chartData = [
      {
        label: 'Label 2',
        backgroundColor: 'rgba(255,99,132,0.6)',
        borderColor: 'rgba(255,99,132,1)',
        hoverBackgroundColor: 'rgba(38,38,255,0.8)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [10, 20, 30]
      },
      {
        label: 'Label 2',
        backgroundColor: 'rgba(54,162,235,0.6)',
        borderColor: 'rgba(54,162,235,1)',
        hoverBackgroundColor: 'rgba(54,162,235,0.8)',
        hoverBorderColor: 'rgba(54,162,235,1)',
        data: [30, 40, 50]
      }
    ];
  }

}
