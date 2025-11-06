var express = require("express");
var axios = require("axios");

var { engine } = require("express-handlebars");

var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var Table = require('cli-table');

var controllers =require("./controllers/index.js");

var app = express();
var PORT =  process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false}));

app.engine('handlebars', engine({defaultLayout: 'layout'}));
app.set('view engine', engine);
app.use(express.static('public'))

var table = new Table({
	head: ['Title', 'url', 'Shot descr']
});

//this function renders a list of news from MIT
app.get("/", async function (req, res) {
	console.log("/");
	var list = [];

	try {
		const response = await axios.get("http://news.mit.edu");
		var $ = cheerio.load(response.data);
		var news = $("li>div", "#latest-news-area");
		var mainTopics = $("li>div", "#featured-items");

		var len = news.length - 1;
		console.log("Number:" + len);
		for (var i = len; i >= 0; i--) {
			console.log(i + ": " + $(news[i]).find("h3").text());
			list.push({
				title: $(news[i]).find("h3").text(),
				body: $(news[i]).find("p").text(),
				photoUrl: $(news[i]).find("img").attr('src'),
				url: $(news[i]).find("a").attr('href')
			});
			list.push({
				title: $(mainTopics[i]).find("h3").text(),
				body: $(mainTopics[i]).find("p").text(),
				photoUrl: $(mainTopics[i]).find("img").attr('src'),
				url: $(mainTopics[i]).find("a").attr('href')
			});
		}

		try {
			await controllers.Articles.create(list);
			const data = await controllers.getLastArticles(50);
			res.render("index", { news: data });
		} catch (err) {
			console.log("Error:");
			if (err.errors?.title?.message) {
				console.log(err.errors.title.message);
			} else {
				console.log(err);
			}
		}
		var temp = {};
		temp["news"] = list;
	} catch (error) {
		console.error(error);
	}
});


app.post("/addnote", async function(req, res){
	try {
		const articleId = req.body.id;
		const note = req.body.note;
		console.log("Update article #"+articleId+", with note: ", note);
		const noteObject = await controllers.Notes.create({note: note});
		console.log("note object ID: "+ noteObject._id);
		await controllers.Articles.updateOne(
			{_id: articleId},
			{$push: {notesList: noteObject._id}}
		);
		res.send(noteObject._id);
	} catch (err) {
		console.error(err);
		res.send("1");
	}
});

app.post("/delete/:articleId/:id", async function(req, res){
	try {
		await controllers.Notes.findByIdAndRemove(req.params.id);
		await controllers.Articles.updateOne(
			{_id: req.params.articleId},
			{$pull: {notesList: req.params.id}}
		);
		res.status(200).send("Done");
	} catch (err) {
		console.error(err);
		res.send("1");
	}
});


app.listen(PORT, (err)=>{
	if (err) throw(err);
	console.log("Server started at "+PORT);
})

