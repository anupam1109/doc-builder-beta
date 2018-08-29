var express			 		= require('express'),
	mongoose		 		= require('mongoose'),
	bodyParser		 		= require('body-parser'),
	passport		 		= require('passport'),
	LocalStrategy	 		= require('passport-local'),
	passportLocalMongoose	= require('passport-local-mongoose'),
	expressSession 			= require('express-session'),
	Version					= require('./models/version'),
	Document 				= require('./models/document')
	User					= require('./models/user');

mongoose.connect("mongodb://localhost/Document_help", { useNewUrlParser: true });

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.use(expressSession({
	secret : "Anything",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function isLoggedInForLoginPage(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.render("login", {title: "Login"});
}

function isLoggedInForRegisterPage(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.render("register", {title: "Register"});
}

function isLoggedInForLandingPage(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.render("index",{title: "DocBuilder"});
}

// Routes

app.get("/", isLoggedInForLandingPage, function(req, res){
	res.redirect("/private");
});

app.get("/register", isLoggedInForRegisterPage, function(req, res){
	res.redirect("/private");
});

app.post("/register", function(req, res){
	var password = req.body.password;

	var newUser = new User({
		username : req.body.username, 
		email	 : req.body.mail_id,
		name 	 : req.body.name
	});

	User.register(newUser, password, function(err, user){
		if(err) {
			console.log("Something went wrong!");
			console.log(err);
			return res.redirect("/register",{title: "Register"});
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/private");
		});
	});	 
});

app.get("/login", isLoggedInForLoginPage,  function(req, res){
	res.redirect("/private");
});

// app.get("/login", function(req, res){
// 	res.render("login",{title: "Login"});
// });

app.post("/login", passport.authenticate('local', {
	successRedirect : "/private",
	failureRedirect : "/login"
}), function(req, res){});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

app.get("/private", isLoggedIn, function(req, res){
	res.render("private")
});

app.get("/private/new", function(req,res){
	res.render("sample_form");
});

app.post("/private", function(req,res){
	var name = req.body.document_name;

	Document.create({
		name : name
	},function(err,document){
		User.findOne({username : "anupam1109@outlook.com"}, function(err,foundUser){
			if(err) {
				console.log(err);			
			} else {
				console.log(foundUser);
				foundUser.Documents.push(document);
				foundUser.save(function(err,data){
					if(err) {
						console.log(err);
					} else {
						console.log(data);
					}
				});
			}
		});
	});
});

app.post("/savedVersions", function(req,res){
	var school = req.body.school_name;
	var address = req.body.address;
	var date = req.body.date;
	var reason = req.body.reason;
	var name = req.body.name;
	var comment = req.body.comment;

	// comment : String,
	// school_name : String,
	// address : String,
	// date : String,
	// reason : String,
	// name : String

	Version.create({
		comment : comment,
		school_name : school,
		address : address,
		data : date,
		reason : reason,
		name : name
		},function(err,version){
			User.findOne({username : "anupam1109@outlook.com"}, function(err,foundUser){
				if(err) {
					console.log(err);			
				} else {
					// console.log(foundUser);
					Document.findOne({name : "Leave application"}, function(err,foundDocument){
						if(err) {
							console.log(err);
						} else {
							foundDocument.Versions.push(version);
							foundDocument.save(function(err,data){
								if(err) {
									console.log(err);
								} else {
									console.log(data);
								}
									});
						}
					});
					// foundUser.Documents.push(document);
					// foundUser.save(function(err,data){
					// 	if(err) {
					// 		console.log(err);
					// 	} else {
					// 		console.log(data);
					// 	}
					// });
				}
			});
		});

	res.redirect("/private");
	// Document.create({
	// 	name : "Leave application"
	// 	},function(err,document){
	// 		User.findOne({username : "anupam1109@outlook.com"}, function(err,foundUser){
	// 			if(err) {
	// 				console.log(err);			
	// 			} else {
	// 				console.log(foundUser);
	// 				foundUser.Documents.push(document);
	// 				foundUser.save(function(err,data){
	// 					if(err) {
	// 						console.log(err);
	// 					} else {
	// 						console.log(data);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	});
});

// Listening to the server

app.listen(process.env.PORT || 3000, function(){
    console.log(`Server is listening on 3000`);
});