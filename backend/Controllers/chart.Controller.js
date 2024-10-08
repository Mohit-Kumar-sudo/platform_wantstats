const HTTPStatus = require('http-status');
const mongoose = require('mongoose');
const Reports = require('../Models/Reports.Model'); // Import the Reports model

// Controller to get chart data
const getChartData = async (req, res) => {
    try {
        const reportId = req.params['rid'] || null;
        const chartSearchName = req.query['q'] || '';

        // Construct the initial match query for fetching chart data
        let initialMatchQuery = {};

        if (reportId) {
            initialMatchQuery = { "_id": mongoose.Types.ObjectId(reportId) };
        }

        initialMatchQuery = {
            ...initialMatchQuery,
            "$or": [
                { "toc.content.type": "CHART" },
                { "toc.content.data.type": "CHART" },
                { "toc.content.type": "PIE" },
                { "toc.content.data.type": "PIE" },
                { "toc.content.type": "BAR" },
                { "toc.content.data.type": "BAR" }
            ]
        };

        // Fetch chart data from the database
        const chartData = await Reports.aggregate([
            { "$match": { "approved": true, "titles": { $exists: true, $ne: null, $type: "array" } } },
            { "$match": initialMatchQuery },
            { "$unwind": "$toc" },
            { "$unwind": "$toc.content" },
            { "$unwind": "$toc.content.data" },
            { "$match": { 
                "$or": [
                    { "toc.content.data.type": "CHART" },
                    { "toc.content.data.type": "PIE" },
                    { "toc.content.data.type": "BAR" },
                    { "toc.content.type": "CHART" },
                    { "toc.content.type": "PIE" },
                    { "toc.content.type": "BAR" },
                    { "toc.content.type": "IMAGE", "toc.content.data.type": "1" }
                ] 
            }},
            { "$project": { "toc.section_name": 1, "toc.section_id": 1, "toc.content": 1 } }
        ]);

        // Split the search terms by comma and trim each term
        const searchTerms = chartSearchName.split(',').map(term => term.trim());

        // Create an array of regex conditions for each search term
        const regexConditions = searchTerms.map(term => ({
            "toc.content.data.title": { $regex: term, $options: "i" }
        }));

        // Fetch additional charts by title using the constructed `$or` array
        const meChartsData = await Reports.aggregate([
            {
                "$match": {
                    "$or": regexConditions
                }
            }
        ]);

        // Handle case where no chart data is found
        if (!chartData.length) {
            return res.status(HTTPStatus.NOT_FOUND).json({ error: true, message: 'No chart data found' });
        }

        // Handle case where no meChartsData is found
        if (!meChartsData.length) {
            console.warn("No charts found matching the titles.");
        }

        // Send the fetched data as a response
        return res.status(HTTPStatus.OK).json({ chartData, meChartsData });

    } catch (error) {
        console.error('Error fetching chart data:', error);
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: true, message: error.message });
    }
};

// Controller to get charts count
const getChartsCount = async (req, res) => {
    try {
        const queryRes = await Reports.aggregate([
            {
                $match: {
                    approved: true,
                    titles: { $exists: true, $ne: null, $type: "array" }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: { $size: "$titles" } }
                }
            }
        ]);

        return res.status(HTTPStatus.OK).json(queryRes);
    } catch (error) {
        console.error('Error fetching charts count:', error);
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: true, message: error.message });
    }
};

// Export controllers
module.exports = {
    getChartData,
    getChartsCount
};