const mongoose = require('mongoose');
const leadsModel = require('../Models/leads-db.model'); // Ensure you import your model correctly
const HTTPStatus = require('http-status');

const addNewLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Validation
    if (!leadData.company || !leadData.industry_vertical) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        error: 'Company and Industry Vertical are required fields.'
      });
    }

    const newLead = new leadsModel(leadData);
    const savedLead = await newLead.save();
    return res.status(HTTPStatus.CREATED).json({ success: true, data: savedLead });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while adding the lead.',
      details: error.message
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [leads, count] = await Promise.all([
      leadsModel.find().skip(skip).limit(limit).lean(),
      leadsModel.countDocuments()
    ]);

    // Check if no leads are found and return a proper response
    if (!leads || leads.length === 0) {
      return res.status(200).json({ success: true, leads: [], count: 0 });
    }

    // If leads are found, return them with a 200 status
    return res.status(200).json({ success: true, leads, count });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while fetching leads.',
      details: error.message
    });
  }
};


const addLeadsData = async (req, res) => {
  try {
    const id = req.params.company_id;
    const data = req.body;

    // Validation
    if (!data || data.length === 0) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        error: 'Lead data is required.'
      });
    }

    const updatedLead = await leadsModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(id),
      { $push: { leads: { $each: data } } },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        success: false,
        error: 'Lead not found.'
      });
    }

    return res.status(HTTPStatus.OK).json({ success: true, data: updatedLead });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while adding lead data.',
      details: error.message
    });
  }
};

const getLeadsById = async (req, res) => {
  try {
    const id = req.params.company_id;
    const leadData = await leadsModel.findById(mongoose.Types.ObjectId(id));

    if (!leadData) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        success: false,
        error: 'Lead not found.'
      });
    }

    return res.status(HTTPStatus.OK).json({ success: true, data: leadData });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while fetching lead.',
      details: error.message
    });
  }
};

const searchByName = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name && !last_name) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        error: 'At least one of first_name or last_name must be provided.'
      });
    }

    const query = {
      $or: []
    };

    if (first_name) {
      query.$or.push({ 'leads.first_name': { $regex: new RegExp(first_name, 'i') } });
    }
    if (last_name) {
      query.$or.push({ 'leads.last_name': { $regex: new RegExp(last_name, 'i') } });
    }

    const leads = await leadsModel.find(query);
    return res.status(HTTPStatus.OK).json({ success: true, leads });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while searching for leads.',
      details: error.message
    });
  }
};

const searchByCompany = async (req, res) => {
  try {
    const companyName = req.body.company;
    if (!companyName) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        error: 'Company name is required.'
      });
    }

    const leads = await leadsModel.find({
      company: { $regex: companyName, $options: 'i' }
    });
    return res.status(HTTPStatus.OK).json({ success: true, leads });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'An error occurred while searching for companies.',
      details: error.message
    });
  }
};

module.exports = {
  addNewLead,
  getLeads,
  addLeadsData,
  getLeadsById,
  searchByName,
  searchByCompany
};