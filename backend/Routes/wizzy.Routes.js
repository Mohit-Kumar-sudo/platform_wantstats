const express = require('express');
const routes = express.Router();

const chat_bot = require('../Controllers/wizzy.Controller');

routes.post('/chatData', chat_bot.getChatBot);

routes.post('/fetchReport', chat_bot.fetchReport);

module.exports = routes;
