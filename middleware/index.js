var Project=require("../models/projects");

var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.projectAuthCheck=function(req,res,next){
    Project.findById(req.params.id,function(err,foundProject){
        if(err){
            console.log(err);
        }
        else{
            if(req.isAuthenticated()){
                
                if(!foundProject){
                    return res.render("notfound");
                }
                
                if(foundProject.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
            else{
                req.flash("error","Please login to do that");
                res.redirect("/login");
            }
        }
    });
};

module.exports=middlewareObj;