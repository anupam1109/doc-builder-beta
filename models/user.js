var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// var Document = require('/document');

var userSchema = new mongoose.Schema({
	name 	 : String,
	username : String,
	password : String,

	Documents : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Document"
		}
	]
});

// var userSchema = new mongoose.Schema({
// 	name 	 : String,
// 	username : String,
// 	password : String
// });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);