var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var Notes = require('../models/notes.js');
var Articles = require('../models/posts.js');

db.on('error', console.error.bind(console, 'connection error:'));

function getLastArticles(number, cb){
	Articles.find({}).populate('Notes').sort({'date': -1}).limit(number).then((data)=>{
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

