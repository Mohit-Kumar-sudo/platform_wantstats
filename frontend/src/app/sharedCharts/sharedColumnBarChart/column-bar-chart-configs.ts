import {ChartOptions, ChartType} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export const columnBarChartOptions: any = {
  responsive: true,
  scales: {
    xAxes: [{
      stacked: false,
      scaleLabel: {
        display: true,
        font: {
          size: 9
        }
      },
      ticks: {
        beginAtZero: true,
      }
    }],
    yAxes: [{
      stacked: false,
      scaleLabel: {
        display: true,
        font: {
          size: '9'
        }
      },
      ticks: {
        beginAtZero: true,
      }
    }]
  },
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'end',
    }
  }
};

export function getChartOptions(xLabel: string, yLabel: string) {
  let objCopy: any = JSON.parse(JSON.stringify(columnBarChartOptions));
  objCopy.scales.xAxes[0].scaleLabel.labelString = xLabel;
  objCopy.scales.yAxes[0].scaleLabel.labelString = yLabel;
  return objCopy;
}

export const columnBarChartType: ChartType = 'bar';
export const columnBarChartLegend = true;
export const columnBarChartPlugins = [pluginDataLabels];
