const createError = require("http-errors");
const _ = require('lodash');
const Reports = require("../Models/Reports.Model");
const mongoose = require("mongoose");
const HTTPStatus = require("http-status-codes");
const utilities = require('../utilities/utils')
const to = require('../utilities/to')
// const meModel = require('../Models/me.modal');
// // import meService from "../market_estimation/me.service";
const dataConstants = require('../config/dataConstants');


module.exports = {
    createReport: async (req, res, next) => {
        try {
          const reportDetails = req.body;
          const rdetails = { ...reportDetails };
          const reportObj = new Reports(rdetails);
          const savedReport = await reportObj.save();
          res.json({data:savedReport});
        } catch (error) {
          next(error);
        }
      },
    
      getReports: async (req, res, next) => {
        try {
            const user = req.user;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10; 
            const skip = (page - 1) * limit;
    
            const reports = await Reports.aggregate([
                {
                    $match: {
                        approved: true,
                        $or: [
                            { isAnalytics: true },
                            { isPdf: true }
                        ]
                    }
                },
                {
                    $sort: { "createdAt": -1 }
                },
                {
                    $group: {
                        _id: "$vertical",
                        count: { $sum: 1 },
                        reports: {
                            $push: {
                                title: "$title",
                                pdfLink: "$pdfLink",
                                excelLink: "$excelLink",
                                docLink: "$docLink",
                                _id: "$_id",
                                approved: "$approved",
                                isPdf: "$isPdf",
                                isExcel: "$isExcel",
                                isDoc: "$isDoc",
                                isAnalytics: "$isAnalytics",
                                createdAt: "$createdAt",
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        reports: { $slice: ["$reports", skip, limit] }, // Apply pagination
                        count: 1
                    }
                }
            ]);
    
            let allReports = [];
            for (const item of reports) {
                allReports.push(...item.reports);
            }
    
            const totalReports = await Reports.countDocuments({
                approved: true,
                $or: [
                    { isAnalytics: true },
                    { isPdf: true }
                ]
            });
    
            res.json({
                data: allReports,
                count: allReports.length,
                totalReports,
                totalPages: Math.ceil(totalReports / limit),
                currentPage: page
            });
        } catch (error) {
            next(error);
        }
    },
    
    
      getReportNameString: (req, res, next) => {
        try {
          const str = req.params.str;
          let temp = str.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
          temp = temp.replace(/ {2,}/g, " ");
          temp = temp.split(" ").join(" ");
          res.json({data:{ sanitizedString: temp }});
        } catch (error) {
          next(error);
        }
      },
    
    //   fetchReport: async (req, res, next) => {
    //     console.log("req.body", req.body); // Fixed to log req.body instead of res
    //     try {
    //         let { reportId, reportName = "", vertical, selectKeys, companyId, user } = req.body;
    //         reportId = req.params.rid || reportId;
    //         selectKeys = req.query.select;
    
    //         let query = Reports.find(); // Start with a basic find query
    
    //         // Apply user-based vertical filter (if applicable)
    //         if (user && user.strictlyAllowedReportTypes && user.strictlyAllowedReportTypes.length) {
    //             query.where({ vertical: { $in: user.strictlyAllowedReportTypes } });
    //         }
    
    //         // Filter by reportId if provided
    //         if (reportId) {
    //             query.where({ _id: new mongoose.Types.ObjectId(reportId) });  // Ensure ObjectId instantiation
    //             query.select("me.start_year me.end_year me.base_year me.segment me.geo_segment me.data me.status");
    //         }
    
    //         // Filter by reportName if provided
    //         if (reportName) {
    //             query.where({
    //                 searching_title: {
    //                     $regex: new RegExp(reportName, "i")
    //                 },
    //                 approved: true
    //             });
    //         }
    
    //         // Apply reportIds filter if the user has a list of allowed report IDs
    //         if (user && user.reportIds && user.reportIds.length) {
    //             query.where({ _id: { $in: user.reportIds } });
    //         }
    
    //         // Filter by vertical if provided
    //         if (vertical) {
    //             query.where({ vertical: vertical });
    //         }
    
    //         // Always ensure reports are approved
    //         query.where({ approved: true });
    
    //         // Handle selectKeys if provided
    //         if (selectKeys) {
    //             let selKeysArr = selectKeys.split(",");
    //             [
    //                 "title",
    //                 "vertical",
    //                 "category",
    //                 "owner",
    //                 "status",
    //                 "approver",
    //                 "tocList",
    //                 "title_prefix"
    //             ].forEach(item => {
    //                 if (!selKeysArr.includes(item)) {
    //                     selKeysArr.push(item); // Add default fields if not present in selectKeys
    //                 }
    //             });
    //             query.select(selKeysArr); // Apply the selected fields
    //         } else {
    //             // If selectKeys are not provided, use default fields
    //             query.select("title vertical category owner status approver tocList title_prefix");
    //         }
    
    //         // Apply companyId filter if provided
    //         if (companyId) {
    //             query.where({ "cp.company_id": companyId });
    //         }
    
    //         // Execute the query
    //         const report = await query.lean().exec({ virtuals: true });
    //         console.log("reportdata", report);
    
    //         res.json({ data: report });
    
    //     } catch (error) {
    //         next(error); // Pass any errors to error-handling middleware
    //     }
    // },

    fetchMe: async (req, res, next) => {
      try {
        let { reportName, vertical, selectKeys, companyId } = req.query;
        let { rid } = req.params;
        let user = req.user; 
    
        let query = { approved: true }; 
    
        if (rid) query._id = new mongoose.Types.ObjectId(rid);
        if (reportName)  query.where({
          searching_title: {
            $regex: new RegExp(reportName, "i")
          },
          approved: true
        });
    
        if (vertical) query.vertical = vertical;
        if (companyId) query["cp.company_id"] = companyId;
        
        if (user && user.strictlyAllowedReportTypes && user.strictlyAllowedReportTypes.length) {
          query.vertical = { $in: user.strictlyAllowedReportTypes };
        }
        
        if (user && user.reportIds && user.reportIds.length) {
          query._id = { $in: user.reportIds };
        }
    
        const reports = await Reports.find(query).select("me").lean();
    
        if (!reports.length) {
          return res.json({ message: "No Data found" });
        }
    
        res.json({ data: reports });
      } catch (error) {
        next(error);
      }
    },

    fetchCp : async (req, res, next)=>{
      try {
        let { reportName, vertical, selectKeys, companyId } = req.query;
        let { rid } = req.params;
        let user = req.user; 
    
        let query = { approved: true }; 
    
        if (rid) query._id = new mongoose.Types.ObjectId(rid);
        if (reportName)  query.where({
          searching_title: {
            $regex: new RegExp(reportName, "i")
          },
          approved: true
        });
        if (vertical) query.vertical = vertical;
        if (companyId) query["cp.company_id"] = companyId;
        
        if (user && user.strictlyAllowedReportTypes && user.strictlyAllowedReportTypes.length) {
          query.vertical = { $in: user.strictlyAllowedReportTypes };
        }
        
        if (user && user.reportIds && user.reportIds.length) {
          query._id = { $in: user.reportIds };
        }
    
        const reports = await Reports.find(query).select("title category vertical cp me.start_year me.end_year me.base_year overlaps owner tocList status title_prefix youtubeContents").lean();
    
        if (!reports.length) {
          return res.status(404).json({ message: "No reports found" });
        }
    
        res.json({ data: reports });
      } catch (error) {
        next(error);
      }
    },
    searchReportTitle: async (req, res, next)=>{
      try {
        let { reportName, vertical, selectKeys, companyId } = req.query;
        let { rid } = req.params;
        let user = req.user; 
    
        let query = { approved: true }; 
    
        if (rid) query._id = new mongoose.Types.ObjectId(rid);
        if (reportName) {query.searching_title = { $regex: new RegExp(reportName, "i") };}    
        if (vertical) query.vertical = vertical;
        if (companyId) query["cp.company_id"] = companyId;
        
        if (user && user.strictlyAllowedReportTypes && user.strictlyAllowedReportTypes.length) {
          query.vertical = { $in: user.strictlyAllowedReportTypes };
        }
        
        if (user && user.reportIds && user.reportIds.length) {
          query._id = { $in: user.reportIds };
        }
    
        const reports = await Reports.find(query).select("title isAnalytics approved isExcel isPdf isDoc pdfLink excelLink docLink me").lean();
    
        if (!reports.length) {
          return res.status(404).json({ message: "No reports found" });
        }
    
        res.json({ data: reports });
      } catch (error) {
        next(error);
      }
    },
       
      getReportByKeys: async (req, res, next) => {
        try {
          const { reportId, keyString = "" } = req.body;
          const query = Reports.find();
          query.where({ _id: mongoose.Types.ObjectId(reportId) });
          if (keyString) {
            query.select(keyString);
          }
          const report = await query.lean().exec({ virtuals: true });
          res.json({data:report});
        } catch (error) {
          next(error);
        }
      },
    
      searchReportByName: async (req, res, next) => {
        try {
          const { searchString, keyString } = req.body;
          const query = Reports.find();
          query.select(keyString);
          query.where({
            searching_title: {
              $regex: `\\b${getReportNameString(searchString)}\\b`,
              $options: "i"
            }
          });
          const report = await query.lean().exec({ virtuals: true });
          res.json({data:report});
        } catch (error) {
          next(error);
        }
      },
    
      getReportsByKeys: async (req, res, next) => {
        try {
          const { keys = "", ids = [] } = req.body;
          const query = Reports.find();
          const idsArray = [];
          if (ids && ids.length) {
            ids.forEach(item => {
              idsArray.push(mongoose.Types.ObjectId(item));
            });
            query.where({ _id: { $in: idsArray } });
          }
          if (keys) {
            query.select(keys.split(","));
          }
          const reports = await query.lean().exec({ virtuals: true });
          res.json({data:reports});
        } catch (error) {
          next(error);
        }
      },
    
      fetchReportForCompany: async (req, res, next) => {
        try {
          const { selectKeys, companyId, companyName } = req.body;
          const query = Reports.find();
    
          const selectObj = {
            _id: 1,
            title: 1,
            status: 1,
            "cp.$": 1
          };
    
          if (!utilities.isEmpty(companyId)) {
            query.where({ "cp.company_id": companyId });
          }
    
          if (!utilities.isEmpty(companyName)) {
            query.where({ "cp.company_name": { $regex: companyName, $options: "i" } });
          }
    
          query.select(selectObj);
          query.sort({ updatedAt: -1 });
    
          const reports = await query.lean().exec({ virtuals: true });
          res.json({data:reports});
        } catch (error) {
          next(error);
        }
      },
    
      addNewCustomModule: async (req, res, next) => {
        try {
          const { reportId, moduleObj } = req.body;
          const moduleObjNew = { ...moduleObj, ...{ is_main_section_only: true } };
          const updateRes = await Reports.update(
            { _id: mongoose.Types.ObjectId(reportId) },
            { $push: { tocList: moduleObjNew } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );
          res.json({data:updateRes});
        } catch (error) {
          next(error);
        }
      },

      getSectionDetailsFromSectionKey: async (req, res, next) => {
        try {
          const { reportId, sectionKey } = req.body;
          let matchQuery = {};
          matchQuery = { ...matchQuery, ...{ _id: mongoose.Types.ObjectId(reportId) } };
          matchQuery = {
            ...matchQuery,
            ...{
              "tocList.section_key": {
                $regex: new RegExp(`.*${sectionKey.toLowerCase()}.*`, "i")
              }
            }
          };
    
          const selectObj = { "tocList.$": 1 };
          const query = Reports.findOne(matchQuery, selectObj);
          const sectionDetails = await query.lean().exec({ virtuals: true });
          res.json({data:sectionDetails});
        } catch (error) {
          next(error);
        }
      },
    
      addCompanyProfileData: async (req, res, next) => {
        try {
          const { reportId, companyList } = req.body;
          const queryPromise = await Reports.update(
            { _id: mongoose.Types.ObjectId(reportId) },
            { cp: companyList },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      addNewCompanyData: async (req, res, next) => {
        try {
          const { reportId, company } = req.body;
          const cpData = await Reports.update(
            { _id: mongoose.Types.ObjectId(reportId) },
            {
              $push: {
                cp: {
                  company_id: company.company_id,
                  company_name: company.company_name
                }
              }
            }
          );
          res.json({data:cpData});
        } catch (error) {
          next(error);
        }
      },

      deleteReportCompany: async (req, res, next) => {
        try {
          const { reportId, company } = req.body;
          const cpData = await Reports.update(
            { _id: mongoose.Types.ObjectId(reportId) },
            {
              $pull: {
                cp: {
                  company_id: company.company_id,
                  company_name: company.company_name
                }
              }
            }
          );
          res.json({data:cpData});
        } catch (error) {
          next(error);
        }
      },
    
      addReportOverlapsData: async (req, res, next) => {
        try {
          const { data, reportId } = req.body;
          const result = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(reportId) },
            {
              $set: { overlaps: data.overlaps, youtubeContents: data.youtubeContents }
            },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      addCompanyOverview: async (req, res, next) => {
        try {
          const { coData, cpID, reportId } = req.body;
          const queryPromise = await Reports.update(
            {
              _id: mongoose.Types.ObjectId(reportId),
              "cp.company_id": mongoose.Types.ObjectId(cpID)
            },
            {
              $set: { "cp.$.company_overview": coData }
            },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      addSwotAnalysis: async (req, res, next) => {
        try {
          const { saData, cpID, reportId } = req.body;
          const queryPromise = await Reports.update(
            {
              _id: mongoose.Types.ObjectId(reportId),
              "cp.company_id": mongoose.Types.ObjectId(cpID)
            },
            {
              $set: { "cp.$.swot_analysis": saData }
            },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      addKeyDevelopments: async (req, res, next) => {
        try {
          const { kdData, cpID, reportId } = req.body;
          const queryPromise = await Reports.update(
            {
              _id: mongoose.Types.ObjectId(reportId),
              "cp.company_id": mongoose.Types.ObjectId(cpID)
            },
            {
              $set: { "cp.$.key_development": kdData }
            },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      addStrategyInfo: async (req, res, next) => {
        try {
          const { stData, cpID, reportId } = req.body;
          const queryPromise = await Reports.update(
            {
              _id: mongoose.Types.ObjectId(reportId),
              "cp.company_id": mongoose.Types.ObjectId(cpID)
            },
            {
              $set: { "cp.$.strategy": stData }
            },
            { new: true, setDefaultsOnInsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      getCompanyReportDataByKey: async (req, res, next) => {
        try {
          const { reportId, companyId, key } = req.body;
          const query = Reports.find({ _id: mongoose.Types.ObjectId(reportId) }, "title");
          if (!utilities.isEmpty(companyId) && !utilities.isEmpty(key)) {
            query.findOne({ "cp.company_id": companyId }, `cp._id cp.company_name cp.company_id cp.${key}`);
          }
          const result = await query.lean().exec({ virtuals: true });
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      getReportMenuItems: async (req, res, next) => {
        try {
          const { reportId } = req.params;
          console.log("reportIdd",reportId)
          const reportData = await Reports.findOne({ _id: mongoose.Types.ObjectId(reportId) });
          res.json({data:reportData});
        } catch (error) {
          // next(error);
        }
      },
    
      getReportCompleteData: async (req, res, next) => {
        try {
          const { id } = req.params;
          const reportData = await Reports.findOne({ _id: mongoose.Types.ObjectId(id) });
          res.json({data:reportData});
        } catch (error) {
          next(error);
        }
      },
    
      getFilteredReports: async (req, res, next) => {
        try {
          const { domain } = req.params;
          const reportData = await Reports.find({ vertical: domain });
          res.json({data:reportData});
        } catch (error) {
          next(error);
        }
      },
    
      addReportStatus: async (req, res, next) => {
        try {
          const { data, id } = req.body;
          const queryPromise = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { status: data },
            { upsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      getReportStatus: async (req, res, next) => {
        try {
          const { id } = req.params;
          const queryPromise = await Reports.findOne({ _id: mongoose.Types.ObjectId(id) }).select("status");
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      updateReportStatus: async (req, res, next) => {
        try {
          const { data, id } = req.body;
          const queryPromise = await Reports.updateMany(
            {
              _id: mongoose.Types.ObjectId(id),
              "status.main_section_id": data.section_id
            },
            { $set: { "status.$.status": data.status } }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },
    
      getMeChartsByTitles: async (req, res, next) => {
        try {
          const { str } = req.params;
          const titles = str.split(',').map(title => decodeURIComponent(title.trim()));
          const regexTerms = titles.map(title => new RegExp(title, 'i'));
          const query = Reports.find();
          query.where({ "titles.title": { $in: regexTerms } });
          query.select("titles _id title");
          const result = await query.lean().exec({ virtuals: true });
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      getMeChartsCount: async (req, res, next) => {
        try {
          const query = Reports.aggregate([
            {
              $match: {
                $or: [
                  { titles: { $exists: true, $ne: null } },
                  { "me.data": { $exists: true, $ne: null } }
                ],
                $and: [{ approved: true }]
              }
            },
            {
              $group: {
                _id: {
                  titles: "$titles",
                  data: "$me.data.key"
                },
                reportId: { $first: "$_id" },
                title: { $first: "$title" }
              }
            }
          ]);
          const result = await query;
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      getMeChartsTitlesById: async (req, res, next) => {
        try {
          const { id } = req.params;
          const query = Reports.find();
          query.where({ _id: mongoose.Types.ObjectId(id) });
          query.select("titles _id title");
          const result = await query.lean().exec({ virtuals: true });
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      getRelatedReportReports: async (req, res, next) => {
        try {
          const { reportId } = req.params;
          const query = Reports.find({ _id: mongoose.Types.ObjectId(reportId) });
          if (!utilities.isEmpty(reportId)) {
            query.findOne({ "overlaps.section_name": "Report" }, { "overlaps.$.1": 1 });
          }
          const result = await query.lean().exec({ virtuals: true });
          res.json({data:result});
        } catch (error) {
          next(error);
        }
      },
    
      addTitles: async (req, res, next) => {
        try {
          const { id, data } = req.body;
          const queryPromise = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { titles: data },
            { upsert: true }
          );
          res.json({data:queryPromise});
        } catch (error) {
          next(error);
        }
      },

      getContentByKey: async (reportId, metaKey) => {
        try {
          const matchQuery = {
            _id: mongoose.Types.ObjectId(reportId),
            "toc.meta_info.section_key": { $regex: new RegExp(`.*${metaKey}.*`, "i") }
          };
          const selectObj = { "toc.$.1": 1 };
          const query = await Reports.findOne(matchQuery, selectObj).lean().exec();
          return query;
        } catch (error) {
          throw error;
        }
      },
    
      getContentByName: async (reportId, metaName) => {
        try {
          const matchQuery = {
            _id: mongoose.Types.ObjectId(reportId),
            "toc.meta_info.section_value": { $regex: new RegExp(`.*${metaName}.*`, "i") }
          };
          const selectObj = { "toc.$.1": 1 };
          const query = await Reports.findOne(matchQuery, selectObj).lean().exec();
          return query;
        } catch (error) {
          throw error;
        }
      },
    
      getContentBySectionName: async (reportId, sectionName) => {
        try {
          const matchQuery = {
            _id: mongoose.Types.ObjectId(reportId),
            "toc.section_name": { $regex: new RegExp(`.*${sectionName}.*`, "i") }
          };
          const selectObj = { "toc.$.1": 1 };
          const query = await Reports.findOne(matchQuery, selectObj).lean().exec();
          return query;
        } catch (error) {
          throw error;
        }
      },
    
      titlePrefix: async (reportId, prefix) => {
        try {
          const updateResult = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(reportId) },
            { title_prefix: prefix.title_prefix },
            { upsert: true }
          );
          return updateResult;
        } catch (error) {
          throw error;
        }
      },
    
      setReportModuleSequence: async (data, reportId) => {
        try {
          console.log("tocList", data);
          const updateResult = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(reportId) },
            { tocList: data },
            { upsert: true }
          );
          return updateResult;
        } catch (error) {
          throw error;
        }
      },
    
      setPdfReport: async (reportId, link) => {
        try {
          const updateResult = await Reports.updateOne(
            { _id: mongoose.Types.ObjectId(reportId) },
            { pdfLink: link, isPdf: true },
            { upsert: true }
          );
          return updateResult;
        } catch (error) {
          throw error;
        }
      },
    
      addPdfReport: async (title, link) => {
        try {
          const reportObj = new Reports({
            title: title,
            pdfLink: link,
            isAnalytics: false,
            isPdf: true
          });
          const savedReport = await reportObj.save();
          return savedReport;
        } catch (error) {
          throw error;
        }
      },
    
      readCSV: async (req, res, next) => {
        try {
          console.log("Read CSV");
          fs.readFile("./uploads/report_data3.json", async (err, jsonString) => {
            try {
              if (err) {
                console.log("File read failed:", err);
                return res.send(err);
              }
              jsonString = JSON.parse(jsonString);
              let reportTitles = [];
              jsonString.forEach(item => {
                if (!reportTitles.includes(item["Report Title"])) {
                  reportTitles.push(item["Report Title"]);
                }
              });
              let reportsData = [];
              let pdfDomains = [];
              reportTitles.forEach(item => {
                let tempReports = _.filter(jsonString, ["Report Title", item]);
                let obj = {
                  title: item,
                  isAnalytics: false,
                  approved: true,
                  owner: req.user._id,
                  vertical: dataConstants.REPORT_CATEGORY.DEFAULT
                };
                tempReports.forEach(r => {
                  if (r.Link.endsWith(".docx")) {
                    obj.isDoc = true;
                    obj.docLink = r.Link;
                  } else if (r.Link.endsWith(".pdf")) {
                    obj.isPdf = true;
                    obj.pdfLink = r.Link;
                  } else if (r.Link.endsWith(".xlsx")) {
                    obj.isExcel = true;
                    obj.excelLink = r.Link;
                  }
                });
                let url = obj.docLink || obj.pdfLink || obj.excelLink;
                if (url) {
                  let domains = [
                    "AND",
                    "CnM",
                    "Auto",
                    "AGRI",
                    "EnP",
                    "IAE",
                    "CFnB",
                    "PCM",
                    "ICT",
                    "HC",
                    "Automotive",
                    "CNM",
                    "SEM",
                    "CFNB",
                    "ENP",
                    "AUTOMOTIVE",
                    "PCM",
                    "ICT"
                  ];
                  let d = url.split("/")[7];
                  if (!pdfDomains.includes(d)) {
                    pdfDomains.push(d);
                  }
                  if (!domains.includes(d)) {
                    console.log("===>", d);
                    console.log("url===>", url);
                    console.log("\n\n");
                  }
                  obj.vertical = d ? getVertical(d) : dataConstants.REPORT_CATEGORY.DEFAULT;
                }
                reportsData.push(obj);
              });
              console.log("pdfDomains", pdfDomains);
              for (const item of reportsData) {
                const query = { title: item.title };
                const update = { $set: { ...item } };
                const options = { upsert: true };
                await Reports.updateOne(query, update, options);
              }
              return res.send({ Message: "Operation Completed" });
            } catch (e) {
              console.log(e);
              return res.status(500).send(e);
            }
          });
        } catch (error) {
          next(error);
        }
      },
    
      getVertical: (domain) => {
        if (domain === "AND") {
          return "AnD";
        } else if (domain === "CnM" || domain === "CNM") {
          return "CNM";
        } else if (["EnP", "IAE", "CFnB", "CFNB", "ENP", "AGRI", "PCM", "ICT"].includes(domain)) {
          return domain;
        } else if (domain === "HC") {
          return "Healthcare";
        } else if (domain === "Automotive" || domain === "Auto" || domain === "AUTOMOTIVE") {
          return "Auto";
        } else if (domain === "SEM") {
          return "SEMI";
        } else {
          console.log("domain=>", domain);
          return "default";
        }
      },
    
      // searchReport: async (req, res, next) => {
      //   try {
      //     let q = req.query.q || null;
      //     const reports = await Reports.find(
      //       {
      //         searching_title: {
      //           $regex: `\\b${getReportNameString(q)}\\b`,
      //           $options: "i"
      //         },
      //         approved: true
      //       },
      //       { title: 1, _id: 1 }
      //     );
      //     res.status(200).send({ data: reports });
      //   } catch (error) {
      //     console.log("Error in search API", error);
      //     res.status(500).send(error);
      //   }
      // },
    
      reportCharts: async (reportId) => {
        try {
          const reportData = await Reports.findOne({
            _id: mongoose.Types.ObjectId(reportId)
          });
          return reportData;
        } catch (error) {
          throw error;
        }
      },
    
      getTitles: async (req, res) => {
        try {
          const query = await Reports.aggregate([
            {
              $match: {
                titles: {
                  $exists: true,
                  $ne: null
                }
              }
            },
            {
              $group: {
                _id: "$titles",
                reportId: { $first: "$_id" }
              }
            }
          ]);
          res.status(200).send(query);
        } catch (error) {
          res.status(500).send(error);
        }
      },
    
      getIndustryReport: async (reportId) => {
        try {
          const reportData = await Reports.findOne({
            _id: mongoose.Types.ObjectId(reportId.rid)
          });
          return reportData;
        } catch (error) {
          throw error;
        }
      },
    
      getReportByTitle: async (title) => {
        try {
          const reports = await Reports.find({ searching_title: RegExp(title, 'i'), approved: true });
          return reports;
        } catch (error) {
          throw error;
        }
      },
    
      getReportById: async (id) => {
        try {
          const report = await Reports.findOne({ _id: mongoose.Types.ObjectId(id) });
          return report;
        } catch (error) {
          throw error;
        }
      }

}