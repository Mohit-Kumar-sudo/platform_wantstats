const express = require('express')
const routes = express.Router();

const meController = require('../Controllers/me.controller')


routes.get('/:rid/views' , meController.getMEViewsData);

module.exports = routes;
