var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
//收入mongoose
var mongoose = require("mongoose");
var User = require("./models/user");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"todolist",

    store:new MongoStore({mongooseConnection:mongoose.connection})
}));
app.use(function (req, res, next) {
    res.locals.msg = {};
    res.locals.cookie = req.cookies;
    res.locals.session = req.session;
    next();
})
app.use(express.static("public"));
require("./tools/db");


app.set("view engine" , "ejs");
app.set("views" , "views");
app.use(require("./router/router"));
// app.use(require("./router/router1"))


app.use(function (req, res) {
    res.render("404");
});
app.listen(3000 , function () {
    console.log("ok");
})