var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

var app = express();

app.use(bodyParser.urlencoded({ extended: false}));

request("http://news.mit.edu", (error, response, body)=>{
	if(error) console.error(error);

})