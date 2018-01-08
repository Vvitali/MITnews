var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var Articles = require('../models/posts.js');

db.on('error', console.error.bind(console, 'connection error:'));

function createArticle(title, body, url, photoUrl, note){
	Articles.find({
		title: title
	}).then((data))
	var post = new Articles({
		title: title,
		body: body,
		url: url, 
		photoUrl: photoUrl,
		note: note
	});

	post.save(function(err){
		assert.equal(err.title, 'osh');
	});
};

function getLastArticles(number, cb){
	Articles.find({}).sort({'date': -1}).limit(number).then((data)=>{
		cb(data);
	});
};

db.once('open', function() {
  // we're connected!
  console.log("Mongoose is hangry!");  
  // Articles.find({}, (error, data)=>{
  // 	console.log("Result:")
  // 	console.log(data)
  // });
});
module.exports = {
	db: db,
	Articles: Articles,
	createArticle: createArticle,
	getLastArticles: getLastArticles
};

