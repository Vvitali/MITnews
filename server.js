var express = require("express");

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

		controllers.Articles.create(list, function (err, done) {
			if (err) {
				console.log("Error:");
				console.log(err.errors.title.message);
			}
			controllers.getLastArticles(50, (data) => {
				res.render("index", { news: data });
			});
		});
		var temp = {};
		temp["news"] = list;
	} catch (error) {
		console.error(error);
	}
});


app.post("/addnote", function(req, res){
	var articleId = req.body.id;
	var note = req.body.note;
	console.log("Update article #"+articleId+", with note: ", note);
	controllers.Notes.create({note: note}, function(err, noteObject){
		console.log("note object ID: "+ noteObject._id);
		controllers.Articles.update(
			{_id: articleId},
			{$push: {notesList: noteObject._id}},
			(err)=>{
				if(err){
					res.send("1");
					throw err;
				}else{
					res.send(noteObject._id);
				}
			});
	})
});

app.post("/delete/:articleId/:id", function(req, res){
	controllers.Notes.findByIdAndRemove(req.params.id, (err, answer) => {
		controllers.Articles.update(
			{_id: req.params.articleId},
			{$pull: {notesList: req.params.id}},
			(err)=>{
				if(err){
					res.send("1");
					throw err;
				}else{
					res.status(200).send("Done");
				}
			});

	});
})


app.listen(PORT, (err)=>{
	if (err) throw(err);
	console.log("Server started at "+PORT);
})

