import {ChartOptions, ChartType} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export const pieChartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: 'top',
  },
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        const label = ctx.chart.data.labels[ctx.dataIndex];
        return label + ' (' + value + ')';
      },
      borderRadius: 8,
      borderWidth: 0,
      // padding: 6,
      align: 'end',
      anchor: 'center',
      // borderColor: '#0f02aa',
      color: 'black',
      // backgroundColor: '#FFEFD5',
      font: {
        // weight: 'bold',
        size: 12,
      }
    },
  }
};

export const pieChartType: ChartType = 'pie';
export const pieChartLegend = true;
export const pieChartPlugins = [pluginDataLabels];
export const pieChartColors = [
  {
    backgroundColor: [
      'rgba(255,223,195,0.5)',
      'rgba(0,255,0,0.5)',
      'rgba(255,0,255,0.5)',
      'rgba(155,191,224,0.5)',
      'rgba(232,160,154,0.5)',
      'rgba(251,226,159,0.51)',
      '#C6D68F',
      '#AADEA7',
      '#64C2A6',
      '#A5C1DC',
      '#E9F6FA',
      '#A9A9A9'
    ]
  },
];
