import { Injectable } from '@angular/core';
import {
  BAR,
  BarChartData,
  HEADING,
  IMAGE,
  ImageData,
  PIE,
  PieChartData,
  ReportDataElement,
  SecondaryDataElement,
  TABLE,
  TableData,
  TEXT,
  TextData
} from '../models/secondary-research-models';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ReportSectionService {
  constructor() {
  }

  convertToSecondaryDataElement(reportElements: any) {
    if(reportElements && reportElements.length){
    return reportElements.map(element => {
      let secEle: SecondaryDataElement = {
        order_id: element.id,
        type: element.type,
        data: this.formatReportElementToString(element)
      };
      return secEle;
    });
  }
  }

  formatReportElementToString(reportElement: ReportDataElement) {
    let contentStr;
    switch (reportElement.type) {
      case TEXT:
        let textData: TextData = {
          content: reportElement.data.toString()
        };
        contentStr = textData; //JSON.stringify(textData);
        break;
      case TABLE:
        let tableData: TableData = {
          title: reportElement.data.metaDataValue.title,
          source: reportElement.data.metaDataValue.source,
          rows: reportElement.data.metaDataValue.rows,
          columns: reportElement.data.cols,
          dataStore: reportElement.data.dataStore,
        };
        contentStr = tableData; //JSON.stringify(tableData);
        break;
      case IMAGE:
        let imageData: ImageData = {
          title: reportElement.data.metaDataValue.title,
          source: reportElement.data.metaDataValue.source,
          type: reportElement.data.metaDataValue.type,
          imageUrl: reportElement.data.imageUrl
        };
        contentStr = imageData ; //JSON.stringify(imageData);
        break;
      case PIE:
        let pieChartData: PieChartData = {
          title: reportElement.data.metaDataValue.title,
          source: reportElement.data.metaDataValue.source,
          calType: reportElement.data.metaDataValue.calType,
          columns: reportElement.data.metaDataValue.columns,
        };
        contentStr = pieChartData; //JSON.stringify(pieChartData);
        break;
      case BAR:
        let barChartData: BarChartData = {
          title: reportElement.data.metaDataValue.title,
          source: reportElement.data.metaDataValue.source,
          labelX: reportElement.data.metaDataValue.labelX,
          labelY: reportElement.data.metaDataValue.labelY,
          columnMetaData: reportElement.data.colMetaData,
          dataStore: reportElement.data.dataStore,
        };
        contentStr = barChartData; //JSON.stringify(barChartData);
        break;
      default:
        contentStr = '';
    }
    return contentStr;
  }


  convertToReportDataElement(reportElements: SecondaryDataElement[]): any[] {
    if (reportElements.length) {
      return reportElements.map(element => {
        return this.mapToReportElementByType(element);
      });
    } else {
      return [];
    }
  }


  mapToReportElementByType(element: SecondaryDataElement) {
    // console.log("element",element)
    // console.log("element.type",element.type)
    switch (element.type) {
      case TEXT:
        return this.convertToTextFormat(element);
      case IMAGE:
        return this.convertToImageFormat(element);
      case PIE:
        return this.convertToPieChartFormat(element);
      case TABLE:
        return this.convertToTableFormat(element);
      case BAR:
        return this.convertToBarChartFormat(element);
      case HEADING:
        return this.convertToHeadingFormat(element);
      default:
        throw new Error(`Unknown element type: ${element.type}`);
    }
  }


  convertToTextFormat(element) {
    try {
      return {
        id: element.order_id,
        type: element.type,
        data: `${element.data.content}`
      };
    } catch (error) {
      console.error('error in converting =>', element);
      console.error(error);
      // Return a default value or handle the error in another way
      return {
        id: null,
        type: null,
        data: null
      };
    }
  }

  convertToHeadingFormat(element) {
    try {
      return {
        id: element.order_id,
        type: element.type,
        data: `${element.data.content}`
      };
    } catch (error) {
      console.error('error in converting =>', element);
      console.error(error);
      // Return a default value or handle the error in another way
      return {
        id: null,
        type: null,
        data: null
      };
    }
  }

  convertToImageFormat(element) {
    const imageContent = (typeof (element.data) === "string") ? JSON.parse(element.data) : element.data;
    return {
      id: element.order_id,
      type: element.type,
      data: {
        imageUrl: imageContent.imageUrl,
        metaDataValue: {
          source: imageContent.source,
          title: imageContent.title,
          type: imageContent.type
        }
      }
    };
  }

  convertToPieChartFormat(element) {
    const pieContent = (typeof (element.data) === "string") ? JSON.parse(element.data) : element.data;
    const labelsArray = [];
    const valuesArray = [];
    pieContent.columns.forEach(col => {
      labelsArray.push(col.header);
      valuesArray.push(col.value);
    });
    return {
      id: element.order_id,
      type: element.type,
      data: {
        chartData: valuesArray,
        chartLabels: labelsArray,
        metaDataValue: pieContent
      }
    };
  }

  convertToTableFormat(element) {
    const tableContent = (typeof (element.data) === "string") ? JSON.parse(element.data) : element.data;
    const columnsObj = [];
    if (tableContent.columns) {
      tableContent.columns.forEach(item => {
        columnsObj.push({header: item});
      });
    }
    return {
      id: element.order_id,
      type: element.type,
      data: {
        cols: tableContent.columns,
        dataStore: tableContent.dataStore,
        metaDataValue: {
          columns: columnsObj,
          rows: tableContent.rows,
          source: tableContent.source,
          title: tableContent.title
        }
      }
    };
  }

  convertToBarChartFormat(element) {
    const barContent = (typeof (element.data) === "string") ? JSON.parse(element.data) : element.data;
    const charData = [];
    const keys = _.keys(barContent.dataStore[0]);
    _.remove(keys, (n) => n === 'rowHeader');
    const temp = [];
    barContent.dataStore.forEach(item => {
      keys.forEach(k => {
        if (!temp.includes(k)) {
          const charElement = {
            label: k,
            data: _.map(barContent.dataStore, k),
          };
          temp.push(k);
          charData.push(charElement);
        }
      });
    });
    return {
      id: element.order_id,
      type: element.type,
      data: {
        chartData: charData,
        chartLabels: _.map(barContent.dataStore, 'rowHeader'),
        colMetaData: barContent.colMetaData,
        dataStore: barContent.dataStore,
        metaDataValue: {
          labelX: barContent.labelX,
          labelY: barContent.labelY,
          source: barContent.source,
          title: barContent.title
        }
      },
      text: element.text ? element.text : ''
    };
  }
}
