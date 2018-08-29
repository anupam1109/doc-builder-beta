var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// var Version	= require('/version');

var documentSchema = new mongoose.Schema({
	name : String,
	Versions : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Version"
		}
	]
});

documentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Document", documentSchema);