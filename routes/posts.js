var express=require("express");
var router=express.Router();
var passport=require("passport");
var Project=require("../models/projects");
var User=require("../models/user");
var middleware=require("../middleware");
var fuzzySearch=require("fuzzy-search");

router.get("/ongoingProjects",function(req, res) {
   Project.find({completed:false},function(err, foundProject) {
      if(req.query.search){
         var searcher=new fuzzySearch(foundProject,['name','ptype','subject','venue','partners','dates'],{
            caseSensitive:false,
            sort:true
         });
         var results=searcher.search(req.query.search);
         if(results.length===0){
            req.flash("error","There is no project called  "+req.query.search+".");
            res.redirect("/ongoingProjects");
            return;
         }
         res.render("posts/ongoing-projects",{ongoingProjects:results});
         return;
      }
      else{
         if(err){
            res.render("notfound");
         }
         res.render("posts/ongoing-projects",{ongoingProjects:foundProject});
         return;
      }
   });
});

router.get("/ongoingProjects/:id",function(req, res) {
   Project.findById(req.params.id,function(err, foundProject) {
      if(err){
         res.render("notfound");
      }
      else{
         if(!foundProject){
            res.render("notfound");
         }
         Project.find({},function(err, allP) {
            if(err){
               console.log(err);
            }
            else{
               res.render("posts/show",{foundProject:foundProject,allP:allP});  
            }
         });  
      }
   });
});

router.delete("/ongoingProjects/:id",middleware.projectAuthCheck,function(req,res){
   Project.findByIdAndRemove(req.params.id,function(err, foundProject) {
       if(err){
          res.redirect("notfound");
       }
       if(!foundProject){
          req.flash("error","Project could not found");
          res.redirect("/ongoingProjects");
       }
       else{
          req.flash("success","Project is successfully removed!");
          res.redirect("/ongoingProjects");
       }
   });
});

router.get("/ongoingProjects/:id/edit",middleware.projectAuthCheck,function(req, res) {
   Project.findById(req.params.id,function(err, foundProject) {
      res.render("posts/edit",{project:foundProject}); 
   });
});

router.put("/ongoingProjects/:id",middleware.projectAuthCheck,function(req,res){
   Project.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundProject){
      if(err){
         res.render("notfound");
      }
      if(!foundProject){
         res.render("notfound");
      }
      else{
         req.flash("success","Project edited successfully");
         res.redirect("/ongoingProjects/"+req.params.id);
      }
   });
});

router.get("/completedProjects",function(req, res) {
   Project.find({completed:true},function(err, foundProject) {
      if(req.query.search){
         var searcher=new fuzzySearch(foundProject,['name','ptype','subject','venue','partners','dates'],{
            caseSensitive:false,
            sort:true
         });
         var results=searcher.search(req.query.search);
         console.log(results);
         if(results.length===0){
            req.flash("error","There is no project called  "+req.query.search+".");
            res.redirect("/completedProjects");
            return;
         }
         res.render("posts/completed-projects",{compProjects:results});
         return;
      }
      else{
         if(err){
            res.render("notfound");
         }
         else{
            res.render("posts/completed-projects",{compProjects:foundProject});
            return;
         }

      }
   });
});

router.get("/completedProjects/:id",function(req, res) {
   Project.findById(req.params.id,function(err,foundProject){
      if(err){
         res.render("notfound");
      }
      else{
         if(!foundProject){
            res.render("notfound");
         }
         Project.find({},function(err,allP) {
            res.render("posts/show",{foundProject:foundProject,allP:allP});  
         });
      }
   });
});

router.get("/completedProjects/:id/edit",middleware.projectAuthCheck,function(req, res) {
   Project.findById(req.params.id,function(err, foundProject) {
      res.render("posts/edit",{project:foundProject}); 
   });
});

router.put("/completedProjects/:id",middleware.projectAuthCheck,function(req,res){
   Project.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundProject){
      if(err){
         res.render("notfound");
      }
      if(!foundProject){
         res.render("notfound");
      }
      else{
         req.flash("success","Project edited successfully");
         res.redirect("/completedProjects/"+req.params.id);
      }
   });
});

router.delete("/completedProjects/:id",middleware.projectAuthCheck,function(req,res){
   Project.findByIdAndRemove(req.params.id,function(err, foundProject) {
       if(err){
          res.redirect("notfound");
       }
       if(!foundProject){
          req.flash("error","Project could not found");
          res.redirect("/completedProjects");
       }
       else{
          req.flash("success","Project is successfully removed!");
          res.redirect("/completedProjects");
       }
   });
});

router.post("/posts",middleware.isLoggedIn,function(req, res) {
   var name=req.body.blog.name;
   var description=req.body.blog.description;
   var image=req.body.blog.image;
   var ptype=req.body.blog.ptype;
   var subject=req.body.blog.subject;
   var venue=req.body.blog.venue;
   var dates=req.body.blog.dates;
   var peoplenumber=req.body.blog.peoplenumber;
   var agelimit=req.body.blog.agelimit;
   var partners=req.body.blog.partners;
   var author={
      id:req.user._id,
      username:req.user.username
   };
   var completed=req.body.blog.completed;
   
    Project.create({name:name,image:image,description:description,author:author,ptype:ptype,subject:subject,venue:venue,dates:dates,peoplenumber:peoplenumber,agelimit:agelimit,partners:partners,completed:completed,createdtime:(new Date).toLocaleDateString()},function(err,cp){
       if(err){
          console.log(err);
       }
       else{
          req.flash("success","Project created successfully");
          if(completed==="true"){
             res.redirect("/completedProjects");
          }
          else if(completed==="false"){
             res.redirect("/ongoingProjects");

          }
       }
    });
});


module.exports=router;