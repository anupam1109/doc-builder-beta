var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var versionSchema = new mongoose.Schema({
	comment : String,
	school_name : String,
	address : String,
	date : String,
	reason : String,
	name : String
});

versionSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Version", versionSchema);