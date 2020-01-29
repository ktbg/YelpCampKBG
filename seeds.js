var mongoose     = require("mongoose");
var Campground   = require("./models/campground");
var Comment      = require("./models/comment");

var seeds = [
    {
        name: "Yellowstone",
        image: "https://images.unsplash.com/photo-1501641466388-c67e34ec767e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment."
    },
    {
        name: "Big Sky",
        image: "https://images.unsplash.com/photo-1539904448813-19cddaea57fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Chocolate cake jelly pastry candy oat cake jelly beans jelly-o lollipop. Toffee cupcake soufflé dessert cupcake. Pie cookie macaroon. Gummies bonbon liquorice dragée tart. Jelly lollipop bonbon candy muffin. Toffee chupa chups ice cream cheesecake cookie jelly. Macaroon jelly muffin gummies biscuit donut. Oat cake powder jelly-o. Sesame snaps jujubes marzipan liquorice pie. Pudding caramels jelly-o icing powder carrot cake sesame snaps. Jelly beans marzipan jelly. Danish chocolate bar cake lemon drops tiramisu pie bear claw marshmallow macaroon."
    },
    {
        name: "Yosemite",
        image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "The ship's all yours. If the scanners pick up anything, report it immediately. All right, let's go. Hey down there, could you give us a hand with this? TX-four-one-two. Why aren't you at your post? TX-four-one-two, do you copy? Take over. We've got a bad transmitter. I'll see what I can do. You know, between his howling and your blasting everything in sight, it's a wonder the whole station doesn't know we're here. Bring them on! I prefer a straight fight to all this sneaking around. We found the computer outlet, sir. Plug in. He should be able to interpret the entire Imperial computer network."
    },
    {
        name: "Banff",
        image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Close your eyes. Picture a convict. What's he wearing? Nothing special - baseball cap on backward, baggy pants. He says something ordinary like, 'Yo, that's shizzle'. Okay, now slowly open your eyes again. Who are you picturing? A black man? Wrong. That was a white woman. Surprised? Well, shame on you."
    },
]

// function seedDB(){
//     // remove all campgrounds
//     Campground.deleteMany({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//         // add a few campgrounds
//         seeds.forEach(function(seed){
//             Campground.create(seed, function(err, data){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     console.log("added a campground");
//                     // create a comment on each campground
//                     Comment.create(
//                         {
//                             text: "This place is incredible, but I wish there was internet",
//                             author: "Homer"
//                         }, function(err, comment){
//                             if(err){
//                                 console.log(err)
//                             } else {
//                                 Campground.comments.push(comment);
//                                 Campground.save();
//                                 console.log("created new comment");
//                             }
//                         }
//                     );
//                 };
//             });
//         });
//     });
    
// };

// This does not cause an error, use this as the seed. 
// VID here: https://www.youtube.com/watch?v=D_q-sQCdZXw&t=383s
async function seedDB(){
    try{
         // remove all campgrounds
        await Comment.deleteMany({});
        console.log("comment removed");
        await Campground.deleteMany({});
        console.log("campgrounds removed");
        for(const seed of seeds){
            let campground = await Campground.create(seed);
            console.log("campground created");
            let comment = await Comment.create(
                {
                    text: "This place is incredible, but I wish there was internet",
                    author: "Homer"
                });
            console.log("comment created");
            campground.comments.push(comment);
            campground.save();
            console.log("comment added to campground");
        }
    } catch(err)  {
            console.log(err);
    }; 
};
module.exports = seedDB;
