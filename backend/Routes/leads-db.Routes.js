const express = require('express');
const leadsController = require('../Controllers/leads-db.Controller');

const routes = express.Router();

routes.get('/', leadsController.getLeads);
routes.post('/', leadsController.addNewLead);
routes.post('/leadsdb/:company_id', leadsController.addLeadsData);
routes.get('/:company_id', leadsController.getLeadsById);
routes.post('/leadSearchByName', leadsController.searchByName);
routes.post('/searchByCompany', leadsController.searchByCompany);

module.exports = routes;