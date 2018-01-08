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
						console.log("Adding article to DB!");
						cb(true);
					}else{
						console.log("Article already exists!");
						cb(false);
					}
				});
			},
			message: "Title already in"
		}
	},
	body: String,
	url: String, 
	photoUrl: String,
	note: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }]
})
var Articles = mongoose.model("Articles", articleSchema);
module.exports = Articles;