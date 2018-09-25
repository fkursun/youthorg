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



// var data={
//     name:"Almanya Proje",
//     image:"https://gezievreni.com/wp-content/uploads/2016/12/Hollanda-Hakkinda-Bilmeniz-Gerekenler.jpg",
//     description:"Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur.",
//     author:{
//         id:currentUser._id,
//         username:"fkur"
//     },
//     ptype:"KA101",
//     subject:"Hate speech",
//     venue:"Holland/Orvelte",
//     dates:"18-25 February 2019",
//     poeplenumber:"4+1",
//     agelimit:"18-30",
//     partners:"Turkey,Czechia,UK,Belgium,Holland,Germany",
//     completed:false
// };

// Project.create(data,function(err,cp){
//   if(err){
//       console.log(err);
//   }
//   else{
//       console.log("data added");
//       console.log("-----------------");
//       console.log(cp);
//       console.log("-----------------");
//       console.log(cp.author);
      
//   }
// });


// var userData={
//   username:"fkur",
//   password:"130895f"
// };
// User.register(new User({username:userData.username}),userData.password,function(err,createdUser){
//   if(err){
//       console.log(err);
//   }
//   else{
//       console.log("Created User\n--------------");
//       console.log(createdUser);
//   }
// });



    //TO CONNECT TO LOCALHOST
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has started"); 
});