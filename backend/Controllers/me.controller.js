const dataConstants = require('../config/dataConstants');
const textConstants = require('../config/text.template');
const utilities = require('../utilities/utils');
const to = require('../utilities/to'); 
const reportController = require('../Controllers/Reports.Controller');
const meModel = require('../Models/me.modal');
const _ = require("lodash");
const HTTPStatus = require('http-status');

// // MARKET VIEWS MAIN

async function getMEViewsData(req, res) {
    console.log("resss",res)
  try {
      const reportId = req.params.rid;
      const viewKey = req.query.key;
      const value = req.query.value;
      const mainSectionId = req.query.mainSectionId;
      const sectionPid = req.query.sectionPid;

      console.log("reportId:", reportId);
      console.log("viewKey:", viewKey);
      console.log("value:", value);

      let viewData = null;
      try {
          switch (viewKey) {
              case dataConstants.ME_VIEWS.MARKET_BY_REGION:
                  viewData = await getMEViewsMKTRegionData(reportId, viewKey, value, mainSectionId, sectionPid);
                  break;
              case dataConstants.ME_VIEWS.MARKET_BY_SEGMENT:
                  viewData = await getMEViewsMKTSegmentData(reportId, value, viewKey, mainSectionId, sectionPid);
                  let dataRes = await getMEViewsSegmentRegionData(reportId, value, dataConstants.ME_VIEWS.SEGMENT_BY_REGIONS) || {};
                  if (!dataRes.hasOwnProperty("errors") && utilities.isEmpty(dataRes.errors))
                      viewData = [...viewData, ...dataRes];
                  break;
              case dataConstants.ME_VIEWS.SEGMENT_BY_REGIONS:
                  viewData = await getMEViewsSegmentRegionData(reportId, value, viewKey);
                  break;
              case dataConstants.ME_VIEWS.REGION:
                  viewData = await getMERegionViewData(reportId, value, viewKey);
                  break;
              case dataConstants.ME_VIEWS.SEGMENT:
                  viewData = await getMESegmentViewData(reportId, value, viewKey);
                  break;
              default:
                  console.error("View name is invalid or missing!");
                  break;
          }
      } catch (er) {
          console.error("Error: Market By views: " + er);
          viewData = { errors: er.message };
      }

      // Handle response based on the data fetched
      if (!utilities.isEmpty(viewData.errors)) {
          const errObj = viewData.errors;
          utilities.sendErrorResponse(HTTPStatus.BAD_REQUEST, true, errObj, res);
      } else {
          utilities.sendResponse(HTTPStatus.OK, viewData, res);
      }

  } catch (er) {
      utilities.sendErrorResponse(HTTPStatus.INTERNAL_SERVER_ERROR, true, er, res);
  }
}
async function getMEViewsMKTRegionData(
  reportId,
  viewKey,
  regionId
) {
  let viewRecords = [];
  let geoDetails = [];
  const gridKeys = [];
  let meViewSegData = [];

  try {
    meViewSegData =
      (await to(meModel.getMEViewsSegmentData(reportId, "1"))) || [];
    if (
      utilities.isEmpty(meViewSegData) ||
      utilities.isEmpty(meViewSegData[0].viewRecords)
    ) {
      let err = { errors: new Error("ME Segment not found!") };
      return err;
    }
    const segRecords = meViewSegData[0].viewRecords;
    geoDetails =
      (await to(meModel.getMEViewsRegionData(reportId, regionId))) || [];
    if (geoDetails.length) {
      geoDetails = geoDetails[0];
      geoDetails.regions.forEach(ele => {
        const regName = ele.name.toLowerCase().replace(/ /gi, "_");
        ele.region_name = ele.name.toLowerCase();
        ele.grid_key = `${regName}_value`;
        let tempStr = textConstants.MARKET_BY_REGION_TITLE;
        tempStr = tempStr.replace("<geo_name>", regName);
        ele.title = "";
        viewRecords.push(ele);
        gridKeys.push(ele.grid_key);
        for (let i = 0; i < segRecords.length; i++) {
          const segEle = Object.assign({}, segRecords[i]);
          if (segEle.pid === "1") {
            segEle.seg_name = segEle.name.toLowerCase();
            segEle.region_name = ele.name.toLowerCase();
            segEle.grid_key = `${segmentNameSymbolReplacement(
              segEle.name
            )}_${regName}_value`
              .toLowerCase()
              .replace(/ /gi, "_");
            viewRecords.push(segEle);
            gridKeys.push(segEle.grid_key);
          }
        }
      });
        geoDetails.countries.forEach(ele => {
          const countName = ele.country.toLowerCase().replace(/ /gi, "_");
          ele.country_name = ele.country.toLowerCase();
          for (let i = 0; i < segRecords.length; i++) {
            const segEle = Object.assign({}, segRecords[i]);
            if (segEle.pid === "1") {
              segEle.seg_name = segEle.name.toLowerCase();
              segEle.country_name = ele.country.toLowerCase();
              segEle.grid_key = `${segmentNameSymbolReplacement(
                segEle.name
              )}_${countName}_value`
                .toLowerCase()
                .replace(/ /gi, "_");
              viewRecords.push(segEle);
              gridKeys.push(segEle.grid_key);
            }
          }
        });
    } else {
      geoDetails =
        (await to(meModel.getMEViewsWithoutRegionData(reportId))) || [];
      if (geoDetails.length) {
        geoDetails = geoDetails[0];
      geoDetails.regions.forEach(ele => {
        const regName = ele.name.toLowerCase().replace(/ /gi, "_");
        ele.region_name = ele.name.toLowerCase();
        ele.grid_key = `${regName}_value`;
        let tempStr = textConstants.MARKET_BY_REGION_TITLE;
        tempStr = tempStr.replace("<geo_name>", regName);
        ele.title = "";
        viewRecords.push(ele);
        gridKeys.push(ele.grid_key);
        for (let i = 0; i < segRecords.length; i++) {
          const segEle = Object.assign({}, segRecords[i]);
          if (segEle.pid === "1") {
            segEle.seg_name = segEle.name.toLowerCase();
            segEle.region_name = ele.name.toLowerCase();
            segEle.grid_key = `${segmentNameSymbolReplacement(
              segEle.name
            )}_${regName}_value`
              .toLowerCase()
              .replace(/ /gi, "_");
            viewRecords.push(segEle);
            gridKeys.push(segEle.grid_key);
          }
        }
      });
        geoDetails.countries.forEach(ele => {
          const countName = ele.country.toLowerCase().replace(/ /gi, "_");
          ele.country_name = ele.country.toLowerCase();
          for (let i = 0; i < segRecords.length; i++) {
            const segEle = Object.assign({}, segRecords[i]);
            if (segEle.pid === "1") {
              segEle.seg_name = segEle.name.toLowerCase();
              segEle.country_name = ele.country.toLowerCase();
              segEle.grid_key = `${segmentNameSymbolReplacement(
                segEle.name
              )}_${countName}_value`
                .toLowerCase()
                .replace(/ /gi, "_");
              viewRecords.push(segEle);
              gridKeys.push(segEle.grid_key);
            }
          }
        });
      }
    }
    const meCompViewData =
      (await to(meModel.getMEGridDataForViews(reportId, gridKeys))) || [];
    if (
      utilities.isEmpty(meCompViewData) ||
      utilities.isEmpty(meCompViewData[0].gridData)
    ) {
      let err = { errors: new Error("Grid Data not found!") };
      return err;
    }
    viewRecords = viewRecords.map(itm => ({
      ...meCompViewData[0].gridData.find(
        item => item.key === itm.grid_key && item
      ),
      ...itm
    }));
    await getTextForViews(reportId, viewRecords, viewKey);
  } catch (er) {
    console.error(er);
    return { errors: er.message };
  }
  return viewRecords;
}
async function getMEViewsMKTSegmentData(reportId, value, viewKey) {
    let meViewData = {};
    let meCompViewData = {};
    const gridKeys = [];
    try {
        meViewData = await meModel.getMEViewsSegmentData(reportId, value) || [];
       if (utilities.isEmpty(meViewData) || utilities.isEmpty(meViewData[0].viewRecords)) {
            let err = { "errors": new Error("Grid Data not found!") };
            return err;
        }
        let viewRecords = meViewData[0].viewRecords;
        let tmpArr = [];
        let segName = "";
        for (let i = 0; i < viewRecords.length; i++) {
            const ele = viewRecords[i];
            if (ele.id === value) {   // parent segment
                ele.grid_key = `${ele.name}_parent_value`.toLowerCase().replace(/ /ig, '_').replace(/-/ig,'_').replace(/&/g,'and');
                segName = ele.name;
                gridKeys.push(ele.grid_key);
                tmpArr.push(ele);
            } else if (ele.pid === value) { // child segments
                delete viewRecords[i];;
            }
            ele.seg_name = ele.name;
        }
        viewRecords = tmpArr;
        meCompViewData = await meModel.getMEGridDataForViews(reportId, gridKeys) || [];
        if (utilities.isEmpty(meCompViewData) || utilities.isEmpty(meCompViewData[0].gridData)) {
            let err = { "errors": new Error("Grid Data not found!") };
            return err;
        }
        viewRecords = viewRecords.map(itm => ({
            ...meCompViewData[0].gridData.find((item) => (item.key === itm.grid_key) && item),
            ...itm
        }));
        await getTextForViews(reportId, viewRecords, viewKey);
        return viewRecords;
    } catch (er) {
        console.error(er);
        return (meViewData.errors = er.message);
    }
}
const getTextForViews = async function (reportId, viewRecords, viewKey) {
    let reportDetails = null;
    let templateStr = null;
    let compareArr = null;
    reportDetails = await to(reportController.fetchReport(reportId, null, null, "me.start_year,me.end_year,me.base_year,me.geo_segment")) || [];
    if (!utilities.isEmpty(reportDetails)) {
        reportDetails = reportDetails[0];
        templateStr = textConstants[viewKey];
        compareArr = (_.flatMap(_.flatMap(reportDetails.me.geo_segment,'countries'),'name'));
    } else {
        console.error(`Report Details not found for ${reportId}`);
        return {};
    }
    viewRecords.forEach((ele) => {
            let parentSectName = ele.name || null;
            let rowHeaderCol = (ele.rowHeaders && ele.rowHeaders.length > 0) ? ele.rowHeaders[0] : null;
            if (!utilities.isEmpty(ele.seg_name)) {
                templateStr = textConstants.MARKET_BY_SEGMENT;
            }
            if (!utilities.isEmpty(ele.seg_name) && !utilities.isEmpty(ele.region_name)) {
                templateStr = textConstants.SEGMENT_BY_REGIONS;
            }
            if (!utilities.isEmpty(ele.value)) {
                let metric = ele.metric?ele.metric:dataConstants.METRIC.MN;
                const tableData = ele.value;
                let maxCAGRValue = -1;
                let maxCAGRRowHeader = '';
                let cagrRowHeader = '';
                let cagr_value = -1;
                let baseYearVal = -1;
                let maxValueEndYear = -1;
                let maxValueRowHeader = '';
                let currencyUnit = 'USD';
                let degree_of_comparision = tableData.length > 3 ? 'largest' : 'larger';
                const CAGRColName = `CAGR (%) (${reportDetails.me.start_year}-${reportDetails.me.end_year})`;
                if (!utilities.isEmpty(ele.metric)) {
                    switch(ele.metric) {
                        case dataConstants.CURRENCY_UNIT.MN:
                            metric = dataConstants.METRIC.MN;
                            break;
                        case dataConstants.CURRENCY_UNIT.KILO:
                                metric = dataConstants.METRIC.KILO;
                                break;
                        case dataConstants.CURRENCY_UNIT.BN:
                            metric = dataConstants.METRIC.BN;
                            break;
                        case dataConstants.CURRENCY_UNIT.TN:
                            metric = dataConstants.METRIC.TN;
                            break;
                    }
                }
                for (let i = 0; i < tableData.length; i++) {
                    const rowRec = tableData[i];
                    if (!rowRec[rowHeaderCol].includes(dataConstants.TABLE_CONSTANTS.TOTAL)) {
                        if (parseFloat(rowRec[reportDetails.me.base_year]) > parseFloat(baseYearVal)) {
                            maxValueEndYear = rowRec[reportDetails.me.end_year];
                            baseYearVal = rowRec[reportDetails.me.base_year];
                            maxValueRowHeader = rowRec[rowHeaderCol];
                            cagr_value = rowRec[CAGRColName];
                            cagrRowHeader = rowRec[rowHeaderCol];
                        }
                        if (parseFloat(rowRec[CAGRColName]) > parseFloat(maxCAGRValue)) {
                            maxCAGRValue = rowRec[CAGRColName];
                            maxCAGRRowHeader = rowRec[rowHeaderCol];
                        }
                    }
                }
                try {
                    maxCAGRRowHeader = !utilities.isEmpty(maxCAGRRowHeader) ? maxCAGRRowHeader.replace(/_/ig, ' ') : '';
                    reportDetails.title = !utilities.isEmpty(reportDetails.title) ? reportDetails.title.replace(/_/ig, ' '): '';
                    parentSectName = !utilities.isEmpty(parentSectName) ? parentSectName.replace(/_/ig, ' ') : '';
                    maxValueEndYear = !utilities.isEmpty(maxValueEndYear) ? maxValueEndYear.replace(/_/ig, ' ') : '';
                    baseYearVal = !utilities.isEmpty(baseYearVal) ? baseYearVal.replace(/_/ig, ' ') : '';
                    maxValueRowHeader = !utilities.isEmpty(maxValueRowHeader) ? maxValueRowHeader.replace(/_/ig, ' ') : '';
                    maxCAGRValue = !utilities.isEmpty(maxCAGRValue) ? maxCAGRValue.replace(/_/ig, ' ') : '';
                } catch (ex) {
                    console.error(`Error in replacing constants with spaces. Error: ${ex}`);
                }
                if (cagrRowHeader == maxCAGRRowHeader) {
                    let idx = templateStr.indexOf(' <mark>');
                    let check = templateStr.includes('This market is projected to grow at a CAGR of <cagr_value>% during the forecast period from <year_range>.')
                    if((viewKey == dataConstants.ME_VIEWS.MARKET_BY_REGION && !check) || (viewKey == dataConstants.ME_VIEWS.MARKET_BY_SEGMENT && !check)){
                         templateStr = templateStr + `This market is projected to grow at a CAGR of ${Number(cagr_value).toFixed(2)}% during the forecast period from ${Number(reportDetails.me.base_year)+1} - ${reportDetails.me.end_year}.`
                      }
                } else {
                    templateStr = templateStr.replace('<mark>', '');
                }
                if(viewKey == dataConstants.ME_VIEWS.MARKET_BY_REGION){
                    maxValueRowHeader = _.find(compareArr,d=>{if(d && d.toLowerCase() == maxValueRowHeader.toLowerCase()){return d}})?maxValueRowHeader:maxValueRowHeader+' segment';
                    maxCAGRRowHeader = _.find(compareArr,d=>{if(d && d.toLowerCase() == maxCAGRRowHeader.toLowerCase()){return d}})?maxCAGRRowHeader:maxCAGRRowHeader+' segment';
                }else{
                    maxValueRowHeader = _.find(reportDetails.me.geo_segment,['region',maxValueRowHeader])?maxValueRowHeader:maxValueRowHeader+' segment';
                    maxCAGRRowHeader = _.find(reportDetails.me.geo_segment,['region',maxCAGRRowHeader])?maxCAGRRowHeader:maxCAGRRowHeader+' segment';
                }
                let replacedStr = templateStr.replace(/<subseg_name_largest>/ig, maxValueRowHeader.replace(/_/ig, ' '));
                replacedStr = replacedStr.replace(/<report_name>/ig, reportDetails.title.toLowerCase());
                replacedStr = replacedStr.replace(/<seg_name>/ig, parentSectName);
                replacedStr = replacedStr.replace(/<end_year_value>/ig, Number(maxValueEndYear).toFixed(2));
                replacedStr = replacedStr.replace(/<end_year>/ig, reportDetails.me.end_year);
                replacedStr = replacedStr.replace(/<base_year_value>/ig, Number(baseYearVal).toFixed(2));
                replacedStr = replacedStr.replace(/<base_year>/ig, reportDetails.me.base_year);
                replacedStr = replacedStr.replace(/<cagr_value>/ig, Number(cagr_value).toFixed(2));
                replacedStr = replacedStr.replace(/<subseg_name_fastest>/ig, maxCAGRRowHeader);
                replacedStr = replacedStr.replace(/<CAGR_MAX_VALUE>/ig, Number(maxCAGRValue).toFixed(2));
                replacedStr = replacedStr.replace(/<year_range>/ig, `${Number(reportDetails.me.base_year)+1} - ${reportDetails.me.end_year}`);
                replacedStr = replacedStr.replace(/<metric>/ig, metric);
                replacedStr = replacedStr.replace(/<degree_of_comparision>/ig, degree_of_comparision);
                replacedStr = replacedStr.replace(/<currency_unit>/ig, currencyUnit);
                ele.text = replacedStr;
                // ele.title = ele.key;
            } else {
                ele.text = "";
            }
            if (!utilities.isEmpty(ele.seg_name)
                && !utilities.isEmpty(ele.region_name)) {   // region by segments
                ele.title = `${ele.region_name} By ${ele.seg_name}`.toUpperCase();
            } else if (utilities.isEmpty(ele.seg_name)
                && !utilities.isEmpty(ele.region_name)
                && utilities.isEmpty(ele.country_name)) {   // region by countries
                ele.title = `${ele.region_name} By Countries`.toUpperCase();
            } else if (!utilities.isEmpty(ele.seg_name)
                && utilities.isEmpty(ele.region_name)
                && utilities.isEmpty(ele.country_name)) {    // segments by sub-segments
                ele.title = `${ele.seg_name} By Sub-Segments`.toUpperCase();
            } else if (!utilities.isEmpty(ele.seg_name)
                && !utilities.isEmpty(ele.country_name)) {    // country by segments
                ele.title = `${ele.country_name} By ${ele.seg_name}`.toUpperCase();
            } else if (!utilities.isEmpty(ele.subseg_name)) {   // subsegments by regions
                ele.title = `${ele.subseg_name} By Regions`.toUpperCase();
            }
            if (!utilities.isEmpty(ele.seg_name)
                && utilities.isEmpty(ele.region_name)
                && utilities.isEmpty(ele.country_name)) {
                ele.title = (ele.grid_key.indexOf('parent') !== -1) ? `${ele.seg_name} By Sub-Segments`.toUpperCase() : `${ele.seg_name} By Regions`.toUpperCase();
            }
    });
}
async function getMESegmentViewData(reportId, value = "1", viewKey) {
    let segRes = null;
    segRes = await meModel.getMEViewsSegmentData(reportId, value);
    return (segRes);
}
async function getMERegionViewData(reportId, value = "", viewKey) {
    let regRes = null;
    regRes = await meModel.getMEViewsRegionData(reportId, value);
    return (regRes);
}
async function getMEViewsSegmentRegionData(reportId, value, viewKey) {
    let segData = null;
    let regData = null;
    const gridKeys = [];
    let meCompViewData = [];
    let viewRecords = [];
    let segName = "";
    try {
        segData = await getMESegmentViewData(reportId, value);
        if (utilities.isEmpty(segData)) {
            const errMsg = "No Sergment information found.";
            return ({ "errors": new Error(errMsg) });
        }
        segData = segData[0];
        segData.viewRecords.forEach((ele) => {
            if (ele.pid !== "1") {
                let key = `geography_${segmentNameSymbolReplacement(ele.name)}_parent_value`.toLowerCase().replace(/ /ig,'_');
                gridKeys.push(key);
                viewRecords.push({
                    'grid_key': key,
                    "subseg_name": ele.name,
                    "name": ele.name
                });
            }
        });
        meCompViewData = await meModel.getMEGridDataForViews(reportId, gridKeys) || [];
        if (utilities.isEmpty(meCompViewData) || utilities.isEmpty(meCompViewData[0].gridData)) {
            let err = { "errors": new Error("Grid Data not found!") };
            return err;
        }
        viewRecords = viewRecords.map(itm => ({
            ...meCompViewData[0].gridData.find((item) => (item.key === itm.grid_key) && item),
            ...itm
        }));
        await getTextForViews(reportId, viewRecords, viewKey);
        return viewRecords;
    } catch (ex) {
        console.log(`Eception in getMEViewsSegmentRegionData(): ${ex} `);
        return { "errors": ex.message };
    }
}
const segmentNameSymbolReplacement=(val)=>{
       return val.replace(/ /g,'_')
        .replace(/-/g,'_')
        .replace('(','')
        .replace(')','')
        .replace(/&/,'and')
        .split(',').join('')
        .split('.').join('')
}
module.exports = {
    getTextForViews,
    getMEViewsData,
};
