var mongoose = require('mongoose');
mongoose.connect('mongodb://tst:password@ds237967.mlab.com:37967/heroku_d4x6lvfp');
var db = mongoose.connection;
var Notes = require('../models/notes.js');
var Articles = require('../models/posts.js');

db.on('error', console.error.bind(console, 'connection error:'));

function getLastArticles(number, cb){
	Articles.find({})
	.populate('notesList')
	.sort({'date': -1})
	.limit(number)
	.exec(function(err, data){
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
	Notes: Notes,
	getLastArticles: getLastArticles
};

