var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var Contact=require("../models/contact");

var middleware=require("../middleware");

router.get("/",function(req, res) {
    res.render("landing");
});

router.get("/index",function(req,res){
   res.render("posts/index",{page:'home'}); 
});


router.get("/login",function(req, res) {
    if(req.user){
        req.flash("error","You already logged in");
        res.redirect("/index");
    }
   res.render("login",{page:'login'}); 
});

router.post("/login",passport.authenticate("local",{successRedirect:"/index",failureRedirect:"/login"}),function(req, res) {

});

router.get("/contact",function(req, res) {
   res.render("contact",{page:'contact'}); 
});

router.post("/contact",function(req,res){
   Contact.create({name:req.body.contact.name,email:req.body.contact.email,subject:req.body.contact.subject,message:req.body.contact.message},function(err,cc){
       if(err){
           req.flash("error","A error occured");
           res.redirect("back");
       }
       else{
           console.log(cc);
           req.flash("success","Your message has been sent.");
           res.redirect("/contact");
       }
   });
});

router.get("/blog",function(req, res) {
   res.render("posts/blog");
});

router.get("/addproject",middleware.isLoggedIn,function(req, res) {
   res.render("posts/addProject",{page:'createproject'}); 
});

router.get("/logout",function(req, res) {
    if(!req.user){
        res.send("First You need login to logout ");
    }
    else{
        req.logout();
        req.flash("success","Logged you out");
        res.redirect("/index");   
    }
});

router.get("/scope",function(req, res) {
   res.render("scope",{page:'scope'});
});

router.get("/messages",middleware.isLoggedIn,function(req, res) {
   Contact.find({},function(err,fc){
       if(err){
           console.log(err);
       }
       else{
           res.render("contactmessages",{contact:fc,page:'messages'});
       }
   });
});


module.exports=router;