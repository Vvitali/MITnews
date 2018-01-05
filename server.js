var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var Table = require('cli-table');

var request = require("request");

var app = express();

app.use(bodyParser.urlencoded({ extended: false}));


var table = new Table({
	head: ['Title', 'Shot descr']
});
request("http://news.mit.edu", (error, response, body)=>{
	if(error) console.error(error);
	var $ = cheerio.load(body);
	var news = $("div.descr");
	///console.log(news[0].children[0]);
	for(var i = 0; i< 10; i++){
		table.push([news[i].children[0].children[0].data, news[i].children[1].children[0].data]);
	}

	console.log(table.toString());
})
	//#latest-news-area > ul > li.article > div > a > div > 
	

// instantiate 


// table is an Array, so you can `push`, `unshift`, `splice` and friends 

