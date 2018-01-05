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
	var $ = cheerio.load(body);
	var news = $("div.descr >h3");
	console.log(news[0].children[0].data);
	for(var newsItem in news){
		console.log(news[newsItem].children[0].data);
	}
})
	//#latest-news-area > ul > li.article > div > a > div > 
	