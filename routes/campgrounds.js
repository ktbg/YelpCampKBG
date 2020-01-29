var express     =   require("express"),
    router      =   express.Router(),
    mongoose    =   require("mongoose");
    Campground  =   require("../models/campground"),
    middleware  =   require("../middleware");

mongoose.set('useFindAndModify', false);
// INDEX ROUTE  
router.get("/", function(req,res){
    // get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});
    
// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and add to cammpgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
//    create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        };
    });
});
// NEW campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    // find the campground with provided ID
    // Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
             // render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        };
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            req.flash("error", "Update error, please try again");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect somewhere - show page for that campground
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Could not delete campground");
            res.redirect("/campgrounds");
        } 
        req.flash("success", "Campground deleted!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;