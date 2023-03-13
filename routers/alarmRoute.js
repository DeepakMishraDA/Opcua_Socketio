const express = require('express');
const alarmData = require('../providers/alarmdata')

const users = express.Router();
users.get('/:id', alarmData)
// users.post('/', createUserDoc)

module.exports = users;