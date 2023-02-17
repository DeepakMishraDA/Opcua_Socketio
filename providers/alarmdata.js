var express = require('express');
var json = require('./alarmdata.json');

const alarmData = (req,res) => {
     console.log("::",req.params);
    if(req.params.id == 38990){res.json(json)
 }
}; 
module.exports = alarmData;