var express = require("express");

var handlebars = require("express-handlebars");

var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var Table = require('cli-table');

var request = require("request");

var controllers =require("./controllers/index.js");

var app = express();
var PORT =  process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false}));

app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'))

var table = new Table({
	head: ['Title', 'url', 'Shot descr']
});

//this function renders a list of news from MIT
app.get("/", function(req, res){
	console.log("/");
	var list = [];
	request("http://news.mit.edu", (error, response, body)=>{
		if(error) console.error(error);
		var $ = cheerio.load(body);
		var news = $("li.mit-news>div.wrapper>");
		//href : news[i].attribs.href
		//img src : news[i].children[1].children[0].attribs.src
		//title : 	   news[i].children[1].children[1].children[0].children[0].data
		//desrciption: news[i].children[1].children[1].children[1].children[0].data
		var len = news.length;
		for(var i = 0; i< len; i++){
			list.push({
				title: news[i].children[1].children[1].children[0].children[0].data
				, body:news[i].children[1].children[1].children[1].children[0].data
				, photoUrl: news[i].children[1].children[0].attribs.src
				, url: news[i].attribs.href
				, note: ""
			});
			//table.push([news[i].children[0].children[0].data, news[i].children[1].children[0].data.substring(0, 80)]);
		}
		controllers.Articles.create(list, function(err, done){
			if(err){
				console.log("Error:")
				console.log(err);
			} 
			controllers.getLastArticles(10, (data)=>{
				console.log(data);
				res.render("index", {news: data});
			});
		})
		var temp = {};
		temp["news"] = list;
		
	});
});


app.listen(PORT, (err)=>{
	if (err) throw(err);
	console.log("Server started at "+PORT);
})

