var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
	note: String
});
var Notes = mongoose.model("Notes", postSchema);
module.exports = Notes;