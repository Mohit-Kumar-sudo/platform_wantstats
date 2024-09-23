const mongoose = require("mongoose");
const ReportAccess = require('../Models/Reports_access.Model')

module.exports = {
    getReportsList: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const reportsList = await ReportAccess.aggregate([
                {
                    $match: {
                        userId: mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "reports",
                        localField: "reportIds",
                        foreignField: "_id",
                        as: "reports"
                    }
                },
                {
                    $project: {
                        userId: 1,
                        reportIds: {
                            $map: {
                                input: "$reports",
                                as: "report",
                                in: {
                                    _id: "$$report._id",
                                    approved: "$$report.approved",
                                    createdAt: "$$report.createdAt",
                                    isAnalytics: "$$report.isAnalytics",
                                    isDoc: "$$report.isDoc",
                                    isExcel: "$$report.isExcel",
                                    isPdf: "$$report.isPdf",
                                    title: "$$report.title"
                                }
                            }
                        },
                        charts: 1
                    }
                }
            ]);
    
            res.json({ data: reportsList });
        } catch (error) {
            next(error);
        }
    },
    addReports: async (req, res, next) => {
        try {
            const query = req.body;
            const doesExist = await ReportAccess.findOne({ userId: mongoose.Types.ObjectId(query.userId) });
            
            if (doesExist) {
                const updatedReport = await ReportAccess.findOneAndUpdate(
                    { userId: mongoose.Types.ObjectId(query.userId) },
                    { $set: { reportIds: query.reportIds } },
                    { new: true } // Return the updated document
                );
                res.json({ data: updatedReport });
            } else {
                const newReport = new ReportAccess(query);
                const result = await newReport.save();
                res.json({ data: result });
            }
        } catch (error) {
            next(error);
        }
    },
    updateReports: async (req, res, next) => {
        try {
            const query = req.body;
            const updatedReport = await ReportAccess.findOneAndUpdate(
                { userId: mongoose.Types.ObjectId(query.userId) },
                { $set: { reportIds: query.reportIds } },
                { new: true } // Return the updated document
            );
            res.json({ data: updatedReport });
        } catch (error) {
            next(error);
        }
    },
    addCharts: async (req, res, next) => {
        try {
            const query = req.body;
            const doesExist = await ReportAccess.findOne({ userId: mongoose.Types.ObjectId(query.userId) });
    
            if (doesExist) {
                const updatedCharts = await ReportAccess.findOneAndUpdate(
                    { userId: mongoose.Types.ObjectId(query.userId) },
                    { $set: { charts: query.charts } },
                    { new: true } // Return the updated document
                );
                res.json({ data: updatedCharts });
            } else {
                const newReport = new ReportAccess(query);
                const result = await newReport.save();
                res.json({ data: result });
            }
        } catch (error) {
            next(error);
        }
    },
    updateCharts: async (req, res, next) => {
        try {
            const query = req.body;
            const updatedCharts = await ReportAccess.findOneAndUpdate(
                { userId: mongoose.Types.ObjectId(query.userId) },
                { $set: { charts: query.charts } },
                { new: true } // Return the updated document
            );
            res.json({ data: updatedCharts });
        } catch (error) {
            next(error);
        }
    },
            
}