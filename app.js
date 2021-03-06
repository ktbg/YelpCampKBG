var express             =   require ('express'),
    app                 =   express(),
    bodyParser          =   require('body-parser'),
    mongoose            =   require('mongoose'),
    connect             =   require('connect-mongo'),
    flash               =   require('connect-flash'),
    passport            =   require('passport'),
    LocalStrategy       =   require("passport-local"),
    methodOverride      =   require("method-override"),
    User                =   require("./models/user"),
    Campground          =   require("./models/campground"),
    Comment             =   require("./models/comment"),
    seedDB              =   require("./seeds");

    require('dotenv').config();
// testing to log into github
// REQUIRING ROUTES
var commentRoutes       =   require("./routes/comments"),
    campgroundRoutes    =   require("./routes/campgrounds"),
    indexRoutes         =   require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//     useUnifiedTopology:true, 
//     useNewUrlParser: true
// });

mongoose.connect(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the database below
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"KBG is a goddess",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log("YelpCamp server has started");
});

// app.listen(3000, function(){
//     console.log("YelpCamp server has started");
// });