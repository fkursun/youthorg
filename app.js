var express=require("express");
var bodyParser=require("body-parser");
var app=express();
var mongoose=require("mongoose");
var passport=require("passport");
var flash=require("connect-flash");
var methodOverride=require("method-override");

var LocalStrategy=require("passport-local");
var Project=require("./models/projects");

var User=require("./models/user");

mongoose.connect("mongodb://localhost:27017/impactive", { useNewUrlParser: true });

    //ROUTES DEFINE
var postRoute=require("./routes/posts");
var indexRoute=require("./routes/index");


    //APP SET,USE
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));


//PASSPORT CONFIGUrATION
app.use(require("express-session")({
   secret:"Dick head et",
   resave:false,
   saveUninitialized:false
}));

//PASSPORT USE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use(postRoute);
app.use(indexRoute);

app.use(function(req, res, next) {
    res.status(404);
    if(req.accepts('html')){
        res.render("notfound");
        return;
    }
});

    //TO CONNECT TO LOCALHOST
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has started"); 
});