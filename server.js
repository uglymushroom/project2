//requiring dontenv
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require("./models");
var app = express();
var passport = require("passport");
var PORT = process.env.PORT || 3000;
// you didnt have ; after the session requiring.....
var session = require("express-session");
// you need a cookie parser to actually get the browser to understand you're saving a session
var cookieParser = require("cookie-parser");
//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// making express use cookieparser. it pretty much auto does everything for you.
app.use(cookieParser());

// Middleware, you need to have this before you invoke passport with express
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

// For Passport
// dis formatting is making eslint so mad at me.
// use a less generic secret for encryption
// also changed resave and uninitialized to false cuz
// you only want to save/resave sessions in certain cases to save storage
app.use(
  session({
    secret: "arwkjtheuhtl4hTAahH%%^38^W5j",
    resave: false,
    saveUninitialized: false
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes x-x there's so many holy shoot... there are a few things
// you never required your passport strat and to my eyes, I dont see the passport strat referred to anywhere else.
// in general, the routes/controllers are set up very oddly
require("./routes/apiRoutes")(app);
require("./Controllers/login_controller")(app);
require("./Controllers/profile_controller")(app);
require("./Controllers/trip_controller")(app);
require("./Controllers/tripGroup_controller")(app);
require("./Controllers/admin_controller")(app);
require("./Controllers/group_controller")(app);
require("./routes/htmlRoutes")(app);
require("./routes/auth")(app, passport);
// here linke to passport strat and the db it connects to.
require("./config/passport/passport.js")(passport, db.user);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

//PASSPORT Authentication setup, i think this is from a guide... it doesn't serve a function so im commenting it out
// app.get('/', function(req, res) {
//     res.send('Welcome to Passport with Sequelize');
// });
// app.listen(3000, function(err) {
//     if (!err)
//         console.log("Site is live");
//     else console.log(err)
// });

// var passport   = require('passport')
// var session    = require('express-session')
// //For BodyParser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // For Passport
// app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// what does this do?! you dont have a .env file to define environment variables, taking it out
// var env = require('dotenv').load();

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function(err) {
    if (err) {
      console.log(err);
      // always good to consolelog errs
    } else {
      console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
      );
    }
  });
});
module.exports = app;
