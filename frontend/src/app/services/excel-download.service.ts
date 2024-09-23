import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from './auth.service';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';


@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {
  permissions: any;

  constructor(private authService: AuthService) {
    this.permissions = this.authService.getUserPermissions();
  }

  generateExcelSheet(heading, data, title, type) {
    // if (!this.permissions.excelExport) {
    //   return this.authService.showNotSubscribedMsg();
    // }
    if (type && type == 'BAR') {
      let headers;
      const shiftData = [];
      const finalArr = [];
      headers = this.shiftArrayElements(heading, 3);
      data.forEach((d, i) => {
        shiftData.push(this.shiftArrayElements(_.values(d), 3));
      });
      this.formKeyValuesData(shiftData, headers, finalArr);
      if (finalArr.length) {
        data = finalArr;
        heading = headers;
      }
    }

    const option = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: false,
      headers: heading,
      nullToEmptyString: true,
      title
    };

    if (data && data.length) {
      let finale = data;
      if (type == 'BAR') {
        finale = this.removeAndFormat(data, option);
      }
      new Angular5Csv(finale, title, option);
    }
  }

  downloadExcel(dataElement) {
    // if (!this.permissions.excelExport) {
    //   return this.authService.showNotSubscribedMsg();
    // }
    let dataLabels;
    let headers;
    let mapLabels;
    let title;
    let finalData = [];
    if (dataElement.type === 'PIE') {
      headers = [];
      title = dataElement.data.metaDataValue.title;
      finalData = dataElement.data.metaDataValue.columns;
      finalData.push({});
      finalData.push({describe: dataElement.text ? dataElement.text : ''});
      if (finalData.length) {
        this.generateExcelSheet(headers, finalData, title, 'PIE');
      }
    } else {
      dataLabels = dataElement.data.chartLabels;
      mapLabels = dataElement.data.chartData;
      let labels = _.map(mapLabels, 'label');
      let data = _.map(mapLabels, 'data');
      headers = [' '];
      title = dataElement.data.metaDataValue.title;
      dataLabels.forEach(d => {
        headers.push(d);
      });
      labels.forEach((d, i) => {
        let obj = {};
        obj['label'] = d,
          data[i].forEach((dt, j) => {
            obj[`${j}_value`] = dt;
          });
        finalData.push(obj);
      });
      finalData.push({});
      finalData.push({describe: dataElement.text ? dataElement.text : ''});
      if (finalData && finalData.length) {
        this.generateExcelSheet(headers, finalData, title, 'BAR');
      }
    }
  }

  shiftArrayElements(array, subtVal) {
    let indexShift = array.length - subtVal;
    array.unshift(array.splice(indexShift, 1)[0]);
    indexShift = array.length - subtVal;
    array.unshift(array.splice(indexShift, 1)[0]);
    return array;
  }

  removeAndFormat(data, headers) {
    let datas = [];
    let fData = [];
    data.forEach(d => {
      delete (d[' % Split']);
      delete (d[' Assumed CAGR (%)']);
    });
    headers.headers = _.keys(data[0]);
    if (!_.includes(_.last(headers.headers), 'CAGR (%)')) {
      headers.headers.unshift(headers.headers.splice(headers.headers.length - 1, 1)[0]);
      data.forEach(d => {
        let item = _.values(d);
        item.unshift(item.splice(item.length - 1, 1)[0]);
        datas.push(item);
      });
      if (datas && datas.length) {
        this.formKeyValuesData(datas, headers.headers, fData);
      }
    }
    return fData.length ? fData : data;
  }

  formKeyValuesData(array, headers, pushArr) {
    array.forEach(sd => {
      let tempArr = {};
      sd.forEach((sk, i) => {
        tempArr = _.merge(tempArr, {[' ' + headers[i]]: sk});
      });
      pushArr.push(tempArr);
    });
  }
}
