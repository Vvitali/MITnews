var mongoose = require('mongoose');
//this schema will make a db-item for each artile on MIT-website 
var articleSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		validate: {
			isAsync: true,
			validator: function(name, cb){
				Articles.find({title: name}, function(err, data){
					if(data.length == 0){
						console.log("null");
						cb(true);
					}else{
						console.log("Notnull!");
						cb(false, "osh");
					}
				});
			},
			message: "Title already in"
		}
	},
	body: String,
	url: String, 
	photoUrl: String,
	note: String
})
var Articles = mongoose.model("Articles", articleSchema);
module.exports = Articles;