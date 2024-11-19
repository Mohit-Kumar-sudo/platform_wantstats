const mongoose = require("mongoose");
const leadsModel = require("../Models/leads-db.model"); // Ensure you import your model correctly
const HTTPStatus = require("http-status");
const utilities = require("../utilities/utils");
const to = require("../utilities/to");

module.exports = {
  getLeads: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;
  
      // Fetch leads with pagination
      const leads = await leadsModel.find().skip(skip).limit(limit).lean();
  
      // Get the total count of leads
      const count = await leadsModel.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
  
      // Construct and send the response in the required format
      res.status(200).json({
        data: {
          leads: leads,
          count: count
        }
      });
    } catch (error) {
      next(error);
    }
  },  
  searchByName: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;
        const leads = await leadsModel.find().skip(skip).limit(limit).lean();
  
      // Get the total count of leads
      const count = await leadsModel.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
  
      // Construct and send the response
      res.status(200).json({
        success: true,
        data: leads,
        pagination: {
          count,
          page,
          totalPages,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
