var express     =   require("express"),
    router      =   express.Router({mergeParams: true}),
    Campground  =   require("../models/campground"),
    Comment     =   require("../models/comment"),
    middleware  =   require("../middleware");

// comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Campground not found");
        } else {
            // render new comment form
            res.render("comments/new", {campground: campground});
        };
    });  
});
// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup new comment using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Error, try again");
                } else {
                    // add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "New comment posted!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
}); 
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // check if the campgrouund ID is valid
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Cannot find that campground");
            return res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        }); 
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong. Please try updating your comment again");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
