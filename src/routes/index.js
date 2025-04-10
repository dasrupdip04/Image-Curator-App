var express = require('express');
var router = express.Router();
const userModel = require("./users.js");
const postModel = require("./posts.js")
const passport = require("passport");
const mongoose = require("mongoose");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });
});

router.get('/feed', function(req, res, next) {
  res.render('feed', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
  
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile', { title: 'Express' });
})

router.post("/register", function(req,res){
  const {username, email, fullname,password}= req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
    
  })

  
  userModel.register(userData, req.body.password, function(err, user){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile")
    })
  })
}) 

router.post("/login",passport.authenticate("local", {successRedirect:"/profile", failureRedirect:"/login"}),function(req,res){
  res.redirect("/profile")

})

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
